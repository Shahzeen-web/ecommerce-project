import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

// 👤 Public auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Admin login (same controller, but will block non-admin)
router.post("/admin/login", loginUser);

export default router;
