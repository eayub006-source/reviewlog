import { Bell, Menu, Search, ChevronDown, LogOut } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Navbar({ onMenuToggle, currentUser, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchValue = searchParams.get("q") ?? "";
  const canSearch = useMemo(() => ["/reviews", "/public-reviews"].includes(location.pathname), [location.pathname]);

  function handleSearchChange(event) {
    if (!canSearch) {
      return;
    }

    const nextValue = event.target.value;
    const nextParams = new URLSearchParams(searchParams);

    if (nextValue) {
      nextParams.set("q", nextValue);
    } else {
      nextParams.delete("q");
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams, { replace: true });
  }

  function handleAvatarKeyDown(event) {
    if (event.key === "Escape") {
      setDropdownOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl lg:hidden" onClick={onMenuToggle}>
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
            <span className="text-sm font-semibold">R</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-500">ReviewLog</p>
            <p className="text-base font-semibold tracking-tight text-slate-950">Dashboard</p>
          </div>
        </div>

        <div className="ml-auto hidden w-full max-w-xl lg:block">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={canSearch ? "Search reviews" : "Search is available on review pages"}
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:bg-slate-50"
              onClick={() => setDropdownOpen((value) => !value)}
              onKeyDown={handleAvatarKeyDown}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                {currentUser?.username?.slice(0, 1)?.toUpperCase() ?? "U"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-slate-950">{currentUser?.username ?? "Account"}</p>
                <p className="text-xs text-slate-500">Profile menu</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-slate-100" />
                  View profile
                </button>
                <button
                  type="button"
                  className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-3 lg:hidden sm:px-6">
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={canSearch ? "Search reviews" : "Search is available on review pages"}
          className="w-full"
        />
      </div>
    </header>
  );
}

export default Navbar;
