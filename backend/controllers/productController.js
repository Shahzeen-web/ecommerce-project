import { PrismaClient } from "@prisma/client";
import cache from "../utils/cache.js";

const prisma = new PrismaClient();

// ✅ GET /api/products (with caching, search, filters, sort, pagination)
export const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      page = 1,
      limit = 12,
      sort = "",
      minPrice,
      maxPrice,
    } = req.query;

    const pageNum = parseInt(page);
    const take = parseInt(limit);
    const skip = (pageNum - 1) * take;

    const priceFilter = {};
    if (minPrice) priceFilter.gte = parseInt(minPrice);
    if (maxPrice) priceFilter.lte = parseInt(maxPrice);

    const categoryId = category ? parseInt(category) : null;

    let orderBy = {};
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "name-asc") orderBy = { name: "asc" };
    else if (sort === "name-desc") orderBy = { name: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const cacheKey = `products:${req.url}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const whereClause = {};

    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      whereClause.price = priceFilter;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      skip,
      take,
      orderBy,
      include: { category: true },
    });

    const total = await prisma.product.count({ where: whereClause });

    const response = {
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / take),
      pageSize: take,
      hasNextPage: pageNum * take < total,
      hasPrevPage: pageNum > 1,
    };

    cache.set(cacheKey, response, 60); // cache for 60 seconds
    res.json(response);
  } catch (error) {
    console.error("\u274C Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// ✅ GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `product:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    cache.set(cacheKey, product, 60);
    res.json(product);
  } catch (error) {
    console.error("\u274C Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error fetching product" });
  }
};

// ✅ GET /api/products/autocomplete?query=...
export const getProductSuggestions = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.json([]);
  }

  try {
    const suggestions = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 8,
    });

    res.json(suggestions);
  } catch (error) {
    console.error("\u274C Error fetching product suggestions:", error);
    res.status(500).json({ message: "Server error fetching suggestions" });
  }
};

// ✅ POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        imageUrl,
        categoryId: parseInt(categoryId),
      },
      include: { category: true },
    });

    cache.clear(); // clear cache on create
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("\u274C Error creating product:", error);
    res.status(500).json({ message: "Server error creating product" });
  }
};

// ✅ PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl, categoryId } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseInt(price),
        imageUrl,
        categoryId: parseInt(categoryId),
      },
      include: { category: true },
    });

    cache.clear(); // clear cache on update
    res.json(updatedProduct);
  } catch (error) {
    console.error("\u274C Error updating product:", error);
    res.status(500).json({ message: "Server error updating product" });
  }
};

// ✅ DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    cache.clear(); // clear cache on delete
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("\u274C Error deleting product:", error);
    res.status(500).json({ message: "Server error deleting product" });
  }
};
