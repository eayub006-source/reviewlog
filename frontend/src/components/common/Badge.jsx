import { memo } from "react";

import { cn } from "@/lib/utils";

const Badge = memo(function Badge({ children, tone = "default", className }) {
  const toneClasses = {
    default: "border-slate-200 bg-slate-100 text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    subtle: "border-transparent bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone] ?? toneClasses.default,
        className,
      )}
    >
      {children}
    </span>
  );
});

export default Badge;
