import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async"; // ✅ Import

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider> {/* ✅ Wrap App in HelmetProvider */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
