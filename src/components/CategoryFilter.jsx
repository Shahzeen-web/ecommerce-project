// frontend/src/components/CategoryFilter.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Load from env

const CategoryFilter = ({ selected, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories", err));
  }, []);

  return (
    <div className="mb-4 flex gap-3 flex-wrap">
      <button
        className={`px-4 py-2 rounded ${selected === "" ? "bg-black text-white" : "bg-gray-200"}`}
        onClick={() => onChange("")}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-4 py-2 rounded ${selected === cat.id ? "bg-black text-white" : "bg-gray-200"}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
