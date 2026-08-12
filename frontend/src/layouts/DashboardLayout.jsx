import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

function DashboardLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();

  async function handleLogout() {
    await logout();
    showToast({
      tone: "info",
      title: "Logged out",
      description: "Your session has been closed securely.",
    });
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col">
      {/* Cinematic Top-Bar Header Navigation */}
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      {/* Main Responsive Canvas Slot */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;