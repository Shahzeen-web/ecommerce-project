import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import SearchBar from "../components/SearchBar";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page") || 1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", { search, category, sort, page }],
    queryFn: () => getProducts({ search, category, sort, page }),
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories", err));
  }, []);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error || !data) return <div className="p-6 text-red-600">Failed to load products.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      {/* 🔍 Search Bar */}
      <SearchBar />

      {/* 🔽 Filters */}
      <div className="flex flex-wrap gap-4 mt-4 mb-6">
        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          value={sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price Low to High</option>
          <option value="price-desc">Price High to Low</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>

      {/* 🛒 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.products.length > 0 ? (
          data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-gray-500">No products found.</div>
        )}
      </div>

      {/* ⏭ Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handleFilterChange("page", p)}
            className={`px-3 py-1 border rounded ${
              p === page ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
  
    </div>
  );
}
