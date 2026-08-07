import { Component } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6" role="alert">
        <section className="surface-card max-w-md p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-slate-950">Something went wrong</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">ReviewLog could not display this screen. Reloading is safe and will not delete your saved reviews.</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>Reload ReviewLog</Button>
        </section>
      </main>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
