import axios from "axios";

// ✅ Use your deployed backend URL
const BASE_URL = "https://ecommerce-project-production-28e7.up.railway.app";

export const getProducts = async ({ search, category, sort, page }) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (sort) params.append("sort", sort);
  if (page) params.append("page", page);

  const { data } = await axios.get(`${BASE_URL}/api/products?${params.toString()}`);
  return data;
};
