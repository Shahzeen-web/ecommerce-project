import Stripe from "stripe";
import dotenv from "dotenv";
import { sendEmail } from "../utils/emailService.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle payment success
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const customerEmail = paymentIntent.receipt_email || "your-email@gmail.com";

    await sendEmail({
      to: customerEmail,
      subject: "🧾 Payment Confirmation - Ecommerce Store",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your payment of <strong>${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}</strong> was successful.</p>
        <p>Transaction ID: ${paymentIntent.id}</p>
      `,
    });

    console.log("✅ Email sent for payment:", paymentIntent.id);
  }

  res.status(200).send("✅ Webhook received");
};
