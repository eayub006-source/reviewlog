import { Navigate, Outlet } from "react-router-dom";

import Loader from "@/components/common/Loader";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ children }) {
  const { isInitializing, isAuthenticated } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600" role="status" aria-live="polite">
        <Loader label="Checking your session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;