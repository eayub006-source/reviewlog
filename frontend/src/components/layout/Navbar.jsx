import { Menu, LogOut, UserRound, Plus, Heart, Settings, NotebookText, Globe2, BookOpen, Film, Compass, X, Search } from "lucide-react";
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);

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
    setMobileSearchOpen(false);
    navigate(`/books?q=${encodeURIComponent(globalQuery.trim())}`);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOverlayOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOverlayOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const accountMenuItems = [
    { label: "Dashboard", icon: Compass, onSelect: () => navigate("/dashboard") },
    { label: "My Reviews", icon: NotebookText, onSelect: () => navigate("/reviews") },
    { label: "Favorites", icon: Heart, onSelect: () => navigate("/favorites") },
    { label: "View profile", icon: UserRound, onSelect: () => navigate("/profile") },
    { label: "Settings", icon: Settings, onSelect: () => navigate("/settings") },
    { label: "Logout", icon: LogOut, tone: "danger", onSelect: onLogout },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">

          <div className="flex items-center gap-8 shrink-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              aria-label="ReviewLog Home"
            >
              <span className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-primary">
                ReviewLog
              </span>
            </button>

            <nav className="hidden xl:flex items-center gap-2" aria-label="Main Navigation">
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

          <div ref={searchRef} className="hidden sm:block flex-1 min-w-0 max-w-sm relative">
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
                  onFocus={() => setSearchOverlayOpen(true)}
                  onKeyDown={submitGlobalSearch}
                  placeholder="Search catalog"
                  ariaLabel="Search movies or books"
                />
                {searchOverlayOpen && globalQuery && (
                  <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 z-50 flex w-[calc(100vw-2rem)] max-w-[350px] md:w-full md:max-w-none flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-md">
                    <p className="caption-text px-1 mb-1 font-semibold text-primary">Quick Search</p>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-primary flex-1 h-9 text-xs sm:text-sm px-2 font-medium"
                        onClick={() => {
                          saveSearchHistory(globalQuery);
                          setSearchOverlayOpen(false);
                          navigate(`/books?q=${encodeURIComponent(globalQuery)}`);
                        }}
                      >
                        Search Books
                      </button>
                      <button
                        className="btn btn-outline flex-1 h-9 text-xs sm:text-sm px-2 font-medium"
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
                  <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 z-50 w-[calc(100vw-2rem)] max-w-[350px] md:w-full md:max-w-none rounded-xl border border-border bg-card p-2 shadow-md">
                    <p className="caption-text px-2 py-1.5 mb-1 font-semibold text-primary">Recent Searches</p>
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

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              className="btn btn-ghost h-9 w-9 p-0! shrink-0 sm:hidden flex items-center justify-center"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen}
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen((open) => !open);
              }}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => navigate("/reviews/new")}
              className="btn btn-secondary h-9 px-3! sm:px-4! shrink-0"
              aria-label="Add Review"
            >
              <Plus className="h-4 w-4 stroke-[3px] sm:mr-1" />
              <span className="hidden sm:inline">Add Review</span>
            </button>

            <div ref={mobileMenuRef} className="relative shrink-0 xl:hidden">
              <button
                type="button"
                className="btn btn-ghost h-9 w-9 p-0! flex items-center justify-center"
                aria-label="Open navigation menu"
                aria-haspopup="menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => {
                  setMobileSearchOpen(false);
                  setMobileMenuOpen((open) => !open);
                }}
              >
                <Menu className="h-5 w-5" />
              </button>

              {mobileMenuOpen && (
                <div
                  role="menu"
                  aria-label="Account menu"
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[210px] rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl"
                >
                  {accountMenuItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        item.onSelect?.();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors",
                        item.tone === "danger"
                          ? "text-rose-600 hover:bg-rose-50"
                          : "text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block">
              <DropdownMenu
                buttonClassName="h-9 rounded-full bg-card border border-border hover:bg-muted px-2 shadow-sm"
                menuClassName="border border-border bg-card p-1.5 shadow-md rounded-xl min-w-[200px]"
                triggerLabel={
                  <span className="flex items-center gap-2">
                    <Avatar name={currentUser?.username ?? "Account"} src={currentUser?.avatar_data} size="sm" className="bg-primary text-primary-foreground font-bold" />
                    <span className="max-w-[80px] truncate text-sm font-semibold text-foreground">
                      {currentUser?.username ?? "Account"}
                    </span>
                  </span>
                }
                items={accountMenuItems}
              />
            </div>
          </div>

        </div>

        {mobileSearchOpen && (
          <div className="sm:hidden border-t border-border pt-3 pb-4" role="search" aria-label="Mobile search">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 relative">
                {canSearch ? (
                  <SearchBar
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search reviews"
                    ariaLabel="Search reviews"
                    autoFocus
                  />
                ) : (
                  <SearchBar
                    value={globalQuery}
                    onChange={(event) => setGlobalQuery(event.target.value)}
                    onKeyDown={submitGlobalSearch}
                    placeholder="Search catalog"
                    ariaLabel="Search movies or books"
                    autoFocus
                  />
                )}
              </div>
              <button
                type="button"
                className="btn btn-ghost h-11 w-11 p-0! shrink-0 flex items-center justify-center"
                aria-label="Close search"
                onClick={() => setMobileSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!canSearch && globalQuery && (
              <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
                <p className="caption-text px-1 mb-1 font-semibold text-primary">Quick Search</p>
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary flex-1 h-10 text-sm font-medium"
                    onClick={() => {
                      saveSearchHistory(globalQuery);
                      setMobileSearchOpen(false);
                      navigate(`/books?q=${encodeURIComponent(globalQuery)}`);
                    }}
                  >
                    Search Books
                  </button>
                  <button
                    className="btn btn-outline flex-1 h-10 text-sm font-medium"
                    onClick={() => {
                      saveSearchHistory(globalQuery);
                      setMobileSearchOpen(false);
                      navigate(`/movies?q=${encodeURIComponent(globalQuery)}`);
                    }}
                  >
                    Search Movies
                  </button>
                </div>
              </div>
            )}

            {!canSearch && !globalQuery && suggestions.length > 0 && (
              <div className="mt-3 max-h-[50vh] overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-sm">
                <p className="caption-text px-2 py-1.5 mb-1 font-semibold text-primary">Recent Searches</p>
                {suggestions.slice(0, 6).map((term) => (
                  <button
                    key={term}
                    className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted font-medium"
                    onClick={() => {
                      setGlobalQuery(term);
                      setMobileSearchOpen(false);
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
    </header>
  );
}

export default Navbar;