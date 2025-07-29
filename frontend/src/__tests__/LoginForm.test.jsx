import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login"; // ✅ Make sure this path is correct

describe("🔐 Login Component", () => {
  it("renders email and password fields", () => {
    render(<Login />);

    // Check for email and password input fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits form when filled", async () => {
    render(<Login />);

    // Find input fields and button
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate user typing and clicking login
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "12345678");
    await userEvent.click(loginButton);

    // ✅ TODO: Replace with your actual assertion logic (mock API, success message, redirect, etc.)
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("12345678");
  });
});
