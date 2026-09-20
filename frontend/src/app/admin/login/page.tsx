"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth.service";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) return;
    try {
      setForgotLoading(true);
      const res = await (await import("@/services/auth.service")).forgotPassword(forgotEmail.trim());
      setForgotMessage(res.message);
    } catch (err: any) {
      setForgotMessage(err?.message || "Failed to submit request.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      window.location.href = "/admin/volunteers";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 max-w-md w-full shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">AgeSense Admin</h1>
          <p className="text-sm text-on-surface-variant">Sign in to manage volunteers, donors, and content</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="admin@agesense.org"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-on-surface-variant" htmlFor="password">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span> Authenticating...</>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-outline-variant/30 text-center">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="text-primary text-sm font-semibold hover:underline flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Go to Homepage
          </Link>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Reset Your Password</h3>
              <p className="text-xs text-surface-variant">
                Enter your staff email address. If an active account exists, password reset instructions will be generated.
              </p>

              {forgotMessage && (
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded-lg">
                  {forgotMessage}
                </div>
              )}

              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="staff@agesense.org"
                className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface text-sm rounded-lg"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {forgotLoading ? "Submitting..." : "Request Reset"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
