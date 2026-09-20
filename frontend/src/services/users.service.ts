import { apiFetch } from "@/lib/api";
import type { AppUser } from "@/types";

export async function getAllUsers(): Promise<AppUser[]> {
  return apiFetch<AppUser[]>("/api/users/admin", { auth: true });
}

export async function getUserById(id: string): Promise<AppUser> {
  return apiFetch<AppUser>(`/api/users/admin/${id}`, { auth: true });
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  branch_id?: string | null;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  branch_id?: string | null;
  is_active?: boolean;
}

export async function createUser(payload: CreateUserPayload): Promise<AppUser> {
  return apiFetch<AppUser>("/api/users/admin", {
    method: "POST",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<AppUser> {
  return apiFetch<AppUser>(`/api/users/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/api/users/admin/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
