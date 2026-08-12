import { Menu, LogOut, UserRound, Plus, Heart, Settings, NotebookText, Globe2, BookOpen, Film, Compass, X } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "@/components/common/SearchBar";
import DropdownMenu from "@/components/common/DropdownMenu";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getSearchHistory, saveSearchHistory } from "@/services/searchService";
import { cn } from "@/lib/utils";

function Navbar({ currentUser, onLogout }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchValue = searchParams.get("q") ?? "";
  const canSearch = useMemo(() => ["/reviews", "/public-reviews"].includes(location.pathname), [location.pathname]);
  const [globalQuery, setGlobalQuery] = useState("");
  const [suggestions, setSuggestions] = useState(() => getSearchHistory());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Active path matcher
  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

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

  function submitGlobalSearch(event) {
    if (event.key !== "Enter" || !globalQuery.trim()) return;
    saveSearchHistory(globalQuery);
    setSuggestions(getSearchHistory());
    setSearchOverlayOpen(false);
    navigate(`/books?q=${encodeURIComponent(globalQuery.trim())}`);
  }

  // Handle keyboard Escape key to close mobile navigation
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOverlayOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Trap focus inside mobile navigation drawer when open
  useEffect(() => {
    const currentMenuRef = mobileMenuRef.current;
    if (mobileMenuOpen && currentMenuRef) {
      const focusableElements = currentMenuRef.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function handleTab(e) {
          if (e.key !== "Tab") return;
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }

        firstElement.focus();
        currentMenuRef.addEventListener("keydown", handleTab);
        return () => {
          if (currentMenuRef) {
            currentMenuRef.removeEventListener("keydown", handleTab);
          }
        };
      }
    }
  }, [mobileMenuOpen]);

  // Main navigation items
  const navLinks = [
    { to: "/dashboard", label: "Discover", icon: Compass },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/books", label: "Books", icon: BookOpen },
    { to: "/reviews", label: "My Reviews", icon: NotebookText },
    { to: "/public-reviews", label: "Public Reviews", icon: Globe2 },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Brand / Lettermark */}
          <div className="flex items-center gap-8 shrink-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20 rounded-lg"
              aria-label="ReviewLog Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 font-extrabold text-slate-950 shadow-lg shadow-sky-500/10">
                <span className="text-base font-black">R</span>
              </div>
              <span className="font-sans font-extrabold text-lg tracking-tight hidden sm:block">
                Review<span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Log</span>
              </span>
            </button>

            {/* Desktop Center Links */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <button
                    key={link.to}
                    onClick={() => navigate(link.to)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 relative",
                      active
                        ? "text-sky-400 bg-sky-500/5"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search Box Panel */}
          <div className="flex-1 max-w-sm hidden md:block">
            {canSearch ? (
              <SearchBar value={searchValue} onChange={handleSearchChange} placeholder="Search reviews" />
            ) : (
              <div className="relative">
                <SearchBar
                  value={globalQuery}
                  onChange={(event) => {
                    setGlobalQuery(event.target.value);
                    setSearchOverlayOpen(true);
                  }}
                  onKeyDown={submitGlobalSearch}
                  placeholder="Search catalog (Enter)"
                  ariaLabel="Search movies or books"
                />
                {searchOverlayOpen && globalQuery && (
                  <div className="absolute top-12 z-50 flex w-full flex-col gap-2 rounded-xl border border-white/10 bg-slate-900 p-2.5 shadow-2xl">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Quick Search</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg h-9 bg-sky-500 text-slate-950 font-bold"
                        onClick={() => {
                          saveSearchHistory(globalQuery);
                          setSearchOverlayOpen(false);
                          navigate(`/books?q=${encodeURIComponent(globalQuery)}`);
                        }}
                      >
                        Search Books
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg h-9 border-white/10 hover:bg-white/10 text-slate-100"
                        onClick={() => {
                          saveSearchHistory(globalQuery);
                          setSearchOverlayOpen(false);
                          navigate(`/movies?q=${encodeURIComponent(globalQuery)}`);
                        }}
                      >
                        Search Movies
                      </Button>
                    </div>
                  </div>
                )}
                {searchOverlayOpen && !globalQuery && suggestions.length > 0 && (
                  <div className="absolute top-12 z-50 w-full rounded-xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">Recent Searches</p>
                    {suggestions.slice(0, 4).map((term) => (
                      <button
                        key={term}
                        className="block w-full rounded-lg px-2.5 py-2 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100"
                        onClick={() => {
                          setGlobalQuery(term);
                          navigate(`/books?q=${encodeURIComponent(term)}`);
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            
            {/* Quick Add Review CTA Button */}
            <Button
              onClick={() => navigate("/reviews/new")}
              className="h-10 rounded-xl px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold hidden sm:inline-flex"
              aria-label="Add Review"
            >
              <Plus className="mr-1.5 h-4 w-4 stroke-[3px]" />
              Add Review
            </Button>

            {/* Mobile Hamburger menu toggle */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 hover:text-slate-100 lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Account drop-selector */}
            <div className="hidden sm:block">
              <DropdownMenu
                buttonClassName="h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-slate-100 px-2.5"
                menuClassName="border border-white/10 bg-slate-900 p-1.5 shadow-2xl rounded-xl min-w-[200px]"
                triggerLabel={
                  <span className="flex items-center gap-2">
                    <Avatar name={currentUser?.username ?? "Account"} size="sm" className="bg-gradient-to-br from-sky-400 to-emerald-400 text-slate-950 font-bold" />
                    <span className="max-w-[80px] truncate text-sm font-semibold text-slate-200">
                      {currentUser?.username ?? "Account"}
                    </span>
                  </span>
                }
                items={[
                  { label: "Discover", icon: Compass, onSelect: () => navigate("/dashboard") },
                  { label: "My Reviews", icon: NotebookText, onSelect: () => navigate("/reviews") },
                  { label: "Favorites", icon: Heart, onSelect: () => navigate("/favorites") },
                  { label: "View profile", icon: UserRound, onSelect: () => navigate("/profile") },
                  { label: "Settings", icon: Settings, onSelect: () => navigate("/settings") },
                  { label: "Logout", icon: LogOut, tone: "danger", onSelect: onLogout },
                ]}
              />
            </div>

            {/* Mobile simplified avatar display */}
            <button
              onClick={() => navigate("/profile")}
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 font-extrabold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20"
              aria-label="View Profile"
            >
              <span>{(currentUser?.username ?? "U").slice(0, 1).toUpperCase()}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile full-viewport navigation slide overlays */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
            <span className="font-sans font-extrabold text-lg tracking-tight">
              Review<span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Log</span>
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-white/5 bg-white/5 hover:bg-white/10"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Discovery</p>
            <nav className="flex flex-col gap-2.5 mb-8">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <button
                    key={link.to}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(link.to);
                    }}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                      active
                        ? "bg-sky-500 text-slate-950"
                        : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </button>
                );
              })}
            </nav>

            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Personal Library</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { to: "/favorites", label: "My Favorites", icon: Heart },
                { to: "/profile", label: "View Profile", icon: UserRound },
                { to: "/settings", label: "Settings", icon: Settings },
              ].map((link) => {
                const active = isActive(link.to);
                return (
                  <button
                    key={link.to}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(link.to);
                    }}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                      active
                        ? "bg-sky-500 text-slate-950"
                        : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/5 p-6 bg-slate-950/40 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={currentUser?.username ?? "Account"} size="md" className="bg-gradient-to-br from-sky-400 to-emerald-400 text-slate-950 font-bold" />
              <div>
                <p className="text-sm font-semibold text-slate-100">{currentUser?.username ?? "Account"}</p>
                <p className="text-xs text-slate-400">{currentUser?.email ?? "User Session"}</p>
              </div>
            </div>

            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/reviews/new");
              }}
              className="w-full h-11 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
            >
              <Plus className="mr-1.5 h-4 w-4 stroke-[3px]" />
              Add Review
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-bold"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;