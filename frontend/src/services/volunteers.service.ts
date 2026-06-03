import { apiFetch } from "@/lib/api";
import type { Volunteer, VolunteerStatus } from "@/types";

/** Fetch all volunteer applications for the admin dashboard. */
export async function getAllVolunteersAdmin(): Promise<Volunteer[]> {
  return apiFetch<Volunteer[]>("/api/volunteers/admin", { auth: true });
}

/** Update the status of a volunteer application (Approve / Reject). */
export async function updateVolunteerStatusAdmin(
  id: string,
  status: VolunteerStatus
): Promise<Volunteer> {
  return apiFetch<Volunteer>(`/api/volunteers/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

/** Submit a new volunteer application. */
export async function submitVolunteerApplication(
  payload: { full_name: string; email: string; phone?: string; form_data?: Record<string, any> }
): Promise<Volunteer> {
  return apiFetch<Volunteer>("/api/volunteers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
