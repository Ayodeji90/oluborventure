/**
 * Single source of truth for the Olubor applications database.
 *
 * Consumed by `scripts/provision-appwrite.mjs` (run via `npm run provision`).
 *
 * Vocabulary note: Appwrite 1.8+ (Cloud 2.5.x) renamed the old
 * database -> collection -> document -> attribute model to
 * database -> table -> row -> column. We use the new names throughout.
 *
 * Column rules that bite:
 *  - `xdefault` CANNOT be set when `required` is true, so anything with a
 *    default is declared optional and the default fills the gap.
 *  - `encrypt: true` is only settable at creation and the column can never be
 *    indexed or queried afterwards. Used for passport numbers / scratch PINs.
 *  - Appwrite stamps every row with `$createdAt` / `$updatedAt`, so we never
 *    declare our own timestamp columns.
 */

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "olubor";
export const DATABASE_NAME = "Olubor";

export const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || "application-documents";
export const BUCKET_NAME = "Application documents";
export const BUCKET_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const BUCKET_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];

export const TEAM_COUNSELORS = "counselors";

const PROGRAM_TYPES = ["masters_of_research", "masters", "bachelors", "phd", "other"];

const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "in_review",
  "awaiting_documents",
  "interview",
  "offer",
  "accepted",
  "visa",
  "enrolled",
  "rejected",
  "withdrawn",
];

const DOCUMENT_TYPES = [
  "passport",
  "degree_certificate",
  "transcript",
  "waec_certificate",
  "neco_certificate",
  "cv",
  "sop",
  "research_proposal",
  "reference_letter",
  "visa_refusal_letter",
  "other",
];

