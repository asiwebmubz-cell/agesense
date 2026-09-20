import { apiFetch } from "@/lib/api";
import type { Branch } from "@/types";

export async function getActiveBranches(): Promise<Branch[]> {
  return apiFetch<Branch[]>("/api/branches");
}

export async function getAllBranches(): Promise<Branch[]> {
  return apiFetch<Branch[]>("/api/branches/admin/all", { auth: true });
}

export async function getBranchById(id: string): Promise<Branch> {
  return apiFetch<Branch>(`/api/branches/${id}`);
}

export interface BranchPayload {
  name: string;
  division: string;
  description?: string | null;
  location?: string | null;
  contact_info?: any;
  image_url?: string | null;
  is_active?: boolean;
  display_order?: number;
}

export async function createBranch(payload: BranchPayload): Promise<Branch> {
  return apiFetch<Branch>("/api/branches/admin", {
    method: "POST",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateBranch(id: string, payload: Partial<BranchPayload>): Promise<Branch> {
  return apiFetch<Branch>(`/api/branches/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteBranch(id: string): Promise<void> {
  return apiFetch<void>(`/api/branches/admin/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
