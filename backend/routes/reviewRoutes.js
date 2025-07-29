import express from "express";
import {
  createReview,
  getProductReviews
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js"; // your auth middleware

const router = express.Router();

// POST /api/reviews - Submit a new review
router.post("/", protect, createReview);

// GET /api/reviews/:productId - Get approved reviews for a product
router.get("/:productId", getProductReviews);

export default router;
