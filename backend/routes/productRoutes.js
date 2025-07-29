// routes/productRoutes.js
import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSuggestions,
} from "../controllers/productController.js";

import { authenticateToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Autocomplete suggestions (⚠️ must come before :id)
router.get("/autocomplete", getProductSuggestions);

// ✅ Get all products (public)
router.get("/", getProducts);

// ✅ Get a single product by ID (public)
router.get("/:id", getProductById);

// 🔐 Admin Routes (Protected)
router.post("/", authenticateToken, verifyAdmin, createProduct); // Create
router.put("/:id", authenticateToken, verifyAdmin, updateProduct); // Update
router.delete("/:id", authenticateToken, verifyAdmin, deleteProduct); // Delete

export default router;
