import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  user: null,

  setToken: (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.removeItem("token");
      return set({ user: null });
    }

    set({ user: decoded });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },

  loadUser: () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        localStorage.removeItem("token");
        return set({ user: null });
      }

      set({ user: decoded });
    }
  },

  getUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  }
}));
