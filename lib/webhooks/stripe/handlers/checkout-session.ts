import Stripe from "stripe";
import { stripe } from "@/lib/payments/stripe/config";
import { prisma } from "@/lib/prisma";
import { auditLogger, AuditEventType } from "@/lib/security/audit-logger";
import { EmailService } from "@/lib/email-service";

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  auditLogger.logPayment(
    AuditEventType.CHECKOUT_SESSION_COMPLETED,
    "success",
    "Processing checkout session completed",
    {
      userId,
      resourceId: session.id,
      metadata: { subscriptionId, customerId, planId },
    }
  );

  if (!userId || !planId) {
    auditLogger.logPayment(
      AuditEventType.CHECKOUT_SESSION_FAILED,
      "failure",
      "Missing metadata in checkout session",
      {
        resourceId: session.id,
        metadata: { hasUserId: !!userId, hasPlanId: !!planId },
      }
    );
    return;
  }

  if (!subscriptionId) {
    auditLogger.logPayment(
      AuditEventType.CHECKOUT_SESSION_FAILED,
      "failure",
      "No subscription ID in checkout session",
      {
        userId,
        resourceId: session.id,
      }
    );
    return;
  }

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      auditLogger.logPayment(
        AuditEventType.PAYMENT_VALIDATION_FAILED,
        "failure",
        "Plan not found for checkout session",
        {
          userId,
          resourceId: session.id,
          metadata: { planId },
        }
      );
      throw new Error(`Plan not found: ${planId}`);
    }

    if (session.amount_total !== plan.amount) {
      auditLogger.logPayment(
        AuditEventType.PAYMENT_VALIDATION_FAILED,
        "failure",
        "Amount mismatch in checkout session",
        {
          userId,
          resourceId: session.id,
          metadata: {
            expected: plan.amount,
            received: session.amount_total,
            sessionId: session.id,
          },
        }
      );
      throw new Error(
        `Amount mismatch: expected ${plan.amount}, got ${session.amount_total}`
      );
    }

    if (session.currency !== plan.currency) {
      auditLogger.logPayment(
        AuditEventType.PAYMENT_VALIDATION_FAILED,
        "failure",
        "Currency mismatch in checkout session",
        {
          userId,
          resourceId: session.id,
          metadata: {
            expected: plan.currency,
            received: session.currency,
          },
        }
      );
      throw new Error(
        `Currency mismatch: expected ${plan.currency}, got ${session.currency}`
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true, name: true },
    });

    if (user?.stripeCustomerId && session.customer !== user.stripeCustomerId) {
      auditLogger.logPayment(
        AuditEventType.PAYMENT_VALIDATION_FAILED,
        "failure",
        "Customer ID mismatch in checkout session",
        {
          userId,
          resourceId: session.id,
          metadata: {
            expected: user.stripeCustomerId,
            received: session.customer,
          },
        }
      );
      throw new Error(
        `Customer mismatch: expected ${user.stripeCustomerId}, got ${session.customer}`
      );
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionInterval =
      subscription.items.data[0]?.price?.recurring?.interval;
    if (!subscriptionInterval || subscriptionInterval !== plan.interval) {
      auditLogger.logPayment(
        AuditEventType.PAYMENT_VALIDATION_FAILED,
        "failure",
        "Subscription interval mismatch in checkout session",
        {
          userId,
          resourceId: session.id,
          metadata: {
            expected: plan.interval,
            received: subscriptionInterval ?? null,
          },
        }
      );
      throw new Error(
        `Interval mismatch: expected ${plan.interval}, got ${subscriptionInterval}`
      );
    }

    const dbSubscription = await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      update: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      create: {
        userId,
        planId,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    auditLogger.logPayment(
      AuditEventType.SUBSCRIPTION_CREATED,
      "success",
      "Subscription created successfully",
      {
        userId,
        resourceId: dbSubscription.id,
        metadata: {
          stripeSubscriptionId: subscriptionId,
          planId,
          status: subscription.status,
        },
      }
    );

    try {
      if (user) {
        const emailService = new EmailService();
        await emailService.sendEmail({
          recipients: [user.email],
          type: "subscription_created",
          data: {
            recipientEmail: user.email,
            recipientName: user.name || user.email.split("@")[0],
            planName: planId,
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ).toLocaleDateString(),
          },
        });
      }
    } catch (emailError) {
      console.error("Failed to send subscription confirmation email:", emailError);
    }

    if (session.payment_intent) {
      await prisma.payment.create({
        data: {
          userId,
          stripePaymentId: session.payment_intent as string,
          amount: session.amount_total!,
          currency: session.currency!,
          status: "succeeded",
          description: `Subscription payment for plan ${planId}`,
        },
      });

      auditLogger.logPayment(
        AuditEventType.PAYMENT_SUCCEEDED,
        "success",
        "Payment record created",
        {
          userId,
          resourceId: session.payment_intent as string,
          metadata: {
            amount: session.amount_total,
            currency: session.currency,
          },
        }
      );
    }
  } catch (error) {
    auditLogger.logPayment(
      AuditEventType.CHECKOUT_SESSION_FAILED,
      "failure",
      "Error in handleCheckoutSessionCompleted",
      {
        userId,
        resourceId: session.id,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    );
    throw error;
  }
}
