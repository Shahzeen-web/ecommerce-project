// src/pages/UserLogin.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserLogin() {
  const { register, handleSubmit } = useForm();
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, data);
      const token = res.data.token;

      setToken(token); // ✅ Store token in Zustand
      navigate("/");   // ✅ Redirect on success
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>

      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email", { required: true })}
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
        />
        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full border p-2 rounded"
          placeholder="Password"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-2 rounded ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-sm flex justify-between">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
        <Link to="/signup" className="text-blue-600 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
