import { NextResponse } from "next/server";
import { AppwriteException, ID, Permission, Role } from "node-appwrite";
import { APPWRITE_DATABASE_ID, TABLES } from "@/lib/appwrite/config";
import { getServerTables, getUserIdFromRequest, isServerConfigured } from "@/lib/appwrite/server";
import { PROGRAM_PREFIXES, type ProgramType } from "@/lib/appwrite/types";

/** Unambiguous alphabet — no O/0, I/1 to keep reference codes readable. */
const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSuffix(length = 4): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += REFERENCE_ALPHABET[bytes[i] % REFERENCE_ALPHABET.length];
  }
  return out;
}

/**
 * Starts a new draft application for the signed-in applicant and hands back a
 * human-friendly reference code (e.g. MRE-2026-7K2Q).
 */
export async function POST(request: Request) {
  if (!isServerConfigured) {
    return NextResponse.json({ error: "The portal backend is not configured yet." }, { status: 503 });
  }

  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
  }

  let payload: { program_type?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const programType = String(payload.program_type ?? "");
  // `in` would also accept prototype keys like "toString", so check own keys.
  if (!Object.prototype.hasOwnProperty.call(PROGRAM_PREFIXES, programType)) {
    return NextResponse.json({ error: "Choose a programme to apply for." }, { status: 400 });
  }
  const chosenProgram = programType as ProgramType;

  const tables = getServerTables();
  const prefix = PROGRAM_PREFIXES[chosenProgram];
  const year = new Date().getFullYear();

  // `reference_code` is unique-indexed; retry on the rare collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const referenceCode = `${prefix}-${year}-${randomSuffix()}`;

    try {
      const row = await tables.createRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: TABLES.applications,
        rowId: ID.unique(),
        data: {
          user_id: userId,
          reference_code: referenceCode,
          program_type: chosenProgram,
          status: "draft",
          completion_pct: 0,
          visa_refusal_history: false,
          cv_no_gaps_confirmed: false,
          consent_data: false,
          consent_declaration: false,
        },
        // Read-only for the owner: every write is validated by this API.
        permissions: [Permission.read(Role.user(userId))],
      });

      // Audit trail. Best effort — never fail the application over it.
      try {
        await tables.createRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: TABLES.events,
          rowId: ID.unique(),
          data: {
            user_id: userId,
            application_id: row.$id,
            actor_type: "applicant",
            actor_id: userId,
            type: "created",
            to_status: "draft",
            note: `${referenceCode} started`,
          },
          permissions: [Permission.read(Role.user(userId))],
        });
      } catch (err) {
        console.warn("[applications] could not write creation event", err);
      }

      return NextResponse.json({ application: row }, { status: 201 });
    } catch (err) {
      if (err instanceof AppwriteException && err.code === 409) continue;
      console.error("[applications] create failed", err);
      return NextResponse.json(
        { error: "Could not start your application. Please try again." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { error: "Could not allocate a reference code. Please try again." },
    { status: 500 },
  );
}
