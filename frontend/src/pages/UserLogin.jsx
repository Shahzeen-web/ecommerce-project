// src/pages/UserLogin.jsx
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserLogin() {
  const { register, handleSubmit } = useForm();
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, data);
      const token = res.data.token;

      setToken(token); // ✅ Store and decode
      navigate("/");   // ✅ Redirect on success
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 mt-10 border rounded">
      <h2 className="text-xl font-bold mb-4">User Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email", { required: true })}
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
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
