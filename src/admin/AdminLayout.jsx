import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";


const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