// Ordered so that a failing run leaves the most useful tables behind.
export const TABLES = [
  {
    id: "profiles",
    name: "Profiles",
    rowSecurity: true,
    columns: [
      { key: "user_id", type: "varchar", size: 36, required: true },
      { key: "full_name", type: "varchar", size: 128, required: true },
      { key: "email", type: "email", required: true },
      { key: "phone", type: "varchar", size: 32, required: false },
      { key: "whatsapp", type: "varchar", size: 32, required: false },
      { key: "dob", type: "datetime", required: false },
      { key: "nationality", type: "varchar", size: 64, required: false },
      { key: "country_of_residence", type: "varchar", size: 64, required: false },
      { key: "address", type: "varchar", size: 255, required: false },
    ],
    indexes: [{ key: "user_id_unique", type: "unique", columns: ["user_id"] }],
  },
  {
    id: "applications",
    name: "Applications",
    rowSecurity: true,
    columns: [
      { key: "user_id", type: "varchar", size: 36, required: true },
      { key: "reference_code", type: "varchar", size: 24, required: true },
      { key: "program_type", type: "enum", elements: PROGRAM_TYPES, required: true },
      {
        key: "status",
        type: "enum",
        elements: APPLICATION_STATUSES,
        required: false,
        xdefault: "draft",
      },
      {
        key: "completion_pct",
        type: "integer",
        required: false,
        min: 0,
        max: 100,
        xdefault: 0,
      },

      // --- Target programme (course_start_date drives the passport rule) ---
      { key: "target_university", type: "varchar", size: 160, required: false },
      { key: "target_course", type: "varchar", size: 160, required: false },
      { key: "target_intake", type: "varchar", size: 40, required: false },
      { key: "course_start_date", type: "datetime", required: false },

      // --- Requirement 1: passport ---
      { key: "passport_number", type: "varchar", size: 32, required: false, encrypt: true },
      { key: "passport_issue_country", type: "varchar", size: 64, required: false },
      { key: "passport_expiry", type: "datetime", required: false },

      // --- Requirement 3: WAEC / NECO ---
      {
        key: "exam_body",
        type: "enum",
        elements: ["waec", "neco", "both", "none"],
        required: false,
      },
      { key: "exam_year", type: "integer", required: false },
      { key: "exam_number", type: "varchar", size: 32, required: false },
      {
        key: "english_grade",
        type: "enum",
        elements: ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"],
        required: false,
      },

      // --- Requirement 4: scratch card (PIN is encrypted at rest) ---
      { key: "card_body", type: "enum", elements: ["waec", "neco"], required: false },
      { key: "card_serial", type: "varchar", size: 64, required: false },
      { key: "card_pin", type: "varchar", size: 64, required: false, encrypt: true },
      { key: "scratch_verified_at", type: "datetime", required: false },

      // --- Requirements 5, 7, 8, 9 ---
      { key: "cv_no_gaps_confirmed", type: "boolean", required: false, xdefault: false },
      { key: "sop_text", type: "longtext", required: false },
      { key: "research_proposal_text", type: "longtext", required: false },
      { key: "visa_refusal_history", type: "boolean", required: false, xdefault: false },

      // --- Consent ---
      { key: "consent_data", type: "boolean", required: false, xdefault: false },
      { key: "consent_declaration", type: "boolean", required: false, xdefault: false },

      // --- Workflow ---
      { key: "assigned_counselor_id", type: "varchar", size: 36, required: false },
      { key: "submitted_at", type: "datetime", required: false },
    ],
    indexes: [
      { key: "user_id_key", type: "key", columns: ["user_id"] },
      { key: "status_key", type: "key", columns: ["status"] },
      { key: "reference_code_unique", type: "unique", columns: ["reference_code"] },
    ],
  },
  {
    id: "documents",
    name: "Documents",
    rowSecurity: true,
    columns: [
      { key: "user_id", type: "varchar", size: 36, required: true },
      { key: "type", type: "enum", elements: DOCUMENT_TYPES, required: true },
      { key: "label", type: "varchar", size: 128, required: false },
      { key: "file_id", type: "varchar", size: 36, required: true },
      { key: "bucket_id", type: "varchar", size: 36, required: true },
      { key: "file_name", type: "varchar", size: 255, required: false },
      { key: "mime_type", type: "varchar", size: 128, required: false },
      { key: "size_bytes", type: "integer", required: false },
      { key: "verified", type: "boolean", required: false, xdefault: false },
      { key: "verified_by", type: "varchar", size: 36, required: false },
      { key: "verified_at", type: "datetime", required: false },
      { key: "reviewer_note", type: "text", required: false },
      { key: "uploaded_at", type: "datetime", required: false },
    ],
    indexes: [
      { key: "user_id_key", type: "key", columns: ["user_id"] },
      { key: "type_key", type: "key", columns: ["type"] },
    ],
  },
  {
    id: "references",
    name: "References",
    rowSecurity: true,
    columns: [
      { key: "user_id", type: "varchar", size: 36, required: true },
      { key: "slot", type: "integer", required: true, min: 1, max: 2 },
      { key: "kind", type: "enum", elements: ["academic", "professional"], required: false },
      { key: "full_name", type: "varchar", size: 128, required: true },
      { key: "title", type: "varchar", size: 128, required: false },
      { key: "organisation", type: "varchar", size: 160, required: false },
      { key: "email", type: "email", required: false },
      { key: "phone", type: "varchar", size: 32, required: false },
      { key: "relationship", type: "varchar", size: 80, required: false },
      { key: "letter_file_id", type: "varchar", size: 36, required: false },
      {
        key: "status",
        type: "enum",
        elements: ["pending", "contacted", "received"],
        required: false,
        xdefault: "pending",
      },
      { key: "received_at", type: "datetime", required: false },
    ],
    indexes: [
      { key: "user_id_key", type: "key", columns: ["user_id"] },
      { key: "slot_key", type: "key", columns: ["slot"] },
    ],
  },
  {
    id: "refusals",
    name: "Visa refusals",
    rowSecurity: true,
    columns: [
      { key: "user_id", type: "varchar", size: 36, required: true },
      { key: "country", type: "varchar", size: 64, required: true },
      { key: "visa_type", type: "varchar", size: 64, required: false },
      { key: "refused_on", type: "datetime", required: false },
      { key: "reason", type: "text", required: false },
      { key: "document_file_id", type: "varchar", size: 36, required: false },
    ],
    indexes: [{ key: "user_id_key", type: "key", columns: ["user_id"] }],
  },
  {
    id: "events",
    name: "Application events",
    rowSecurity: true,
    columns: [
      { key: "user_id", type: "varchar", size: 36, required: false },
      {
        key: "actor_type",
        type: "enum",
        elements: ["applicant", "staff", "system"],
        required: false,
        xdefault: "system",
      },
      { key: "actor_id", type: "varchar", size: 36, required: false },
      { key: "type", type: "varchar", size: 40, required: true },
      { key: "from_status", type: "varchar", size: 32, required: false },
      { key: "to_status", type: "varchar", size: 32, required: false },
      { key: "note", type: "text", required: false },
    ],
    indexes: [{ key: "type_key", type: "key", columns: ["type"] }],
  },
  {
    id: "document_types",
    name: "Document types",
    rowSecurity: false,
    // Checklist config: readable by anyone so the form can render without a session.
    permissions: ["read(\"any\")"],
    columns: [
      { key: "key", type: "varchar", size: 40, required: true },
      { key: "label", type: "varchar", size: 120, required: true },
      { key: "is_required", type: "boolean", required: false, xdefault: true },
      { key: "is_multiple", type: "boolean", required: false, xdefault: false },
      { key: "max_size_mb", type: "integer", required: false, xdefault: 10 },
      { key: "accepted_formats", type: "varchar", size: 160, required: false },
      { key: "help_text", type: "text", required: false },
      { key: "applies_to", type: "varchar", size: 40, required: false },
      { key: "order_index", type: "integer", required: false, xdefault: 0 },
    ],
    indexes: [{ key: "key_unique", type: "unique", columns: ["key"] }],
  },
];

