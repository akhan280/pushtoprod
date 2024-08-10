import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const formData = await req.text();
  const params = new URLSearchParams(formData);

  const userId = params.get("user_id");
  const action = params.get("action");

  console.log('[Checkout-session]', { user_id: userId, action: action });

  let priceId;
  let mode;

  if (action === "license") { 
    priceId = 'price_1PlyYgBJ7fSA3YoAEavSAeqR';
    mode = "payment";
  } else if (action === "managed-ai") {
    priceId = 'price_1PmAd1BJ7fSA3YoA73q1qQEi';
    mode = "subscription";
  } else {
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
  }

  try {
    // Create or retrieve customer
    let customer;
    try {
      customer = await stripe.customers.create({
        metadata: {
          userId: userId,
        },
      });
      console.log(`Customer created with ID: ${customer.id}`);
    } catch (customerError) {
      console.error('Error creating customer:', customerError);
      return NextResponse.json({ error: "Error creating customer" }, { status: 500 });
    }

    const sessionData: any = {
      mode: mode,
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${headersList.get("origin")}/onboarding`,
      cancel_url: `${headersList.get("origin")}/`,
    };

    // Conditionally add metadata for both payment and subscription modes
    if (mode === "payment") {
      sessionData.payment_intent_data = {
        metadata: {
          userId: userId,
        },
      };
    } else if (mode === "subscription") {
      sessionData.subscription_data = {
        metadata: {
          userId: userId,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    return NextResponse.redirect(session.url, { status: 303 });

  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
  }
}