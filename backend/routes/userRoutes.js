import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// Public test route
router.get("/test", (req, res) => {
  res.send("✅ User test route is working!");
});

// Protected test route
router.get("/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Protected profile route
router.get("/profile", protect, getUserProfile);

// ✅ Export using ES Module style
export default router;
