import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const AdminSidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 min-h-screen">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

      <NavLink to="/admin/products" className="mb-3 hover:underline">Manage Products</NavLink>
      <NavLink to="/admin/orders" className="mb-3 hover:underline">Manage Orders</NavLink>

      <button
        onClick={handleLogout}
        className="mt-auto text-sm text-red-400 hover:text-red-300"
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
