import { apiFetch } from "@/lib/api";
import type { AnnualReport } from "@/types";

export async function getPublishedAnnualReports(): Promise<AnnualReport[]> {
  return apiFetch<AnnualReport[]>("/api/annual-reports");
}

export async function getAllAnnualReports(): Promise<AnnualReport[]> {
  return apiFetch<AnnualReport[]>("/api/annual-reports/admin/all", { auth: true });
}

export interface AnnualReportPayload {
  year: number;
  title: string;
  description?: string | null;
  pdf_url?: string | null;
  is_published?: boolean;
  display_order?: number;
}

export async function createAnnualReport(payload: AnnualReportPayload): Promise<AnnualReport> {
  return apiFetch<AnnualReport>("/api/annual-reports/admin", {
    method: "POST",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateAnnualReport(id: string, payload: Partial<AnnualReportPayload>): Promise<AnnualReport> {
  return apiFetch<AnnualReport>(`/api/annual-reports/admin/${id}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteAnnualReport(id: string): Promise<void> {
  return apiFetch<void>(`/api/annual-reports/admin/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
