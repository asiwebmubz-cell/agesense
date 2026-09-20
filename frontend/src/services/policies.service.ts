import { apiFetch } from "@/lib/api";
import type { Policy } from "@/types";

export async function getPublishedPolicies(): Promise<Policy[]> {
  return apiFetch<Policy[]>("/api/policies");
}

export async function getAllPolicies(): Promise<Policy[]> {
  return apiFetch<Policy[]>("/api/policies/admin/all", { auth: true });
}

export interface PolicyPayload {
  title: string;
  description?: string | null;
  document_url?: string | null;
  category?: string | null;
  is_published?: boolean;
  display_order?: number;
}

export async function createPolicy(payload: PolicyPayload): Promise<Policy> {
  return apiFetch<Policy>("/api/policies/admin", {
    method: "POST",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updatePolicy(id: string, payload: Partial<PolicyPayload>): Promise<Policy> {
  return apiFetch<Policy>(`/api/policies/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deletePolicy(id: string): Promise<void> {
  return apiFetch<void>(`/api/policies/admin/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
