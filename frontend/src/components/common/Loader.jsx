import { memo } from "react";
import { LoaderCircle } from "lucide-react";

const Loader = memo(function Loader({ label = "Loading...", className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-sm text-slate-500 ${className}`.trim()}>
      <LoaderCircle className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
});

export default Loader;
