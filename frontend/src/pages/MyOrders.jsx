import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { format } from "date-fns";

const MyOrders = () => {
  const user = useAuthStore((state) => state.user);
  const { addOrderItems } = useCartStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user?.id}`);
      setOrders(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Order ID:</strong> {order.id.slice(0, 8)}...</p>
                  <p><strong>Date:</strong> {format(new Date(order.createdAt), "dd MMM yyyy, h:mm a")}</p>
                  <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
                </div>

                <span
                  className={`text-sm px-3 py-1 rounded-full font-semibold uppercase tracking-wide
                    ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {order.status}
                </span>
              </div>

              {/* ✅ Status Timeline */}
              <div className="flex items-center mt-4 space-x-4 text-sm">
                <div className={`flex items-center space-x-1 ${order.status === "PENDING" ? "text-yellow-600" : "text-gray-400"}`}>
                  <span className="text-xl">🟡</span>
                  <span>Order Placed</span>
                </div>
                <span>→</span>
                <div className={`flex items-center space-x-1 ${["SHIPPED", "DELIVERED"].includes(order.status) ? "text-blue-600" : "text-gray-400"}`}>
                  <span className="text-xl">🔵</span>
                  <span>Shipped</span>
                </div>
                <span>→</span>
                <div className={`flex items-center space-x-1 ${order.status === "DELIVERED" ? "text-green-600" : "text-gray-400"}`}>
                  <span className="text-xl">🟢</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* ✅ View Items */}
              <details className="mt-4 text-sm text-gray-700">
                <summary className="cursor-pointer font-medium">View Items</summary>
                <ul className="mt-2 list-disc ml-5">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      Product ID: {item.productId}, Qty: {item.quantity}, Rs. {item.price}
                    </li>
                  ))}
                </ul>
              </details>

              {/* ✅ Reorder Button */}
              <button
                onClick={() => {
                  addOrderItems(order.items);
                  alert("✅ Items from this order have been added to your cart!");
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
              >
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
