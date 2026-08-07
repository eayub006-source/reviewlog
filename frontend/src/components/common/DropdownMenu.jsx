import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DropdownMenu({ triggerLabel, items, align = "right", buttonClassName = "", menuClassName = "" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn("h-9 rounded-full px-3", buttonClassName)}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {triggerLabel}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-20 min-w-48 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl",
            align === "right" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors",
                item.tone === "danger"
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-slate-700 hover:bg-slate-100",
              )}
              onClick={() => {
                setOpen(false);
                item.onSelect?.();
              }}
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default DropdownMenu;
