import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("/api/admin/stats", { withCredentials: true })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats", err));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Users" value={stats.usersCount} />
      <Card title="Total Products" value={stats.productsCount} />
      <Card title="Total Orders" value={stats.ordersCount} />
      <Card title="Total Sales" value={`Rs ${stats.totalSales}`} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
