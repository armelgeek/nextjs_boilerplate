import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeConfig } from "@/lib/payments/stripe/config";
import Stripe from "stripe";
import { getClientIdentifier, createRateLimitMiddleware } from "@/lib/security/rate-limiter";
import { auditLogger, AuditEventType } from "@/lib/security/audit-logger";
import { createEventGuard } from "@/lib/security/webhook-event-store";
import {
  handleCheckoutSessionCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
} from "@/lib/webhooks/stripe/handlers";

const rateLimiter = createRateLimitMiddleware(100, 15 * 60 * 1000);

export async function POST(request: NextRequest) {
  const requestHeaders = await headers();
  const clientIp = getClientIdentifier(requestHeaders);

  const rateLimit = rateLimiter(clientIp);
  if (!rateLimit.allowed) {
    auditLogger.logSecurity(
      AuditEventType.RATE_LIMIT_EXCEEDED,
      "Webhook rate limit exceeded",
      {
        ipAddress: clientIp,
        metadata: {
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
      }
    );

    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetAt.toString(),
          "Retry-After": Math.ceil(rateLimit.resetAt / 1000).toString(),
        },
      }
    );
  }

  const body = await request.text();
  const signature = requestHeaders.get("stripe-signature");

  if (!signature) {
    auditLogger.logSecurity(
      AuditEventType.WEBHOOK_SIGNATURE_INVALID,
      "Missing webhook signature",
      { ipAddress: clientIp }
    );

    return NextResponse.json(
      { error: "Signature required" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeConfig.webhookSecret
    );

    auditLogger.logWebhook(
      AuditEventType.WEBHOOK_SIGNATURE_VALID,
      "success",
      "Webhook signature verified",
      {
        ipAddress: clientIp,
        webhookEventId: event.id,
        stripeEventType: event.type,
      }
    );
  } catch (error) {
    auditLogger.logWebhook(
      AuditEventType.WEBHOOK_SIGNATURE_INVALID,
      "failure",
      "Webhook signature verification failed",
      {
        ipAddress: clientIp,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    );

    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const eventGuard = createEventGuard(event.id, event.type, event.created);
  if (!eventGuard.shouldProcess) {
    auditLogger.logWebhook(
      AuditEventType.WEBHOOK_PROCESSING_ERROR,
      "warning",
      `Event skipped: ${eventGuard.reason}`,
      {
        webhookEventId: event.id,
        stripeEventType: event.type,
        metadata: { reason: eventGuard.reason },
      }
    );

    return NextResponse.json({ received: true, processed: false, reason: eventGuard.reason });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        auditLogger.logWebhook(
          AuditEventType.WEBHOOK_PROCESSING_ERROR,
          "warning",
          `Unhandled event type: ${event.type}`,
          {
            webhookEventId: event.id,
            stripeEventType: event.type,
          }
        );
    }

    eventGuard.markProcessed();

    return NextResponse.json(
      { received: true },
      {
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch (error) {
    auditLogger.logWebhook(
      AuditEventType.WEBHOOK_PROCESSING_ERROR,
      "failure",
      "Error processing webhook",
      {
        webhookEventId: event.id,
        stripeEventType: event.type,
        error: error instanceof Error ? error : new Error(String(error)),
      }
    );

    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}
