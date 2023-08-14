import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = 'http://localhost:3000';

export default async function handler(req, res) {
  const data = req.body;
  if (req.method === "POST") {
    try {
      console.log(data.item.name);
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        // customer: '{{CUSTOMER_ID}}',
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: data.item.name,
              },
              unit_amount: 100 * req.body.item.price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        allow_promotion_codes: true,
        success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });
      res.json({ id: session.id });
      res.redirect(200, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
