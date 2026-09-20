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

export type PaymentStatus = "Pending" | "Verified" | "Rejected";

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  payment_method?: string;
  amount: number;
  payment_status: PaymentStatus;
  transaction_id?: string;
  admin_notes?: string;
  verified_by?: string;
  verified_at?: string;
  last_status_change_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
    branch_id?: string | null;
  };
}

// ─── New Entities for AgeSense Expansion ─────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  division: string;
  description?: string | null;
  location?: string | null;
  contact_info?: any;
  image_url?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type CommitteeType = 'Executive Committee' | 'Advisory Board';

export interface TeamMember {
  id: string;
  branch_id: string;
  branch_name?: string;
  name: string;
  position: string;
  committee: CommitteeType;
  photo_url?: string | null;
  biography?: string | null;
  display_order: number;
  hierarchy_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnualReport {
  id: string;
  year: number;
  title: string;
  description?: string | null;
  pdf_url?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  title: string;
  description?: string | null;
  document_url?: string | null;
  category?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  title?: string | null;
  body: string;
  metadata?: any;
  updated_by?: string | null;
  updated_at: string;
}

export interface AppUser {
  id: string;
  name?: string | null;
  email: string;
  role: 'super_admin' | 'marketing' | 'branch_manager' | 'admin' | 'content_manager';
  branch_id?: string | null;
  branch_name?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── API utility types ────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  details?: string;
}

