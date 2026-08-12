import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, LoaderCircle, Mail, UserPlus, KeyRound } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { registerUser } from "@/services/authService";
import { getFriendlyApiError } from "@/utils/apiErrors";

function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!formData.username.trim()) {
      nextErrors.username = "Username is required.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setError("");
    setSuccess("");

    if (Object.keys(validationErrors).length > 0) {
      showToast({
        tone: "error",
        title: "Validation error",
        description: "Please review the highlighted registration fields.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      setSuccess("Registration successful. Redirecting to login...");
      showToast({
        tone: "success",
        title: "Account created",
        description: "Your vault is ready. Please log in.",
      });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (caughtError) {
      const message = getFriendlyApiError(caughtError);
      setError(message);
      showToast({
        tone: "error",
        title: "Registration failed",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="surface-card p-10 text-center w-full flex flex-col items-center">
        <CheckCircle2 className="h-16 w-16 text-primary mb-6" />
        <h2 className="card-title text-2xl mb-3">Welcome to ReviewLog</h2>
        <p className="body-text">{success}</p>
      </div>
    );
  }

  return (
    <div className="surface-card p-8 md:p-10 w-full relative overflow-hidden">
      <div className="mb-8">
        <h2 className="card-title text-2xl mb-2">Create your vault</h2>
        <p className="body-text text-sm">
          The stories you love, kept just for you.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-semibold text-foreground">
            Username
          </label>
          <div className="relative">
            <UserPlus className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
            <input
              id="username"
              name="username"
              placeholder="Choose a username"
              autoComplete="username"
              className={`field field-with-icon pl-11 ${errors.username ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
              value={formData.username}
              onChange={handleChange}
              aria-invalid={Boolean(errors.username)}
            />
          </div>
          {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className={`field field-with-icon pl-11 ${errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
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
              placeholder="Choose a password"
              autoComplete="new-password"
              className={`field field-with-icon pl-11 ${errors.password ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
            />
          </div>
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={`field field-with-icon pl-11 ${errors.confirmPassword ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
          </div>
          {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive bg-[#fce8e8] p-3 mt-4">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary w-full mt-2" 
          disabled={submitting || authLoading}
        >
          {submitting || authLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {submitting || authLoading ? "Creating account..." : "Create my vault →"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground font-sans">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:text-[#244820] transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Register;