import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { metadata } from "../../layout";

const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const formData = await req.text(); // Get the raw form body as a string
  const params = new URLSearchParams(formData); // Parse the form data
  const userId = params.get("user_id"); // Extract the user_id

  console.log('[Checkout-session]', { user_id: userId });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: `price_1PlyYgBJ7fSA3YoAEavSAeqR`,
          quantity: 1,
        },
      ],
      success_url: `${headersList.get("origin")}/onboarding`,
      cancel_url: `${headersList.get("origin")}/`,
      payment_intent_data: {
        metadata: {
            id: userId
        }
      }
    });

    return NextResponse.redirect(session.url, { status: 303 });

} catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}
