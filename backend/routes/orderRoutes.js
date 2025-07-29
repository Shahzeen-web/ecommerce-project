import express from "express";
import { createOrder, getOrdersByUser } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder); // ✅ Place order
router.get("/user/:userId", getOrdersByUser); // ✅ Fetch order history

export default router;
