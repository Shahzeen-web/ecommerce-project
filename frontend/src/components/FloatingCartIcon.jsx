import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";

const FloatingCartIcon = () => {
const items = useCartStore((state) => state.cartItems);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default React.memo(FloatingCartIcon);
