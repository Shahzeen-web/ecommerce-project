import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { authenticateToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticateToken, verifyAdmin, getAdminStats);

export default router;
