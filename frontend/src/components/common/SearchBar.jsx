import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

function SearchBar({ value, onChange, placeholder = "Search reviews", className = "" }) {
  return (
    <div className={`relative ${className}`.trim()}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input value={value} onChange={onChange} placeholder={placeholder} className="h-11 rounded-full pl-11" />
    </div>
  );
}

export default SearchBar;
