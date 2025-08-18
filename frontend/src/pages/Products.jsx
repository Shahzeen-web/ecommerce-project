import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://ecommerce-project-production-28e7.up.railway.app/api/products")
      .then((res) => {
        setProducts(res.data.products); // correctly access the array
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch products.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>All Products | E-Commerce Store</title>
        <meta name="description" content="Browse all available products in our store." />
      </Helmet>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Products</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-xl p-4 shadow">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-blue-600 font-bold">PKR {product.price}</p>
              <p className="text-sm text-gray-500">Category: {product.category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
