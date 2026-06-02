import { apiFetch } from "@/lib/api";
import type { Donor } from "@/types";

export interface CreateDonorPayload {
  name: string;
  email: string;
  amount: number;
  transaction_id: string;
  payment_status?: 'Pending' | 'Completed' | 'Failed';
}

export async function submitDonationVerification(payload: CreateDonorPayload): Promise<Donor> {
  return apiFetch<Donor>("/api/donors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Fetch all donor records for the admin dashboard. */
export async function getAllDonorsAdmin(): Promise<Donor[]> {
  return apiFetch<Donor[]>("/api/donors/admin", { auth: true });
}

