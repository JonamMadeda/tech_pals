"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
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
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Check your email
              </h2>
              <p className="mb-6 text-sm text-slate-500">
                If an account exists with{" "}
                <span className="font-mono text-slate-700">{email}</span>,
                we&apos;ve sent a password reset link.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 font-mono text-xs text-slate-600 transition-colors hover:bg-slate-50"
              >
                <ArrowLeft size={12} />
                back to login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500">
                    <span className="text-blue-600">$</span> email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-200 bg-[#fafbfc] py-2 pl-9 pr-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-600 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "sending..." : "send reset link"}
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
