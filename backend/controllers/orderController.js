import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/emailService.js";

const prisma = new PrismaClient();

// ✅ CREATE ORDER (used during checkout)
export const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, billingAddress, totalAmount } = req.body;

    // Validate required fields
    if (!userId || !items || !shippingAddress || !billingAddress || !totalAmount) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    // Create the order with nested items
    const newOrder = await prisma.order.create({
      data: {
        userId,
        shippingAddress,
        billingAddress,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // ✅ Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // ✅ Send confirmation email
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "🧾 Order Confirmation - Ecommerce Store",
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your order <strong>#${newOrder.id}</strong> has been placed successfully.</p>
          <p><strong>Total Amount:</strong> Rs. ${newOrder.totalAmount}</p>
          <p>We’ll notify you once it’s shipped.</p>
          <br />
          <p>Regards,<br/>Ecommerce Store Team</p>
        `,
      });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ Order Creation Error:", error);
    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};

// ✅ GET ORDERS BY USER (for order history)
export const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("❌ Failed to fetch user orders:", error);
    res.status(500).json({ message: "Could not get user orders" });
  }
};
