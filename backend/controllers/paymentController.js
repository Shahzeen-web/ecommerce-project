import dotenv from "dotenv";
dotenv.config(); // ✅ Load env variables

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Now works

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // Convert amount to cents (Stripe uses smallest currency unit)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error.message);
    res.status(500).json({ error: "Payment Intent Creation Failed" });
  }
};
