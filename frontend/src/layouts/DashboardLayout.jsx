import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

function DashboardLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.08),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-950">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[288px_minmax(0,1fr)]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />

        <div className="min-w-0">
          <Navbar onMenuToggle={() => setSidebarOpen(true)} currentUser={currentUser} onLogout={handleLogout} />
          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
