import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isAdminLogin = location.pathname.includes("/admin");

  const onSubmit = async (data) => {
    try {
      const endpoint = isAdminLogin
        ? "http://localhost:5000/api/admin/login"
        : "http://localhost:5000/api/login";

      const res = await axios.post(endpoint, data);

      setToken(res.data.token); // ✅ saves and decodes JWT

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {isAdminLogin ? "Admin Login" : "Login"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
