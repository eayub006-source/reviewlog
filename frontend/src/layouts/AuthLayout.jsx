import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="mb-12 hidden max-w-xl lg:block lg:pr-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            ReviewLog authentication
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 xl:text-6xl">
            Secure access for your review workspace.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Sign in, register, and keep your session in sync with the deployed Render backend while the app handles token refresh automatically.
          </p>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
              JWT login
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
              Protected routes
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
              Auto refresh
            </div>
          </div>
        </section>
        <section className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
