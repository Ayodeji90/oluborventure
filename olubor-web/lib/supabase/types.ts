/** TypeScript types for Supabase database rows. */

export type ProgramType =
  | "masters_of_research"
  | "bachelors"
  | "phd"
  | "flight_booking";

export type ApplicationStatus =
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

// type aliases (not interfaces) so they satisfy Record<string, unknown> constraints
// required by @supabase/supabase-js v2 generic Database type checking.
export type Application = {
  id: string;
  user_id: string | null;
  reference_code: string;
  program_type: ProgramType;
  status: ApplicationStatus;

  // Contact
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;

  // Academic
  waec_serial: string | null;
  waec_pin: string | null;
  visa_refusal: boolean | null;

  // Flight booking
  dob: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  departure_city: string | null;
  destination_city: string | null;
  travel_date: string | null;
  return_date: string | null;
  trip_type: string | null;
  num_passengers: number | null;
  preferred_airline: string | null;

  submitted_at: string;
  created_at: string;
  updated_at: string;
};

export type ApplicationReference = {
  id: string;
  application_id: string;
  slot: number;
  full_name: string;
  email: string | null;
  institution: string | null;
};

export type ApplicationDraft = {
  id: string;
  user_id: string;
  program_type: ProgramType;
  form_data: Record<string, string>;
  same_as_phone: boolean;
  created_at: string;
  updated_at: string;
};

export type ApplicationDraftDocument = {
  id: string;
  draft_id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number;
  uploaded_at: string;
};

export type ApplicationDocument = {
  id: string;
  application_id: string;
  document_type: string;
  file_path: string;
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_at: string;
};

export type Profile = {
  id: string;
  email: string;
  is_admin: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  created_at: string;
};

type InsertWithDefaults<Row, Required extends keyof Row> =
  Pick<Row, Required> & Partial<Omit<Row, Required>>;

/** Supabase database schema type used by the typed client. */
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: InsertWithDefaults<Application, "reference_code" | "program_type" | "full_name" | "email">;
        Update: Partial<Application>;
        Relationships: never[];
      };
      application_references: {
        Row: ApplicationReference;
        Insert: InsertWithDefaults<ApplicationReference, "application_id" | "slot" | "full_name">;
        Update: Partial<ApplicationReference>;
        Relationships: never[];
      };
      application_drafts: {
        Row: ApplicationDraft;
        Insert: InsertWithDefaults<ApplicationDraft, "user_id" | "program_type">;
        Update: Partial<ApplicationDraft>;
        Relationships: never[];
      };
      application_draft_documents: {
        Row: ApplicationDraftDocument;
        Insert: InsertWithDefaults<ApplicationDraftDocument, "draft_id" | "document_type" | "file_path" | "file_name" | "size_bytes">;
        Update: Partial<ApplicationDraftDocument>;
        Relationships: never[];
      };
      application_documents: {
        Row: ApplicationDocument;
        Insert: InsertWithDefaults<ApplicationDocument, "application_id" | "document_type" | "file_path">;
        Update: Partial<ApplicationDocument>;
        Relationships: never[];
      };
      profiles: {
        Row: Profile;
        Insert: InsertWithDefaults<Profile, "id" | "email">;
        Update: Partial<Profile>;
        Relationships: never[];
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: InsertWithDefaults<ContactMessage, "name" | "email" | "message">;
        Update: Partial<ContactMessage>;
        Relationships: never[];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      consume_contact_rate_limit: {
        Args: { p_bucket_key: string; p_window_start: string };
        Returns: number;
      };
    };
  };
}

/* ── Display constants ─────────────────────────────────────────── */

/** Maps URL slugs (from /apply/[program]) to DB enum values. */
export const SLUG_TO_PROGRAM: Record<string, ProgramType> = {
  "masters-of-research": "masters_of_research",
  bachelors: "bachelors",
  phd: "phd",
  "flight-booking": "flight_booking",
};

export const PROGRAM_LABELS: Record<ProgramType, string> = {
  masters_of_research: "Masters of Research",
  bachelors: "Bachelors",
  phd: "PhD",
  flight_booking: "Flight Booking",
};

export const PROGRAM_PREFIXES: Record<ProgramType, string> = {
  masters_of_research: "MRE",
  bachelors: "BSC",
  phd: "PHD",
  flight_booking: "FLT",
};

export const STATUS_LABELS: Record<
  ApplicationStatus,
  { label: string; tone: "neutral" | "progress" | "good" | "warn" | "bad" }
> = {
  submitted:           { label: "Submitted",          tone: "progress" },
  in_review:           { label: "In review",           tone: "progress" },
  awaiting_documents:  { label: "Awaiting documents",  tone: "warn"     },
  interview:           { label: "Interview",           tone: "progress" },
  offer:               { label: "Offer received",      tone: "good"     },
  accepted:            { label: "Accepted",            tone: "good"     },
  visa:                { label: "Visa stage",          tone: "progress" },
  enrolled:            { label: "Enrolled",            tone: "good"     },
  rejected:            { label: "Unsuccessful",        tone: "bad"      },
  withdrawn:           { label: "Withdrawn",           tone: "neutral"  },
};

export const ALL_STATUSES = Object.keys(STATUS_LABELS) as ApplicationStatus[];
