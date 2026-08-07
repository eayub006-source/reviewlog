import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import OfflineNotice from "@/components/common/OfflineNotice";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <App />
          <OfflineNotice />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
);
