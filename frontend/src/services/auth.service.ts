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

  const accessToken = data.accessToken || (data as any).token;
  if (!accessToken) {
    throw new Error("Authentication response did not include an access token.");
  }

  // Persist token — cookie for Next.js middleware, localStorage for client headers
  document.cookie = `admin_token=${accessToken}; path=/; max-age=28800; SameSite=Strict`;
  localStorage.setItem("admin_token", accessToken);
  if (data.user) {
    localStorage.setItem("admin_user", JSON.stringify(data.user));
  }

  return data;
}

/**
 * Returns current authenticated user object or null.
 */
export function getCurrentUser(): { id: string; email: string; name?: string; role: string; branch_id?: string | null } | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("admin_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Clear the admin session from both cookie and localStorage.
 * Call this on logout.
 */
export function logout(): void {
  document.cookie =
    "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
}

