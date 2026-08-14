import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { auditLogger, AuditEventType } from "@/lib/security/audit-logger";
import { EmailService } from "@/lib/email-service";

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  try {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    auditLogger.logPayment(
      AuditEventType.SUBSCRIPTION_UPDATED,
      "success",
      "Subscription updated",
      {
        resourceId: subscription.id,
        metadata: {
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      }
    );
  } catch (error) {
    auditLogger.logPayment(
      AuditEventType.SUBSCRIPTION_UPDATED,
      "failure",
      "Failed to update subscription",
      {
        resourceId: subscription.id,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    );
    throw error;
  }
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  try {
    const dbSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: "canceled",
      },
    });

    auditLogger.logPayment(
      AuditEventType.SUBSCRIPTION_DELETED,
      "success",
      "Subscription deleted",
      {
        resourceId: subscription.id,
      }
    );

    if (dbSubscription) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: dbSubscription.userId },
          select: { email: true, name: true },
        });
        if (user) {
          const emailService = new EmailService();
          await emailService.sendEmail({
            recipients: [user.email],
            type: "subscription_cancelled",
            data: {
              recipientEmail: user.email,
              recipientName: user.name || user.email.split("@")[0],
            },
          });
        }
      } catch (emailError) {
        console.error("Failed to send subscription cancellation email:", emailError);
      }
    }
  } catch (error) {
    auditLogger.logPayment(
      AuditEventType.SUBSCRIPTION_DELETED,
      "failure",
      "Failed to delete subscription",
      {
        resourceId: subscription.id,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    );
    throw error;
  }
}
