import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingCartIcon from "./components/FloatingCartIcon";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminRoute from "./routes/AdminRoute";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";
import Header from "./components/Header";
import socket from "./socket"; // ✅ WebSocket client

// ✅ Lazy load pages
const ProductList = lazy(() => import("./pages/ProductList"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const AdminProducts = lazy(() => import("./admin/pages/AdminProducts"));
const AdminOrders = lazy(() => import("./admin/pages/AdminOrders"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminReviewsPage = lazy(() => import("./admin/pages/AdminReviewsPage"));
const UserLogin = lazy(() => import("./pages/UserLogin"));

function App() {
  useEffect(() => {
    // ✅ Load logged-in user from localStorage
    useAuthStore.getState().loadUser();

    // ✅ Setup WebSocket listener for cart updates
    socket.on("cart:updated", (updatedCart) => {
      console.log("🛒 Real-time cart received:", updatedCart);
      useCartStore.setState({ cartItems: updatedCart });
    });

    return () => {
      socket.off("cart:updated");
    };
  }, []);

  return (
    <BrowserRouter>
      <Header /> {/* ✅ Global Header */}

      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<UserLogin />} />

          {/* 🔐 Admin Login & Review */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />

          {/* 🛡 Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </Suspense>

      {/* 🛒 Floating Cart Icon */}
      <FloatingCartIcon />
    </BrowserRouter>
  );
}

export default App;
