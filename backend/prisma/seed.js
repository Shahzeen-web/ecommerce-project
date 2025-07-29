import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ✅ Cleanup old data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // ✅ Create admin user
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "shahzeenayesha16@gmail.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // ✅ Create categories
  const electronics = await prisma.category.create({ data: { name: "Electronics" } });
  const books = await prisma.category.create({ data: { name: "Books" } });
  const appliances = await prisma.category.create({ data: { name: "Home Appliances" } });

  // ✅ Create products with updated local image paths
  await prisma.product.create({
    data: {
      name: "Wireless Bluetooth Headphones",
      description: "Experience crystal clear sound with long battery life.",
      price: 8999,
      imageUrl: "/images/headphones.webp",
      category: { connect: { id: electronics.id } },
    },
  });

  await prisma.product.create({
    data: {
      name: "The Pragmatic Programmer",
      description: "A classic book for software developers and engineers.",
      price: 2999,
      imageUrl: "/images/books.webp",
      category: { connect: { id: books.id } },
    },
  });

  await prisma.product.create({
    data: {
      name: "Smart Electric Kettle",
      description: "Boil water quickly with this smart stainless steel kettle.",
      price: 4599,
      imageUrl: "/images/electrickettle.webp",
      category: { connect: { id: appliances.id } },
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
