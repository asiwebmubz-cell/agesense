import { apiFetch } from "@/lib/api";
import type { TeamMember } from "@/types";

export async function getActiveTeam(branchId?: string, committee?: string): Promise<TeamMember[]> {
  const params = new URLSearchParams();
  if (branchId) params.append("branch_id", branchId);
  if (committee) params.append("committee", committee);
  const qs = params.toString();
  return apiFetch<TeamMember[]>(`/api/team${qs ? `?${qs}` : ""}`);
}

export async function getAllTeam(): Promise<TeamMember[]> {
  return apiFetch<TeamMember[]>("/api/team/admin/all", { auth: true });
}

export async function getTeamMemberById(id: string): Promise<TeamMember> {
  return apiFetch<TeamMember>(`/api/team/${id}`);
}

export interface TeamMemberPayload {
  branch_id: string;
  name: string;
  position: string;
  committee: 'Executive Committee' | 'Advisory Board';
  photo_url?: string | null;
  biography?: string | null;
  display_order?: number;
  hierarchy_level?: number;
  is_active?: boolean;
}

export async function createTeamMember(payload: TeamMemberPayload): Promise<TeamMember> {
  return apiFetch<TeamMember>("/api/team/admin", {
    method: "POST",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateTeamMember(id: string, payload: Partial<TeamMemberPayload>): Promise<TeamMember> {
  return apiFetch<TeamMember>(`/api/team/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteTeamMember(id: string): Promise<void> {
  return apiFetch<void>(`/api/team/admin/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
