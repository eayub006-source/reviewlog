import { memo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatsCard = memo(function StatsCard({ title, value, icon: Icon, hint, tone = "default", className }) {
  const toneClasses = {
    default: "from-slate-950 to-slate-700 text-white",
    accent: "from-sky-600 to-cyan-500 text-white",
    subtle: "from-white to-slate-50 text-slate-950",
  };

  return (
    <Card className={cn("overflow-hidden border-slate-200", className)}>
      <CardContent className={cn("relative flex items-start justify-between gap-4 bg-gradient-to-br p-5", toneClasses[tone] ?? toneClasses.default)}>
        <div>
          <p className="text-sm/6 font-medium opacity-80">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          {hint ? <p className="mt-2 text-xs opacity-75">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
});

export default StatsCard;
