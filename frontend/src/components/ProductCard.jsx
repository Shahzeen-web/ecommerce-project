import React from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Use environment variable

export default function ProductCard({ product }) {
  const imageUrl = product.imageUrl?.startsWith("http")
    ? product.imageUrl
    : `${API_URL}${
        product.imageUrl?.startsWith("/") ? product.imageUrl : `/images/${product.imageUrl}`
      }`;

  return (
    <Link
      to={`/product/${product.id}`}
      className="block border rounded-lg shadow-sm hover:shadow-md transition duration-200"
    >
      {/* 🖼️ Product Image */}
      <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-t-lg bg-white">
        <img
          src={imageUrl}
          alt={product.name}
          className="max-h-full object-contain"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${API_URL}/images/placeholder.webp`; // ✅ Fixed fallback image too
          }}
        />
      </div>

      {/* 📦 Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {product.description}
        </p>
        <p className="text-blue-600 font-bold mt-2">Rs {product.price}</p>
      </div>
    </Link>
  );
}
