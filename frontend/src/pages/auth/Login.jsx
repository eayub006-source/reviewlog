import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, KeyRound, Mail } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getFriendlyApiError } from "@/utils/apiErrors";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [manualSubmit, setManualSubmit] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !manualSubmit) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, manualSubmit, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!formData.username.trim()) {
      nextErrors.username = "Username is required.";
    }
    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setError("");
    setManualSubmit(true);

    if (Object.keys(validationErrors).length > 0) {
      showToast({
        tone: "error",
        title: "Validation error",
        description: "Please enter both username and password.",
      });
      setManualSubmit(false);
      return;
    }

    setSubmitting(true);
    try {
      await login(formData);
      showToast({
        tone: "success",
        title: "Welcome back",
        description: "Your session has started securely.",
      });
      navigate("/dashboard", { replace: true });
    } catch (caughtError) {
      const message = caughtError.response?.status === 401
        ? "Invalid username or password."
        : getFriendlyApiError(caughtError);

      setError(message);
      showToast({
        tone: "error",
        title: "Login failed",
        description: message,
      });
      setManualSubmit(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="surface-card p-8 md:p-10 w-full relative overflow-hidden">
      <div className="mb-8">
        <h2 className="card-title text-2xl mb-2">Welcome back</h2>
        <p className="body-text text-sm">
          Please sign in to access your private library.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-semibold text-foreground">
            Username
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
            <input
              id="username"
              name="username"
              placeholder="Enter your username"
              autoComplete="username"
              className={`field pl-11 ${errors.username ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
              value={formData.username}
              onChange={handleChange}
              aria-invalid={Boolean(errors.username)}
            />
          </div>
          {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-foreground">
            Password
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`field pl-11 ${errors.password ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
            />
          </div>
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive bg-[#fce8e8] p-3">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-secondary w-full" 
          disabled={submitting || authLoading}
        >
          {submitting || authLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {submitting || authLoading ? "Signing in..." : "Login to your vault"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground font-sans">
        New to ReviewLog?{" "}
        <Link to="/register" className="font-semibold text-secondary hover:text-[#c96c53] transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default Login;