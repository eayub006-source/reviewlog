import { memo } from "react";
import { LoaderCircle } from "lucide-react";

const Loader = memo(function Loader({ label = "Loading...", className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 text-sm font-semibold text-slate-300 ${className}`.trim()} role="status" aria-live="polite">
      <LoaderCircle className="h-5 w-5 animate-spin text-sky-400" />
      {label}
    </div>
  );
});

export default Loader;