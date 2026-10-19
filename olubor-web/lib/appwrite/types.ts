/**
 * Row shapes for the portal database.
 * These mirror `scripts/appwrite-schema.mjs` — change both together.
 *
 * Every Appwrite row already carries `$id`, `$createdAt`, `$updatedAt`,
 * `$permissions` and friends via `Models.Row`.
 */

import type { Models } from "appwrite";

export type ProgramType = "masters_of_research" | "masters" | "bachelors" | "phd" | "other";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "awaiting_documents"
  | "interview"
  | "offer"
  | "accepted"
  | "visa"
  | "enrolled"
  | "rejected"
  | "withdrawn";

export type DocumentType =
  | "passport"
  | "degree_certificate"
  | "transcript"
  | "waec_certificate"
  | "neco_certificate"
  | "cv"
  | "sop"
  | "research_proposal"
  | "reference_letter"
  | "visa_refusal_letter"
  | "other";

export type ExamBody = "waec" | "neco" | "both" | "none";
export type EnglishGrade = "A1" | "B2" | "B3" | "C4" | "C5" | "C6" | "D7" | "E8" | "F9";

export type Profile = Models.Row & {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  dob?: string | null;
  nationality?: string | null;
  country_of_residence?: string | null;
  address?: string | null;
};

export type Application = Models.Row & {
  user_id: string;
  reference_code: string;
  program_type: ProgramType;
  status: ApplicationStatus;
  completion_pct: number;

  target_university?: string | null;
  target_course?: string | null;
  target_intake?: string | null;
  course_start_date?: string | null;

  passport_number?: string | null;
  passport_issue_country?: string | null;
  passport_expiry?: string | null;

  exam_body?: ExamBody | null;
  exam_year?: number | null;
  exam_number?: string | null;
  english_grade?: EnglishGrade | null;

  card_body?: "waec" | "neco" | null;
  card_serial?: string | null;
  card_pin?: string | null;
  scratch_verified_at?: string | null;

  cv_no_gaps_confirmed?: boolean | null;
  sop_text?: string | null;
  research_proposal_text?: string | null;
  visa_refusal_history?: boolean | null;

  consent_data?: boolean | null;
  consent_declaration?: boolean | null;

  assigned_counselor_id?: string | null;
  submitted_at?: string | null;
};

export type ApplicationDocument = Models.Row & {
  user_id: string;
  application_id?: string | null;
  type: DocumentType;
  label?: string | null;
  file_id: string;
  bucket_id: string;
  file_name?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  verified?: boolean | null;
  verified_by?: string | null;
  verified_at?: string | null;
  reviewer_note?: string | null;
  uploaded_at?: string | null;
};

export type DocumentTypeConfig = Models.Row & {
  key: DocumentType;
  label: string;
  is_required?: boolean | null;
  is_multiple?: boolean | null;
  max_size_mb?: number | null;
  accepted_formats?: string | null;
  help_text?: string | null;
  applies_to?: string | null;
  order_index?: number | null;
};

/* ------------------------------------------------------------------ display */

export const PROGRAM_LABELS: Record<ProgramType, string> = {
  masters_of_research: "Masters of Research",
  masters: "Masters",
  bachelors: "Bachelors",
  phd: "PhD",
  other: "Other",
};

export const PROGRAM_PREFIXES: Record<ProgramType, string> = {
  masters_of_research: "MRE",
  masters: "MSC",
  bachelors: "BSC",
  phd: "PHD",
  other: "APP",
};

/** Statuses shown to an applicant, with a tone used by the badge. */
export const STATUS_LABELS: Record<
  ApplicationStatus,
  { label: string; tone: "neutral" | "progress" | "good" | "warn" | "bad" }
> = {
  draft: { label: "Draft", tone: "neutral" },
  submitted: { label: "Submitted", tone: "progress" },
  in_review: { label: "In review", tone: "progress" },
  awaiting_documents: { label: "Awaiting documents", tone: "warn" },
  interview: { label: "Interview", tone: "progress" },
  offer: { label: "Offer received", tone: "good" },
  accepted: { label: "Accepted", tone: "good" },
  visa: { label: "Visa stage", tone: "progress" },
  enrolled: { label: "Enrolled", tone: "good" },
  rejected: { label: "Unsuccessful", tone: "bad" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
};

/**
 * Passport rule: valid at least 7 months after the course start date.
 * Returns null when there is not enough information to judge.
 */
export function passportValidFrom(
  passportExpiry?: string | null,
  courseStartDate?: string | null,
): boolean | null {
  if (!passportExpiry || !courseStartDate) return null;
  const expiry = new Date(passportExpiry);
  const start = new Date(courseStartDate);
  if (Number.isNaN(expiry.getTime()) || Number.isNaN(start.getTime())) return null;
  const minimum = new Date(start);
  minimum.setMonth(minimum.getMonth() + 7);
  return expiry >= minimum;
}

const PASSING_ENGLISH_GRADES: EnglishGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6"];

/** WAEC/NECO rule: English Language at C6 or better. */
export function englishGradePasses(grade?: EnglishGrade | null): boolean | null {
  if (!grade) return null;
  return PASSING_ENGLISH_GRADES.includes(grade);
}
