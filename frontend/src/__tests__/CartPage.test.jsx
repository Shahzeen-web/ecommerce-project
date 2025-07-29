import { render, screen, fireEvent } from "@testing-library/react";
import CartPage from "../pages/CartPage";
import { BrowserRouter } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

beforeEach(() => {
  const store = useCartStore.getState();
  if (store.clearCart) store.clearCart();
  if (store.addToCart) {
    store.addToCart({
      id: 1,
      name: "Test Product",
      price: 200,
      quantity: 1,
      imageUrl: "https://dummyimage.com/100x100/cccccc/000000&text=No+Image",
      category: { name: "Testing" },
    });
  }
});

describe("🛒 CartPage Component", () => {
  it("renders cart items and displays correct total", () => {
    render(<CartPage />, { wrapper: Wrapper });

    expect(screen.getByText(/test product/i)).toBeInTheDocument();
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
    expect(screen.getByText("Rs 200")).toBeInTheDocument();
    expect(screen.getByText(/total: rs 200/i)).toBeInTheDocument(); // ✔ correct total
  });

  it("removes item when Remove button is clicked", () => {
    render(<CartPage />, { wrapper: Wrapper });

    fireEvent.click(screen.getByText(/remove/i));

    expect(screen.queryByText(/test product/i)).not.toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("updates quantity when plus or minus buttons are clicked", () => {
    render(<CartPage />, { wrapper: Wrapper });

    const plusBtn = screen.getByText("+");
    const minusBtn = screen.getByText("-");

    fireEvent.click(plusBtn);
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(plusBtn);
    expect(screen.getByText("3")).toBeInTheDocument();

    fireEvent.click(minusBtn);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
