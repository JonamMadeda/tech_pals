"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (error === "INVALID_TOKEN") {
      setFormError("Invalid or expired reset link. Please request a new one.");
    }
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    if (!token) {
      setFormError("No reset token found. Please request a new link.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "Failed to reset password");
        return;
      }

      setSuccess(true);
    } catch {
      setFormError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            Invalid reset link
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            No reset token was found. Please request a new password reset link.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700"
          >
            request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 font-mono text-lg font-bold text-slate-900"
          >
            <span className="text-blue-500">&lt;</span>
            <span>tech</span>
            <span className="text-blue-600">_pals</span>
            <span className="text-blue-500">&nbsp;/&gt;</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your new password below.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Password updated
              </h2>
              <p className="mb-6 text-sm text-slate-500">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700"
              >
                sign in
              </Link>
            </div>
          ) : (
            <>
              {formError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500">
                    <span className="text-blue-600">$</span> new password
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="min 8 characters"
                      className="w-full rounded-lg border border-slate-200 bg-[#fafbfc] py-2 pl-9 pr-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500">
                    <span className="text-blue-600">$</span> confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="repeat password"
                      className="w-full rounded-lg border border-slate-200 bg-[#fafbfc] py-2 pl-9 pr-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-600 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "updating..." : "reset password"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft size={12} />
                  back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
          <div className="font-mono text-sm text-slate-400">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