/**
 * Parent -> child links, created after every table exists.
 * `key` lands on the child; `twoWayKey` lists children on the parent.
 */
export const RELATIONSHIPS = [
  {
    table: "documents",
    key: "application_id",
    relatedTable: "applications",
    type: "manyToOne",
    twoWay: true,
    twoWayKey: "documents",
    onDelete: "cascade",
  },
  {
    table: "references",
    key: "application_id",
    relatedTable: "applications",
    type: "manyToOne",
    twoWay: true,
    twoWayKey: "references",
    onDelete: "cascade",
  },
  {
    table: "refusals",
    key: "application_id",
    relatedTable: "applications",
    type: "manyToOne",
    twoWay: true,
    twoWayKey: "refusals",
    onDelete: "cascade",
  },
  {
    table: "events",
    key: "application_id",
    relatedTable: "applications",
    type: "manyToOne",
    twoWay: true,
    twoWayKey: "events",
    onDelete: "cascade",
  },
];

/** Seed rows for the checklist. */
export const DOCUMENT_TYPE_SEED = [
  {
    key: "passport",
    label: "International Passport",
    is_required: true,
    is_multiple: false,
    order_index: 1,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,jpg,jpeg,png",
    help_text:
      "Bio-data page. The expiry date must be at least 7 months after the course start date.",
  },
  {
    key: "degree_certificate",
    label: "Official Degree Certificate",
    is_required: true,
    is_multiple: true,
    order_index: 2,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,jpg,jpeg,png",
    help_text: "Official certificate only. Statements of results are not accepted.",
  },
  {
    key: "transcript",
    label: "Official Transcript",
    is_required: true,
    is_multiple: true,
    order_index: 3,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,jpg,jpeg,png",
    help_text: "Official transcript. Statements of results are not accepted.",
  },
  {
    key: "waec_certificate",
    label: "WAEC Certificate",
    is_required: true,
    is_multiple: false,
    order_index: 4,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,jpg,jpeg,png",
    help_text:
      "Minimum C6 in English Language. WAEC printouts or statements are not accepted.",
  },
  {
    key: "neco_certificate",
    label: "NECO Certificate",
    is_required: true,
    is_multiple: false,
    order_index: 5,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,jpg,jpeg,png",
    help_text:
      "Minimum C6 in English Language. NECO printouts or statements are not accepted.",
  },
  {
    key: "cv",
    label: "Detailed CV",
    is_required: true,
    is_multiple: false,
    order_index: 6,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,doc,docx",
    help_text:
      "Include secondary school, university and work experience. No gaps longer than 6 months.",
  },
  {
    key: "reference_letter",
    label: "Reference Letter",
    is_required: false,
    is_multiple: true,
    order_index: 7,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,doc,docx",
    help_text: "Optional at first — we contact your two referees for you.",
  },
  {
    key: "sop",
    label: "Statement of Purpose",
    is_required: true,
    is_multiple: false,
    order_index: 8,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,doc,docx",
    help_text:
      "Addressed to the university. Research the course, university, city and modules first.",
  },
  {
    key: "research_proposal",
    label: "Research Proposal",
    is_required: true,
    is_multiple: false,
    order_index: 9,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,doc,docx",
    help_text: "Required for Masters of Research applications.",
  },
  {
    key: "visa_refusal_letter",
    label: "Visa Refusal Letter",
    is_required: false,
    is_multiple: true,
    order_index: 10,
    applies_to: "masters_of_research",
    accepted_formats: "pdf,jpg,jpeg,png",
    help_text: "Attach the refusal letter for any visa you have been refused.",
  },
];
