import { memo } from "react";

import { Button } from "@/components/ui/button";

const EmptyState = memo(function EmptyState({ title, description, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/80 px-6 py-14 text-center shadow-sm">
      {Icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6 rounded-2xl px-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
});

export default EmptyState;
