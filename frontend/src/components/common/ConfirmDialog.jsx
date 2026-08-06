import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

function ConfirmDialog({ open, title, description, confirmLabel = "Delete", cancelLabel = "Cancel", onConfirm, onCancel, tone = "danger" }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <button type="button" className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" onClick={onCancel}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" className="rounded-2xl px-4" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "danger" ? "destructive" : "default"} className="rounded-2xl px-4" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
