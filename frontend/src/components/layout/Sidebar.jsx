import { NavLink } from "react-router-dom";
import { LayoutDashboard, NotebookText, Globe2, User, Settings, LogOut, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reviews", label: "My Reviews", icon: NotebookText },
  { to: "/public-reviews", label: "Public Reviews", icon: Globe2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ open = false, onClose, onLogout, currentUser }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl transition-transform lg:static lg:translate-x-0 lg:shadow-none",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="flex items-center justify-between lg:hidden">
        <span className="text-sm font-semibold text-slate-950">ReviewLog</span>
        <button type="button" className="rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 rounded-3xl bg-slate-950 px-4 py-5 text-white shadow-lg lg:mt-0">
        <p className="text-sm/6 text-slate-300">Signed in as</p>
        <p className="mt-1 text-lg font-semibold">{currentUser?.username ?? "Account"}</p>
        <p className="mt-1 text-sm text-slate-300">{currentUser?.email ?? "Connected to Render API"}</p>
      </div>

      <nav className="mt-6 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <Button variant="outline" className="h-11 w-full justify-start rounded-2xl px-4" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
