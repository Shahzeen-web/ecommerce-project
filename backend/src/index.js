import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import http from "http"; // ✅ Needed for WebSocket
import { Server as SocketIOServer } from "socket.io";

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Create HTTP server for WebSocket
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5175"],
    credentials: true,
  },
});

// ✅ Real-time cart events
io.on("connection", (socket) => {
  console.log("🟢 New WebSocket connection:", socket.id);

  socket.on("cart:update", (cart) => {
    console.log("🛒 Cart updated:", cart);
    socket.broadcast.emit("cart:updated", cart);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175"],
    credentials: true,
  })
);

// ✅ Stripe webhook must come before express.json
import webhookRoutes from "../routes/webhookRoutes.js";
app.use("/api/webhook", webhookRoutes);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// ✅ Serve static files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), { maxAge: "30d", etag: false })
);
app.use(
  express.static(path.join(__dirname, "../public"), { maxAge: "1d", etag: false })
);
app.use(
  "/images",
  express.static(path.join(__dirname, "../public/images"), { maxAge: "30d", etag: false })
);

// ✅ API Routes
import paymentRoutes from "../routes/paymentRoutes.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import adminReviewRoutes from "../routes/adminReviewRoutes.js";

app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.send("🚀 API is running successfully");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running with WebSocket at http://localhost:${PORT}`);
});

export default app;
