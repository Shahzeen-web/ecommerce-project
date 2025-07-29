import axios from "axios";

export const getProducts = async ({ search, category, sort, page }) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (sort) params.append("sort", sort);
  if (page) params.append("page", page);

  const { data } = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
  return data;
};
