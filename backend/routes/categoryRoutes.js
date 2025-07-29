import express from "express";
import { PrismaClient } from "@prisma/client";
import { getCategories } from "../controllers/categoryController.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Basic categories route (used in product filters)
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Optional: categories with products (used for admin or debugging)
router.get("/with-products", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories with products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
