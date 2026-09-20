import { apiFetch } from "@/lib/api";
import type { SiteContent } from "@/types";

export async function getSiteContent(key: string): Promise<SiteContent> {
  return apiFetch<SiteContent>(`/api/site-content/${key}`);
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
  return apiFetch<SiteContent[]>("/api/site-content/admin/all", { auth: true });
}

export interface SiteContentPayload {
  title?: string | null;
  body: string;
  metadata?: any;
}

export async function updateSiteContent(key: string, payload: SiteContentPayload): Promise<SiteContent> {
  return apiFetch<SiteContent>(`/api/site-content/admin/${key}`, {
    method: "PUT",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
