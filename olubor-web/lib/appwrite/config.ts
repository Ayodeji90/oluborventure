/**
 * Browser-safe Appwrite configuration.
 *
 * Only `NEXT_PUBLIC_*` values live here — IDs are not secrets. The API key is
 * confined to `lib/appwrite/server.ts`.
 */

export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "";
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";
export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "olubor";
export const APPWRITE_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ?? "application-documents";

/** Table ids — keep in step with `scripts/appwrite-schema.mjs`. */
export const TABLES = {
  profiles: "profiles",
  applications: "applications",
  documents: "documents",
  references: "references",
  refusals: "refusals",
  events: "events",
  documentTypes: "document_types",
} as const;

/** False until the env vars are filled in; the portal shows a setup notice. */
export const isAppwriteConfigured = Boolean(APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID);
