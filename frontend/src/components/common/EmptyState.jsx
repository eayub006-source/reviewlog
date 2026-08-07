import { memo } from "react";

import { Button } from "@/components/ui/button";

const EmptyState = memo(function EmptyState({ title, description, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <h3 className="card-title">{title}</h3>
      <p className="body-text mt-2 max-w-md">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6 rounded-2xl px-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
});

export default EmptyState;
