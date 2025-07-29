import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-purple-700">
        🛍️ MyShop
      </Link>

      <div className="flex items-center gap-4 relative">
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="cursor-pointer font-medium text-gray-700">
              👤 {user.name || user.email}
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <Link
                  to="/my-orders"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-purple-700 font-medium hover:underline"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
