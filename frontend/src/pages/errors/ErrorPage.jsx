import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

function ErrorPage({ code, title, description, icon: Icon = ShieldAlert, primaryAction, secondaryAction }) {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-10">
      <section className="surface-panel w-full max-w-2xl overflow-hidden p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-slate-950 text-white shadow-lg shadow-slate-950/10">
          <Icon className="h-8 w-8" />
        </div>
        <p className="caption-text mt-6">Error {code}</p>
        <h1 className="mt-3 page-title">{title}</h1>
        <p className="body-text mx-auto mt-4 max-w-xl">{description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button className="rounded-2xl px-5" onClick={primaryAction?.onClick ?? (() => navigate(primaryAction?.to ?? "/dashboard"))}>
            {primaryAction?.icon ?? <Home className="h-4 w-4" />}
            {primaryAction?.label ?? "Go to dashboard"}
          </Button>
          <Button variant="outline" className="rounded-2xl px-5" onClick={secondaryAction?.onClick ?? (() => navigate(-1))}>
            {secondaryAction?.icon ?? <ArrowLeft className="h-4 w-4" />}
            {secondaryAction?.label ?? "Go back"}
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">ReviewLog</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">React 19</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">ReviewLog Server</span>
        </div>
      </section>
    </main>
  );
}

export default ErrorPage;
