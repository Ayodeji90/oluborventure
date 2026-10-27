import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getServerClient } from "@/lib/supabase/server";
import {
  SLUG_TO_PROGRAM,
  PROGRAM_PREFIXES,
  type Database,
  type ProgramType,
} from "@/lib/supabase/types";

/** Unambiguous alphabet — no O/0, I/1 to keep reference codes readable. */
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function randomSuffix(length = 4): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return out;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/**
 * POST /api/applications/submit
 *
 * Requires a verified applicant session. The row is bound to that user.
 * Body: { program: string, text: Record<string,string>, hasVisaRefusal: boolean }
 * Returns: { application_id, reference_code }
 */
export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to submit an application." }, { status: 401 });
  }

  if (Number(request.headers.get("content-length") ?? 0) > 32 * 1024) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: {
    program?: string;
    text?: Record<string, string>;
    hasVisaRefusal?: boolean;
    draftId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const programType: ProgramType | undefined = SLUG_TO_PROGRAM[body.program ?? ""];
  if (!programType) {
    return NextResponse.json({ error: "Invalid programme." }, { status: 400 });
  }

  let draftId: string | null = null;
  if (body.draftId !== undefined) {
    if (typeof body.draftId !== "string" || !UUID_RE.test(body.draftId)) {
      return NextResponse.json({ error: "Saved application not found." }, { status: 404 });
    }
    const supabase = getServerClient();
    const { data: draft } = await supabase
      .from("application_drafts")
      .select("id, program_type")
      .eq("id", body.draftId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!draft || draft.program_type !== programType) {
      return NextResponse.json({ error: "Saved application not found." }, { status: 404 });
    }
    draftId = draft.id;
  }

  const rawText: unknown = body.text ?? {};
  if (typeof rawText !== "object" || rawText === null || Array.isArray(rawText)) {
    return NextResponse.json({ error: "Invalid application details." }, { status: 400 });
  }
  const raw = rawText as Record<string, unknown>;
  const clean = (key: string, max = 200): string | null => {
    const value = raw[key];
    if (value === undefined || value === null || value === "") return "";
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length <= max ? trimmed : null;
  };
  const values = {
    fullName: clean("fullName", 160), email: clean("email", 254),
    phone: clean("phone", 40), whatsapp: clean("whatsapp", 40),
    waecSerial: clean("waecSerial", 80), waecPin: clean("waecPin", 80),
    dob: clean("dob", 10), passportNumber: clean("passportNumber", 80),
    passportExpiry: clean("passportExpiry", 10), departureCity: clean("departureCity", 120),
    destinationCity: clean("destinationCity", 120), travelDate: clean("travelDate", 10),
    returnDate: clean("returnDate", 10), tripType: clean("tripType", 10),
    numPassengers: clean("numPassengers", 2), preferredAirline: clean("preferredAirline", 120),
    ref1Name: clean("ref1Name", 160), ref1Email: clean("ref1Email", 254),
    ref1Institution: clean("ref1Institution", 200), ref2Name: clean("ref2Name", 160),
    ref2Email: clean("ref2Email", 254), ref2Institution: clean("ref2Institution", 200),
  };
  if (Object.values(values).some((value) => value === null)) {
    return NextResponse.json({ error: "One or more fields are invalid or too long." }, { status: 400 });
  }
  const v = values as { [K in keyof typeof values]: string };
  const email = v.email.toLowerCase();
  if (!v.fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid name and email address." }, { status: 400 });
  }
  if (!v.phone) return NextResponse.json({ error: "Phone number is required." }, { status: 400 });

  const supabase = getServerClient();
  const year = new Date().getFullYear();
  const prefix = PROGRAM_PREFIXES[programType];

  // Build application row — map form field names to DB column names
  const isAcademic = programType !== "flight_booking";
  const isFlight = programType === "flight_booking";
  if (isAcademic && typeof body.hasVisaRefusal !== "boolean") {
    return NextResponse.json({ error: "Please answer the visa refusal question." }, { status: 400 });
  }
  if (isFlight) {
    const dateValues = [v.dob, v.passportExpiry, v.travelDate, ...(v.tripType === "return" ? [v.returnDate] : [])];
    if (dateValues.some((date) => !isValidDate(date))) {
      return NextResponse.json({ error: "Enter valid travel and passport dates." }, { status: 400 });
    }
    if (!v.passportNumber || !v.departureCity || !v.destinationCity || !["one-way", "return"].includes(v.tripType)) {
      return NextResponse.json({ error: "Complete the required trip details." }, { status: 400 });
    }
    if (!/^[1-9]$/.test(v.numPassengers)) {
      return NextResponse.json({ error: "Passenger count must be between 1 and 9." }, { status: 400 });
    }
  } else if (!v.waecSerial || !v.waecPin) {
    return NextResponse.json({ error: "WAEC/NECO serial and PIN are required." }, { status: 400 });
  }

  const applicationData: Omit<
    Database["public"]["Tables"]["applications"]["Insert"],
    "reference_code"
  > = {
    user_id: user.id,
    program_type: programType,
    status: "submitted" as const,
    full_name: v.fullName,
    email,
    phone: v.phone || null,
    whatsapp: v.whatsapp || v.phone || null,
    // Academic fields
    ...(isAcademic && {
      waec_serial: v.waecSerial || null,
      waec_pin: v.waecPin || null,
      visa_refusal: body.hasVisaRefusal ?? false,
    }),
    // Flight booking fields
    ...(isFlight && {
      dob: v.dob,
      passport_number: v.passportNumber,
      passport_expiry: v.passportExpiry,
      departure_city: v.departureCity,
      destination_city: v.destinationCity,
      travel_date: v.travelDate,
      return_date: v.tripType === "return" ? v.returnDate : null,
      trip_type: v.tripType,
      num_passengers: parseInt(v.numPassengers, 10),
      preferred_airline: v.preferredAirline || null,
    }),
    submitted_at: new Date().toISOString(),
  };

  // Retry on reference_code collision (very rare)
  for (let attempt = 0; attempt < 5; attempt++) {
    const referenceCode = `${prefix}-${year}-${randomSuffix()}`;

    const { data: insertData, error } = await supabase
      .from("applications")
      .insert({ ...applicationData, reference_code: referenceCode })
      .select("id, reference_code")
      .single();

    if (error) {
      // Unique constraint violation on reference_code — retry
      if (error.code === "23505") continue;
      console.error("[submit] insert failed", error);
      return NextResponse.json(
        { error: "Could not save your application. Please try again." },
        { status: 500 },
      );
    }

    if (!insertData) {
      console.error("[submit] insert returned no application without an error");
      return NextResponse.json(
        { error: "Could not save your application. Please try again." },
        { status: 500 },
      );
    }

    const applicationId = insertData.id;

    // Save referees (MRes and PhD only)
    if (
      (programType === "masters_of_research" || programType === "phd")
    ) {
      const refs = [
        { slot: 1, name: v.ref1Name, email: v.ref1Email, institution: v.ref1Institution },
        { slot: 2, name: v.ref2Name, email: v.ref2Email, institution: v.ref2Institution },
      ];

      if (refs.some((r) => !r.name || !r.email || !r.institution || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email))) {
        await supabase.from("applications").delete().eq("id", applicationId);
        return NextResponse.json({ error: "Complete both reference entries with valid email addresses." }, { status: 400 });
      }

      if (refs.length > 0) {
        const references: Database["public"]["Tables"]["application_references"]["Insert"][] =
          refs.map((r) => ({
            application_id: applicationId,
            slot: r.slot,
            full_name: r.name,
            email: r.email.toLowerCase(),
            institution: r.institution,
          }));
        const { error: refsError } = await supabase
          .from("application_references")
          .insert(references);
        if (refsError) {
          console.error("[submit] references insert failed", refsError);
          await supabase.from("applications").delete().eq("id", applicationId);
          return NextResponse.json({ error: "Could not save your references. Please try again." }, { status: 500 });
        }
      }
    }

    if (draftId) {
      const { data: draftDocuments, error: draftDocumentsError } = await supabase
        .from("application_draft_documents")
        .select("document_type, file_path, file_name, mime_type, size_bytes")
        .eq("draft_id", draftId);
      if (draftDocumentsError) {
        console.error("[submit] could not load saved draft documents", draftDocumentsError);
        await supabase.from("applications").delete().eq("id", applicationId);
        return NextResponse.json({ error: "Could not attach your saved documents. Please try again." }, { status: 500 });
      }
      if (draftDocuments?.length) {
        const documents: Database["public"]["Tables"]["application_documents"]["Insert"][] =
          draftDocuments.map((document) => ({ application_id: applicationId, ...document }));
        const { error: attachError } = await supabase.from("application_documents").insert(
          documents,
        );
        if (attachError) {
          console.error("[submit] could not attach saved draft documents", attachError);
          await supabase.from("applications").delete().eq("id", applicationId);
          return NextResponse.json({ error: "Could not attach your saved documents. Please try again." }, { status: 500 });
        }
      }

      const { error: deleteDraftError } = await supabase
        .from("application_drafts")
        .delete()
        .eq("id", draftId)
        .eq("user_id", user.id);
      if (deleteDraftError) {
        console.error("[submit] submitted application but could not remove draft", deleteDraftError);
      }
    }

    return NextResponse.json(
      { application_id: applicationId, reference_code: referenceCode },
      { status: 201 },
    );
  }

  return NextResponse.json(
    { error: "Could not allocate a reference code. Please try again." },
    { status: 500 },
  );
}
