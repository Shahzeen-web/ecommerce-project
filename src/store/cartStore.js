import { create } from "zustand";
import { persist } from "zustand/middleware";
import socket from "../socket"; // ✅ Import socket

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product) =>
        set((state) => {
          const exists = state.cartItems.find((item) => item.id === product.id);
          const updatedCart = exists
            ? state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.cartItems, { ...product, quantity: 1 }];
          socket.emit("cart:update", updatedCart); // ✅ Emit event
          return { cartItems: updatedCart };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const updatedCart = state.cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
          socket.emit("cart:update", updatedCart);
          return { cartItems: updatedCart };
        }),

      removeItem: (productId) =>
        set((state) => {
          const updatedCart = state.cartItems.filter((item) => item.id !== productId);
          socket.emit("cart:update", updatedCart);
          return { cartItems: updatedCart };
        }),

      clearCart: () => {
        socket.emit("cart:update", []);
        set({ cartItems: [] });
      },

      getTotal: () => {
        const state = get();
        return state.cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cartItems: state.cartItems }),
      getStorage: () => localStorage,
    }
  )
);
