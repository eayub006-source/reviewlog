import { Bell, Menu, LogOut, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "@/components/common/SearchBar";
import DropdownMenu from "@/components/common/DropdownMenu";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getSearchHistory, saveSearchHistory } from "@/services/searchService";

function Navbar({ onMenuToggle, currentUser, onLogout }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchValue = searchParams.get("q") ?? "";
  const canSearch = useMemo(() => ["/reviews", "/public-reviews"].includes(location.pathname), [location.pathname]);
  const [globalQuery, setGlobalQuery] = useState("");
  const [suggestions, setSuggestions] = useState(() => getSearchHistory());

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
    saveSearchHistory(globalQuery); setSuggestions(getSearchHistory());
    navigate(`/books?q=${encodeURIComponent(globalQuery.trim())}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-2xl lg:hidden"
          aria-label="Open sidebar navigation"
          onClick={onMenuToggle}
        >
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
          {canSearch ? <SearchBar value={searchValue} onChange={handleSearchChange} placeholder="Search reviews" /> : <div className="relative"><SearchBar value={globalQuery} onChange={(event) => setGlobalQuery(event.target.value)} onKeyDown={submitGlobalSearch} placeholder="Search books (Enter)" ariaLabel="Global catalog search" />{globalQuery ? <div className="absolute top-12 z-50 flex w-full gap-2 rounded-2xl border bg-white p-2 text-xs shadow-lg"><Button size="sm" onClick={() => { saveSearchHistory(globalQuery); navigate(`/books?q=${encodeURIComponent(globalQuery)}`); }}>Books</Button><Button size="sm" variant="outline" onClick={() => { saveSearchHistory(globalQuery); navigate(`/movies?q=${encodeURIComponent(globalQuery)}`); }}>Movies</Button></div> : suggestions.length ? <div className="absolute top-12 z-50 w-full rounded-2xl border bg-white p-2 shadow-lg">{suggestions.slice(0, 4).map((term) => <button key={term} className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={() => { setGlobalQuery(term); navigate(`/books?q=${encodeURIComponent(term)}`); }}>{term}</button>)}</div> : null}</div>}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications placeholder"
            className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          <DropdownMenu
            triggerLabel={
              <span className="flex items-center gap-3">
                <Avatar name={currentUser?.username ?? "Account"} size="sm" />
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium text-slate-950">{currentUser?.username ?? "Account"}</span>
                  <span className="block text-xs text-slate-500">Profile menu</span>
                </span>
              </span>
            }
            buttonClassName="h-11 rounded-2xl px-3"
            items={[
              { label: "View profile", icon: UserRound, onSelect: () => navigate("/profile") },
              { label: "Logout", icon: LogOut, tone: "danger", onSelect: onLogout },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-3 lg:hidden sm:px-6">
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={canSearch ? "Search reviews" : "Search is available on review pages"}
          className="w-full"
          ariaLabel="Search reviews"
        />
      </div>
    </header>
  );
}

export default Navbar;
