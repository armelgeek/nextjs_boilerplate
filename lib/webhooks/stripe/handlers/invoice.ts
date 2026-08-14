import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { auditLogger, AuditEventType } from "@/lib/security/audit-logger";
import { EmailService } from "@/lib/email-service";

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (!subscription) {
      auditLogger.logPayment(
        AuditEventType.PAYMENT_SUCCEEDED,
        "warning",
        "Subscription not found for invoice payment",
        {
          resourceId: invoice.id,
          metadata: { subscriptionId: invoice.subscription },
        }
      );
      return;
    }

    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        stripePaymentId: invoice.payment_intent as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: "succeeded",
        description: `Invoice payment for subscription ${subscription.id}`,
      },
    });

    auditLogger.logPayment(
      AuditEventType.PAYMENT_SUCCEEDED,
      "success",
      "Invoice payment recorded",
      {
        userId: subscription.userId,
        resourceId: invoice.payment_intent as string,
        metadata: {
          amount: invoice.amount_paid,
          currency: invoice.currency,
          invoiceId: invoice.id,
        },
      }
    );

    try {
      const user = await prisma.user.findUnique({
        where: { id: subscription.userId },
        select: { email: true, name: true },
      });
      if (user) {
        const emailService = new EmailService();
        await emailService.sendEmail({
          recipients: [user.email],
          type: "payment_receipt",
          data: {
            recipientEmail: user.email,
            recipientName: user.name || user.email.split("@")[0],
            invoiceId: invoice.payment_intent as string,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency.toUpperCase(),
            paymentDate: new Date().toLocaleDateString(),
            description: `Invoice payment for subscription ${subscription.id}`,
          },
        });
      }
    } catch (emailError) {
      console.error("Failed to send payment receipt email:", emailError);
    }
  } catch (error) {
    auditLogger.logPayment(
      AuditEventType.PAYMENT_FAILED,
      "failure",
      "Failed to record invoice payment",
      {
        resourceId: invoice.id,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    );
    throw error;
  }
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (!subscription) {
      auditLogger.logPayment(
        AuditEventType.PAYMENT_FAILED,
        "warning",
        "Subscription not found for failed invoice",
        {
          resourceId: invoice.id,
          metadata: { subscriptionId: invoice.subscription },
        }
      );
      return;
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "past_due" },
    });

    auditLogger.logPayment(
      AuditEventType.PAYMENT_FAILED,
      "failure",
      "Invoice payment failed",
      {
        userId: subscription.userId,
        resourceId: invoice.id,
        metadata: {
          amount: invoice.amount_due,
          currency: invoice.currency,
          subscriptionId: subscription.id,
        },
      }
    );
  } catch (error) {
    auditLogger.logPayment(
      AuditEventType.PAYMENT_FAILED,
      "failure",
      "Failed to process failed invoice",
      {
        resourceId: invoice.id,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    );
    throw error;
  }
}
