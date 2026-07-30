import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
        <Analytics />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
);
