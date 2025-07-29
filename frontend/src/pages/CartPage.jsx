import { useMemo } from "react";
import { useCartStore } from "../store/cartStore";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Use environment variable

const CartPage = () => {
  const {
    cartItems,
    removeItem,
    updateQuantity,
  } = useCartStore();

  const navigate = useNavigate();

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <p>
          Your cart is empty.{" "}
          <Link to="/" className="text-blue-600 underline">
            Continue Shopping
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const imageSrc = item.imageUrl?.startsWith("http")
            ? item.imageUrl
            : `${API_URL}${
                item.imageUrl?.startsWith("/") ? item.imageUrl : `/${item.imageUrl}`
              }`;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded shadow"
            >
              <img
                src={imageSrc}
                alt={item.name}
                loading="lazy"
                className="w-20 h-20 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://dummyimage.com/100x100/cccccc/000000&text=No+Image";
                }}
              />

              <div className="flex-1 ml-4">
                <h2 className="font-medium">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.category?.name}</p>
                <p className="text-blue-600 font-semibold">Rs {item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-bold mb-4">Total: Rs {total}</p>

        {/* ✅ Proceed to Checkout */}
        <button
          onClick={() => navigate("/checkout")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
