import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, LoaderCircle, KeyRound } from "lucide-react";

import { confirmPasswordReset } from "@/services/authService";
import { getFriendlyApiError } from "@/utils/apiErrors";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!uid || !token) {
      setError("This reset link is invalid or has expired. Request a new one.");
      return;
    }

    setSubmitting(true);
    try {
      await confirmPasswordReset({
        uid,
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (caughtError) {
      const message = caughtError.response?.status === 400
        ? (caughtError.response?.data?.detail ?? "This reset link is invalid or has expired.")
        : getFriendlyApiError(caughtError);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="surface-card p-10 text-center w-full flex flex-col items-center">
        <CheckCircle2 className="h-16 w-16 text-primary mb-6" />
        <h2 className="card-title text-2xl mb-3">Password reset</h2>
        <p className="body-text">Your password has been updated. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="surface-card p-8 md:p-10 w-full relative overflow-hidden">
      <div className="mb-8">
        <h2 className="card-title text-2xl mb-2">Choose a new password</h2>
        <p className="body-text text-sm">
          Enter a new password for your ReviewLog account.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-foreground">
            New Password
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Choose a new password"
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
              placeholder="Confirm your new password"
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
          <div className="rounded-lg border border-destructive bg-[#fce8e8] p-3">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Saving..." : "Reset password"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground font-sans">
        <Link to="/login" className="font-semibold text-secondary hover:text-[#c96c53] transition-colors">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default ResetPassword;
