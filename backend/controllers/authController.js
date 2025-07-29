import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Generate JWT Token (includes name/username)
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      name: user.username, // ✅ Include name for frontend
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Register Controller
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    const token = generateToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({
        user: {
          id: user.id,
          username: user.username, // ✅ Add name
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// ✅ Login Controller (for user + admin)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Block normal users from accessing admin login
  if (req.path.includes("/admin") && user.role !== "admin") {
    return res.status(403).json({ message: "Admins only can login here" });
  }

  const token = generateToken(user);

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      user: {
        id: user.id,
        username: user.username, // ✅ Add name
        email: user.email,
        role: user.role,
      },
      token,
    });
};
