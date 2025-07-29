import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema for all fields
const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone is required"),
  shippingAddress: z.string().min(5, "Shipping address is required"),
  billingAddress: z.string().min(5, "Billing address is required"),
  paymentMethod: z.enum(["COD", "CARD"], {
    required_error: "Select a payment method",
  }),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const placeOrder = async (data) => {
    if (!user?.id) {
      alert("You must be logged in to place an order.");
      return;
    }

    const payload = {
      userId: user.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalAmount: totalPrice,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      paymentMethod: data.paymentMethod,
      status: "PENDING",
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/orders", payload);
      localStorage.setItem("lastOrder", JSON.stringify(payload));
      clearCart();
      navigate("/success", {
        state: {
          orderId: res.data.id,
          shippingAddress: payload.shippingAddress,
          total: totalPrice,
          paymentMethod: payload.paymentMethod,
        },
      });
    } catch (error) {
      console.error("❌ Order placement failed:", error?.response?.data || error.message);
      alert("Something went wrong while placing your order.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <p>Please add items to cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <form onSubmit={handleSubmit(placeOrder)} className="space-y-6">
        <div>
          <label>Name</label>
          <input
            {...register("name")}
            className="w-full border p-2 rounded"
            placeholder="Full Name"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            {...register("email")}
            className="w-full border p-2 rounded"
            placeholder="example@mail.com"
            type="email"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone</label>
          <input
            {...register("phone")}
            className="w-full border p-2 rounded"
            placeholder="03XXXXXXXXX"
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label>Shipping Address</label>
          <input
            {...register("shippingAddress")}
            className="w-full border p-2 rounded"
            placeholder="Enter shipping address"
          />
          {errors.shippingAddress && (
            <p className="text-red-500">{errors.shippingAddress.message}</p>
          )}
        </div>

        <div>
          <label>Billing Address</label>
          <input
            {...register("billingAddress")}
            className="w-full border p-2 rounded"
            placeholder="Enter billing address"
          />
          {errors.billingAddress && (
            <p className="text-red-500">{errors.billingAddress.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="COD"
                {...register("paymentMethod")}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="CARD"
                {...register("paymentMethod")}
                className="mr-2"
              />
              Credit/Debit Card (Not implemented)
            </label>
            {errors.paymentMethod && (
              <p className="text-red-500">{errors.paymentMethod.message}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">Order Summary</h3>
          <ul className="space-y-1">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>Rs. {item.price * item.quantity}</span>
              </li>
            ))}
            <li className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>Rs. {totalPrice}</span>
            </li>
          </ul>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Confirm & Place Order
        </button>
      </form>
    </div>
  );
}
