import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, LoaderCircle, Mail } from "lucide-react";

import { requestPasswordReset } from "@/services/authService";
import { getFriendlyApiError } from "@/utils/apiErrors";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter the email address associated with your account.");
      return;
    }

    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSuccess(true);
    } catch (caughtError) {
      setError(getFriendlyApiError(caughtError));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="surface-card p-10 text-center w-full flex flex-col items-center">
        <CheckCircle2 className="h-16 w-16 text-primary mb-6" />
        <h2 className="card-title text-2xl mb-3">Check your email</h2>
        <p className="body-text">
          If an account with that email exists, we've sent a link to reset your password.
        </p>
        <Link to="/login" className="btn btn-outline mt-8 px-6">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="surface-card p-8 md:p-10 w-full relative overflow-hidden">
      <div className="mb-8">
        <h2 className="card-title text-2xl mb-2">Reset your password</h2>
        <p className="body-text text-sm">
          Enter the email on your account and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
              placeholder="Enter your account email"
              autoComplete="email"
              className={`field field-with-icon pl-11 ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          </div>
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>

        <button type="submit" className="btn btn-secondary w-full" disabled={submitting}>
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground font-sans">
        Remembered your password?{" "}
        <Link to="/login" className="font-semibold text-secondary hover:text-[#c96c53] transition-colors">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
