import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from API
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders", { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `/api/orders/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.user?.email}</td>
                <td className="border px-4 py-2">Rs {order.totalAmount}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
