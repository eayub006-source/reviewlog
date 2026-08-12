import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        title: "Login successful",
        description: "Welcome back to ReviewLog.",
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
    <Card className="border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <CardDescription>Welcome back</CardDescription>
        <CardTitle>Sign in to ReviewLog</CardTitle>
        <p className="text-sm leading-6 text-slate-600">
          Use your account to access dashboard, profile, review, and settings routes.
        </p>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="username"
                name="username"
                placeholder="Enter username"
                autoComplete="username"
                className="pl-11"
                value={formData.username}
                onChange={handleChange}
                aria-invalid={Boolean(errors.username)}
              />
            </div>
            {errors.username ? <p className="text-sm text-red-600">{errors.username}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Authentication failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" className="h-11 w-full rounded-2xl" disabled={submitting || authLoading}>
            {submitting || authLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {submitting || authLoading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to ReviewLog?{" "}
          <Link to="/register" className="font-medium text-slate-950 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default Login;