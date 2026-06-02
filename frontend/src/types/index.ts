// ─── Public-facing content types (aligned with API response shape) ────────────

export type ProgramType = "Our Programs" | "Our Work" | "Impact Stories";
export type ProgramStatus = "Published" | "Draft";

/** Shape returned by GET /api/programs (snake_case from Postgres) */
export interface Program {
  id: string;
  type: ProgramType;
  title: string;
  description: string;
  image_url?: string;
  status: ProgramStatus;
  created_at: string;

  // Extra detailed program info (Project Ihsan structure)
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

/** Legacy alias used inside admin content page */
export interface ContentItem {
  id: string;
  type: ProgramType;
  title: string;
  content: string;
  date: string;
  status: ProgramStatus;
  imageUrl?: string;
}

// ─── Admin entity types ───────────────────────────────────────────────────────

export type VolunteerStatus = "Pending" | "Approved" | "Rejected";

export interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: VolunteerStatus;
  form_data_json?: Record<string, unknown>;
  created_at: string;
}

export type PaymentStatus = "Pending" | "Completed" | "Failed";

export interface Donor {
  id: string;
  name: string;
  email: string;
  amount: number;
  payment_status: PaymentStatus;
  transaction_id?: string;
  created_at: string;
}

// ─── Auth types ───────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  email: string;
}

// ─── API utility types ────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  details?: string;
}
