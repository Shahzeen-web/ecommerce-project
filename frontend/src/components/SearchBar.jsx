import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";

  // 🔍 Debounced fetch for autocomplete
  const fetchSuggestions = async (query) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/autocomplete?query=${query}`
      );
      setSuggestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      setSuggestions([]);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    if (inputValue.trim()) {
      debouncedFetch(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      newParams.set("search", inputValue);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
    setSuggestions([]);
  };

  const handleSelectSuggestion = (product) => {
    navigate(`/product/${product.id}`);
    setSuggestions([]);
    setInputValue(""); // Optional: reset input
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md w-full">
      <input
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border px-4 py-2 rounded focus:outline-none"
      />
      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-200 mt-1 rounded w-full shadow-md z-50">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelectSuggestion(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
