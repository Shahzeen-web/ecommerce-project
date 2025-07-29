import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      const saved = localStorage.getItem("lastOrder");
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    }
  }, [location.state]);

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
        <Link to="/" className="text-blue-600 underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank you for your order!</h1>
      <p className="text-gray-600 mb-6">
        We've received your order. Below is a summary:
      </p>

      <div className="text-left border rounded p-4 shadow-md bg-white">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Billing Address:</strong> {order.billingAddress}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total:</strong> Rs {order.totalAmount}</p>

        {order.items?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {order.items.map((item, idx) => (
              <li key={idx} className="border-t pt-2">
                Product ID {item.productId} × {item.quantity} = Rs {item.price * item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default SuccessPage;
