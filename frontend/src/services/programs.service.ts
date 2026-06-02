import { apiFetch } from "@/lib/api";
import type { Program } from "@/types";

// ─── Public endpoints ─────────────────────────────────────────────────────────

/** Fetch all published programs for public pages. */
export async function getPublishedPrograms(): Promise<Program[]> {
  return apiFetch<Program[]>("/api/programs");
}

// ─── Admin endpoints (require auth) ──────────────────────────────────────────

/** Fetch all programs including drafts — for admin dashboard. */
export async function getAllPrograms(): Promise<Program[]> {
  return apiFetch<Program[]>("/api/admin/programs", { auth: true });
}

export interface CreateProgramPayload {
  type: Program["type"];
  title: string;
  description: string;
  image_url?: string;
  status: Program["status"];

  // Detail section fields
  subtitle?: string;
  video_url?: string;
  goals?: string;
  beneficiaries?: string;
  expense_categories?: string;
  project_areas?: string;
  duration?: string;
  active_years?: string;
  packages_distributed?: string;
  gallery_title_1?: string;
  gallery_link_1?: string;
  gallery_title_2?: string;
  gallery_link_2?: string;
  gallery_description?: string;
  images?: string[];
}

/** Create a new program entry. */
export async function createProgram(
  payload: CreateProgramPayload
): Promise<Program> {
  return apiFetch<Program>("/api/admin/programs", {
    method: "POST",
    auth: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Delete a program by ID. */
export async function deleteProgram(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/programs/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

/**
 * Upload an image to Cloudinary via the backend proxy.
 * Returns the hosted image URL.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch<{ imageUrl: string }>("/api/admin/upload", {
    method: "POST",
    auth: true,
    body: formData,
  });

  return res.imageUrl;
}

/**
 * Upload multiple images (up to 20) to Cloudinary via the backend proxy.
 * Returns an array of hosted image URLs.
 */
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await apiFetch<{ imageUrls: string[] }>("/api/admin/upload-multiple", {
    method: "POST",
    auth: true,
    body: formData,
  });

  return res.imageUrls;
}
