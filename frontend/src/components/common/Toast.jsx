import { CheckCircle2, AlertCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

function Toast({ open, title, description, tone = "success", onClose }) {
  if (!open) {
    return null;
  }

  const toneClasses = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  };

  const Icon = tone === "error" ? AlertCircle : tone === "info" ? Info : CheckCircle2;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(92vw,22rem)] animate-[fade-in_150ms_ease-out]">
      <div className={cn("pointer-events-auto flex gap-3 rounded-3xl border px-4 py-3 shadow-2xl backdrop-blur", toneClasses[tone] ?? toneClasses.success)}>
        <div className="mt-0.5 rounded-2xl bg-white/70 p-2">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          {description ? <p className="mt-1 text-sm leading-6 opacity-90">{description}</p> : null}
        </div>
        {onClose ? (
          <button type="button" className="text-sm font-medium opacity-70 transition-opacity hover:opacity-100" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Toast;
