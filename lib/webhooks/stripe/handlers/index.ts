import Stripe from "stripe";
import { db } from "@/lib/db";

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (!session.customer || !session.subscription) {
    throw new Error("Missing customer or subscription in checkout session");
  }

  const customerId = typeof session.customer === "string"
    ? session.customer
    : session.customer.id;

  const subscriptionId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription.id;

  await db.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionId },
    create: {
      userId: session.metadata?.userId || "",
      planId: session.metadata?.planId || "",
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
      status: "active",
      currentPeriodStart: new Date(session.created * 1000),
      currentPeriodEnd: new Date(),
    },
    update: {
      status: "active",
      stripeCustomerId: customerId,
    },
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const status = subscription.status === "active" ? "active" : "inactive";

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: "canceled" },
  });
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    return;
  }

  const subscriptionId = typeof invoice.subscription === "string"
    ? invoice.subscription
    : invoice.subscription.id;

  await db.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "active" },
  });
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    return;
  }

  const subscriptionId = typeof invoice.subscription === "string"
    ? invoice.subscription
    : invoice.subscription.id;

  await db.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "past_due" },
  });
}
