import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      try {
        const res = await axios.get(`${API_URL}/api/products/autocomplete`, {
          params: { query },
        });
        setSuggestions(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Autocomplete fetch failed:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, fetchSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      newParams.set("search", inputValue.trim());
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
    setSuggestions([]);
  };

  const handleSelectSuggestion = (product) => {
    setInputValue("");
    setSuggestions([]);
    navigate(`/product/${product.id}`);
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
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border mt-1 w-full z-50 shadow rounded">
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
