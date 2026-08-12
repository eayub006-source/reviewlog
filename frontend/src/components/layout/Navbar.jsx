import { Menu, LogOut, UserRound, Plus, Heart, Settings, NotebookText, Globe2, BookOpen, Film, Compass, X } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "@/components/common/SearchBar";
import DropdownMenu from "@/components/common/DropdownMenu";
import Avatar from "@/components/ui/avatar";
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

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  function handleSearchChange(event) {
    if (!canSearch) return;
    const nextValue = event.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (nextValue) nextParams.set("q", nextValue);
    else nextParams.delete("q");
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
          if (currentMenuRef) currentMenuRef.removeEventListener("keydown", handleTab);
        };
      }
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Compass },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/books", label: "Books", icon: BookOpen },
    { to: "/reviews", label: "My Reviews", icon: NotebookText },
    { to: "/public-reviews", label: "Public Reviews", icon: Globe2 },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          <div className="flex items-center gap-8 shrink-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              aria-label="ReviewLog Home"
            >
              <span className="font-heading font-bold text-xl tracking-tight text-primary">
                ReviewLog
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <button
                    key={link.to}
                    onClick={() => navigate(link.to)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-sans font-medium transition-all duration-200 relative",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

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
                  <div className="absolute top-12 z-50 flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-md">
                    <p className="caption-text px-1 mb-1">Quick Search</p>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-primary flex-1 h-9"
                        onClick={() => {
                          saveSearchHistory(globalQuery);
                          setSearchOverlayOpen(false);
                          navigate(`/books?q=${encodeURIComponent(globalQuery)}`);
                        }}
                      >
                        Search Books
                      </button>
                      <button
                        className="btn btn-outline flex-1 h-9"
                        onClick={() => {
                          saveSearchHistory(globalQuery);
                          setSearchOverlayOpen(false);
                          navigate(`/movies?q=${encodeURIComponent(globalQuery)}`);
                        }}
                      >
                        Search Movies
                      </button>
                    </div>
                  </div>
                )}
                {searchOverlayOpen && !globalQuery && suggestions.length > 0 && (
                  <div className="absolute top-12 z-50 w-full rounded-xl border border-border bg-card p-2 shadow-md">
                    <p className="caption-text px-2 py-1.5 mb-1">Recent Searches</p>
                    {suggestions.slice(0, 4).map((term) => (
                      <button
                        key={term}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted font-medium"
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/reviews/new")}
              className="btn btn-secondary hidden sm:inline-flex h-9 py-0 px-4"
              aria-label="Add Review"
            >
              <Plus className="mr-1 h-4 w-4 stroke-[3px]" />
              Add Review
            </button>

            <button
              className="btn btn-ghost h-9 w-9 p-0 lg:hidden flex items-center justify-center"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:block">
              <DropdownMenu
                buttonClassName="h-9 rounded-full bg-card border border-border hover:bg-muted px-2 shadow-sm"
                menuClassName="border border-border bg-card p-1.5 shadow-md rounded-xl min-w-[200px]"
                triggerLabel={
                  <span className="flex items-center gap-2">
                    <Avatar name={currentUser?.username ?? "Account"} size="sm" className="bg-primary text-primary-foreground font-bold" />
                    <span className="max-w-[80px] truncate text-sm font-semibold text-foreground">
                      {currentUser?.username ?? "Account"}
                    </span>
                  </span>
                }
                items={[
                  { label: "Dashboard", icon: Compass, onSelect: () => navigate("/dashboard") },
                  { label: "My Reviews", icon: NotebookText, onSelect: () => navigate("/reviews") },
                  { label: "Favorites", icon: Heart, onSelect: () => navigate("/favorites") },
                  { label: "View profile", icon: UserRound, onSelect: () => navigate("/profile") },
                  { label: "Settings", icon: Settings, onSelect: () => navigate("/settings") },
                  { label: "Logout", icon: LogOut, tone: "danger", onSelect: onLogout },
                ]}
              />
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="View Profile"
            >
              <span>{(currentUser?.username ?? "U").slice(0, 1).toUpperCase()}</span>
            </button>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <span className="font-heading font-bold text-xl text-primary">
              ReviewLog
            </span>
            <button
              className="btn btn-ghost h-9 w-9 p-0 flex items-center justify-center"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <p className="caption-text mb-3">Discovery</p>
            <nav className="flex flex-col gap-2 mb-8">
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
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </button>
                );
              })}
            </nav>

            <p className="caption-text mb-3">Personal Library</p>
            <nav className="flex flex-col gap-2">
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
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-border p-6 bg-muted/30 flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-2">
              <Avatar name={currentUser?.username ?? "Account"} size="md" className="bg-primary text-primary-foreground font-bold" />
              <div>
                <p className="text-sm font-bold text-foreground">{currentUser?.username ?? "Account"}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email ?? "User Session"}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/reviews/new");
              }}
              className="btn btn-secondary w-full"
            >
              <Plus className="mr-1 h-4 w-4 stroke-[3px]" />
              Add Review
            </button>

            <button
              className="btn btn-outline w-full text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;