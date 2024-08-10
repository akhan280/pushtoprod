import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY || "")
const prisma = new PrismaClient();

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  console.log("✅ Successfully Constructed Event:", event.id, event.type);

  const permittedEvents: string[] = [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "payment_intent.requires_action",
    "payment_intent.created",
    "customer.subscription.created",
    "customer.subscription.deleted",
    "invoice.paid",
  ];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "payment_intent.created":
          await handlePaymentIntentCreated(event.data.object as Stripe.PaymentIntent);
          break;

        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case "payment_intent.payment_failed":
        case "payment_intent.canceled":
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case "customer.subscription.created":
        case "invoice.paid":
          await handleSubscriptionEvent(event);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}

async function handlePaymentIntentCreated(paymentIntent: Stripe.PaymentIntent) {
  console.log(`💰 PaymentIntent Created: ${paymentIntent.status}`);
  console.log(paymentIntent.metadata);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);

  if (!paymentIntent.metadata.userId) {
    console.log('❌ [ERROR] User ID not found in payment intent metadata');
    return;
  }

  console.log(`💰 PaymentIntent updating paid status: ${paymentIntent.metadata.userId}`);
  await prisma.user.update({
    where: {
      id: paymentIntent.metadata.userId,
    },
    data: {
      paid: true,
    },
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`);
}

async function handleSubscriptionEvent(event: Stripe.Event) {
  let subscription: Stripe.Subscription;
  let customerId: string;

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    customerId = invoice.customer as string;
  } else {
    subscription = event.data.object as Stripe.Subscription;
    customerId = subscription.customer as string;
  }

  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted) {
    console.log('❌ [ERROR] Customer has been deleted');
    return;
  }

  const userId = (customer as Stripe.Customer).metadata?.userId;
  if (!userId) {
    console.log('❌ [ERROR] User ID not found in customer metadata');
    return;
  }

  console.log(`🔔 Subscription event: Setting managedAI to true for user: ${userId}`);
  await prisma.user.update({
    where: { id: userId },
    data: { managedAI: true },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted) {
    console.log('❌ [ERROR] Customer has been deleted');
    return;
  }

  const userId = (customer as Stripe.Customer).metadata?.userId;
  if (!userId) {
    console.log('❌ [ERROR] User ID not found in customer metadata');
    return;
  }

  console.log(`🔔 Subscription canceled for user: ${userId}. managedAI status remains unchanged.`);
  // If you want to update managedAI status on cancellation, uncomment the following:
  await prisma.user.update({
    where: { id: userId },
    data: { managedAI: false },
  });
}