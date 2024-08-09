import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
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
    if (err! instanceof Error) console.log(err);
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
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "payment_intent.created":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent Created: ${data.status}`);
          console.log(data.metadata)

        case "payment_intent.payment_failed":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case "payment_intent.canceled":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case "payment_intent.succeeded":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${data.status}`);

          if (!data.metadata.id) {
            console.log('❌ [FATAL] USER DIDNT PASS IN AUTH')
          } else {
            console.log(`💰 PaymentIntent updating paid status: ${data.metadata}`);
            await prisma.user.update({
              where: {
                id: data.metadata.id,
              },
              data: {
                paid: true
              },
            });
          }

          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}