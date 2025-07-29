import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET: Fetch all unapproved reviews
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: { user: { select: { name: true } } },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending reviews" });
  }
});

// PUT: Approve or reject a review
router.put("/:id", protect, adminOnly, async (req, res) => {
  const reviewId = parseInt(req.params.id);
  const { isApproved } = req.body;

  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });

    res.json({ message: "Review updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
});

export default router;
