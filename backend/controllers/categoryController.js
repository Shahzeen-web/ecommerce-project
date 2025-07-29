import { PrismaClient } from "@prisma/client";
import cache from "../utils/cache.js"; 

const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
  try {
    // ✅ Try to get categories from cache
    const cachedCategories = cache.get("categories");
    if (cachedCategories) {
      return res.json(cachedCategories);
    }

    // ✅ Fetch from DB if not in cache
    const categories = await prisma.category.findMany();

    // ✅ Save to cache for 5 minutes
    cache.set("categories", categories);

    res.json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};
