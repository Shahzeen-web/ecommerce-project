import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAdminStats = async (req, res) => {
  try {
    const usersCount = await prisma.user.count();
    const productsCount = await prisma.product.count();
    const orders = await prisma.order.findMany();

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      usersCount,
      productsCount,
      ordersCount: orders.length,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
