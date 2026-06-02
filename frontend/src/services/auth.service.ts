import { apiFetch } from "@/lib/api";
import type { LoginResponse } from "@/types";

// ─── Auth service ─────────────────────────────────────────────────────────────

/**
 * Authenticate an admin and return a JWT token.
 * Stores token in both cookie (for middleware) and localStorage (for headers).
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Persist token — cookie for Next.js middleware, localStorage for client headers
  document.cookie = `admin_token=${data.token}; path=/; max-age=28800; SameSite=Strict`;
  localStorage.setItem("admin_token", data.token);

  return data;
}

/**
 * Clear the admin session from both cookie and localStorage.
 * Call this on logout.
 */
export function logout(): void {
  document.cookie =
    "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
  localStorage.removeItem("admin_token");
}
