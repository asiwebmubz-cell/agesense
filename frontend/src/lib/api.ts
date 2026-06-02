import type { ApiError } from "@/types";

// ─── Base URL ─────────────────────────────────────────────────────────────────

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/** Read the JWT stored after login — browser-only. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

/** Returns Authorization header object, or empty object if no token. */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

/**
 * Typed fetch wrapper that:
 *  - Prepends API_BASE_URL
 *  - Optionally adds Authorization header
 *  - Throws a string error message on non-2xx responses
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { auth = false, headers = {}, ...rest } = options;

  const mergedHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
    ...(auth ? getAuthHeaders() : {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: mergedHeaders,
    ...rest,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status}`;
    try {
      const body: ApiError = await res.json();
      errorMsg = body.error || errorMsg;
    } catch {
      // response had no JSON body
    }
    throw new Error(errorMsg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
