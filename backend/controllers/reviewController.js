import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 POST: Submit a review
export const createReview = async (req, res) => {
  const { rating, comment, imageUrl, productId } = req.body;
  const userId = req.user.id; // Requires user authentication middleware

  try {
    // Prevent duplicate review by same user for same product
    const existing = await prisma.review.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      return res.status(400).json({
        message: "You've already reviewed this product.",
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        imageUrl,
        productId,
        userId,
      },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Error creating review:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

// 🔹 GET: Approved reviews for a product
export const getProductReviews = async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    // ✅ Fixed: Wrap in { reviews } to match frontend expectations
    res.json({ reviews });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
