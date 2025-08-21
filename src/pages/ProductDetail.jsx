import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";
import { useCartStore } from "../store/cartStore";

// ✅ Use live backend URL for GitHub Pages
const API_URL = "https://ecommerce-project-production-28e7.up.railway.app";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch product
        const productRes = await axios.get(`${API_URL}/api/products/${id}`);

        // Fetch reviews
        const reviewsRes = await axios.get(`${API_URL}/api/reviews/${id}`);
        const fetchedReviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

        // Calculate average rating
        const totalRating = fetchedReviews.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = fetchedReviews.length ? totalRating / fetchedReviews.length : 0;

        setProduct({ ...productRes.data, avgRating });
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching product or reviews:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  const imageSrc = product.imageUrl?.startsWith("http")
    ? product.imageUrl
    : `${API_URL}${product.imageUrl?.startsWith("/") ? product.imageUrl : `/${product.imageUrl}`}`;

  const isBook = product.category?.name?.toLowerCase().includes("book");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>{product.name} | E-Commerce Store</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          width={400}
          height={isBook ? 400 : 300}
          className="w-full rounded-lg object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://dummyimage.com/400x300/cccccc/000000&text=No+Image";
          }}
        />

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-xl font-semibold mt-4">PKR {product.price}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-yellow-500">
              {"★".repeat(Math.round(product.avgRating))}
              {"☆".repeat(5 - Math.round(product.avgRating))}
            </span>
            <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              navigate("/cart");
            }}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <strong>{review.user?.name || "User"}</strong>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-gray-800">{review.comment}</p>

              {review.imageUrl && (
                <img
                  src={
                    review.imageUrl.startsWith("http")
                      ? review.imageUrl
                      : `${API_URL}${
                          review.imageUrl.startsWith("/")
                            ? review.imageUrl
                            : `/${review.imageUrl}`
                        }`
                  }
                  alt="review"
                  loading="lazy"
                  className="mt-2 w-32 rounded-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://dummyimage.com/100x100/cccccc/000000&text=No+Image";
                  }}
                />
              )}

              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}

        <ReviewForm productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
