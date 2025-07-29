import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendEmail } from "../utils/emailService.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle payment success
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const email = paymentIntent.receipt_email || "your-email@gmail.com";

      console.log("✅ Payment succeeded for:", paymentIntent.id);

      // ✅ Send confirmation email
      await sendEmail({
        to: email,
        subject: "🧾 Payment Confirmation - Ecommerce Store",
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Your payment of <strong>${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}</strong> was successful.</p>
          <p>Transaction ID: ${paymentIntent.id}</p>
        `,
      });
    }

    res.json({ received: true });
  }
);

export default router;
