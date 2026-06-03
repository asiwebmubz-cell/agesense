import { apiFetch } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────────

export const PARTNERSHIP_TYPES = [
  "Corporate Partnership",
  "NGO Partnership",
  "Academic Partnership",
  "Healthcare Partnership",
  "Research Collaboration",
  "Sponsorship",
  "Volunteer Organization Partnership",
  "Technology Partnership",
  "Other",
] as const;

export type PartnershipType = (typeof PARTNERSHIP_TYPES)[number];

export const PARTNERSHIP_STATUSES = [
  "New",
  "Contacted",
  "In Discussion",
  "Approved",
  "Rejected",
  "Closed",
] as const;

export type PartnershipStatus = (typeof PARTNERSHIP_STATUSES)[number];

export interface PartnershipActivity {
  id: string;
  inquiry_id: string;
  action: string;
  created_at: string;
}

export interface PartnershipInquiry {
  id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  partnership_type: string;
  message: string;
  status: PartnershipStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  activity?: PartnershipActivity[];
}

export interface PartnershipStats {
  total: number;
  new: number;
  contacted: number;
  in_discussion: number;
  approved: number;
  rejected: number;
  closed: number;
}

export interface CreatePartnershipPayload {
  organization_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  partnership_type: PartnershipType;
  message: string;
}

export interface UpdatePartnershipPayload {
  status?: PartnershipStatus;
  internal_notes?: string;
}

// ─── Public endpoints ──────────────────────────────────────────────────────────

/** Submit a public partnership inquiry. */
export async function submitPartnershipInquiry(
  payload: CreatePartnershipPayload
): Promise<PartnershipInquiry> {
  return apiFetch<PartnershipInquiry>("/api/partnerships", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ─── Admin endpoints ───────────────────────────────────────────────────────────

/** Fetch all partnership inquiries — admin. */
export async function getAllPartnershipsAdmin(): Promise<PartnershipInquiry[]> {
  return apiFetch<PartnershipInquiry[]>("/api/partnerships/admin", {
    auth: true,
  });
}

/** Fetch dashboard stats — admin. */
export async function getPartnershipStatsAdmin(): Promise<PartnershipStats> {
  return apiFetch<PartnershipStats>("/api/partnerships/admin/stats", {
    auth: true,
  });
}

/** Update inquiry status and/or internal notes — admin. */
export async function updatePartnershipStatus(
  id: string,
  payload: UpdatePartnershipPayload
): Promise<PartnershipInquiry> {
  return apiFetch<PartnershipInquiry>(`/api/partnerships/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
