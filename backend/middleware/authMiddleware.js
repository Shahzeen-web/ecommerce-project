import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Middleware to verify user token (used for general auth)
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Middleware to check if user is an admin
export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Only allow admin users
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // proceed to route
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// ✅ Alias to match `protect` usage
export const protect = authenticateToken;
