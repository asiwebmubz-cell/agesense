import { apiFetch } from "@/lib/api";

export interface RoleWithPermissions {
  id: string;
  name: string;
  description?: string | null;
  is_system: boolean;
  assignable: boolean;
  permissions: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

export async function getRoles(): Promise<RoleWithPermissions[]> {
  return apiFetch<RoleWithPermissions[]>("/api/roles/admin", { auth: true });
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: string[];
}

export async function createRole(payload: CreateRolePayload): Promise<RoleWithPermissions> {
  return apiFetch<RoleWithPermissions>("/api/roles/admin", {
    method: "POST",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export interface UpdateRolePayload {
  description?: string;
  permissions?: string[];
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<RoleWithPermissions> {
  return apiFetch<RoleWithPermissions>(`/api/roles/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteRole(id: string): Promise<void> {
  return apiFetch<void>(`/api/roles/admin/${id}`, { method: "DELETE", auth: true });
}