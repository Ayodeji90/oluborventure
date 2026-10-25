import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import {
  SLUG_TO_PROGRAM,
  PROGRAM_PREFIXES,
  type ProgramType,
} from "@/lib/supabase/types";

/** Unambiguous alphabet — no O/0, I/1 to keep reference codes readable. */
const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSuffix(length = 4): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return out;
}

/**
 * POST /api/applications/submit
 *
 * No applicant auth required — uses the service_role key server-side.
 * Body: { program: string, text: Record<string,string>, hasVisaRefusal: boolean }
 * Returns: { application_id, reference_code }
 */
export async function POST(request: Request) {
  let body: {
    program?: string;
    text?: Record<string, string>;
    hasVisaRefusal?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const programType: ProgramType | undefined = SLUG_TO_PROGRAM[body.program ?? ""];
  if (!programType) {
    return NextResponse.json({ error: "Invalid programme." }, { status: 400 });
  }

  const t = body.text ?? {};
  if (!t.fullName?.trim() || !t.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const supabase = getServerClient();
  const year = new Date().getFullYear();
  const prefix = PROGRAM_PREFIXES[programType];

  // Build application row — map form field names to DB column names
  const isAcademic = programType !== "flight_booking";
  const isFlight = programType === "flight_booking";

  const applicationData = {
    program_type: programType,
    status: "submitted" as const,
    full_name: t.fullName.trim(),
    email: t.email.trim().toLowerCase(),
    phone: t.phone?.trim() || null,
    whatsapp: t.whatsapp?.trim() || null,
    // Academic fields
    ...(isAcademic && {
      waec_serial: t.waecSerial?.trim() || null,
      waec_pin: t.waecPin?.trim() || null,
      visa_refusal: body.hasVisaRefusal ?? false,
    }),
    // Flight booking fields
    ...(isFlight && {
      dob: t.dob || null,
      passport_number: t.passportNumber?.trim() || null,
      passport_expiry: t.passportExpiry || null,
      departure_city: t.departureCity?.trim() || null,
      destination_city: t.destinationCity?.trim() || null,
      travel_date: t.travelDate || null,
      return_date: t.returnDate || null,
      trip_type: t.tripType || null,
      num_passengers: t.numPassengers ? parseInt(t.numPassengers, 10) : 1,
      preferred_airline: t.preferredAirline?.trim() || null,
    }),
    submitted_at: new Date().toISOString(),
  };

  // Retry on reference_code collision (very rare)
  for (let attempt = 0; attempt < 5; attempt++) {
    const referenceCode = `${prefix}-${year}-${randomSuffix()}`;

    const { data: insertData, error } = await supabase
      .from("applications")
      .insert({ ...applicationData, reference_code: referenceCode } as never)
      .select("id, reference_code")
      .single();
    const data = insertData as unknown as { id: string; reference_code: string } | null;

    if (error) {
      // Unique constraint violation on reference_code — retry
      if (error.code === "23505") continue;
      console.error("[submit] insert failed", error);
      return NextResponse.json(
        { error: "Could not save your application. Please try again." },
        { status: 500 },
      );
    }

    const applicationId = data!.id;

    // Save referees (MRes and PhD only)
    if (
      (programType === "masters_of_research" || programType === "phd") &&
      t.ref1Name?.trim()
    ) {
      const refs = [
        { slot: 1, name: t.ref1Name, email: t.ref1Email, institution: t.ref1Institution },
        { slot: 2, name: t.ref2Name, email: t.ref2Email, institution: t.ref2Institution },
      ].filter((r) => r.name?.trim());

      if (refs.length > 0) {
        await supabase.from("application_references").insert(
          refs.map((r) => ({
            application_id: applicationId,
            slot: r.slot,
            full_name: r.name!.trim(),
            email: r.email?.trim() || null,
            institution: r.institution?.trim() || null,
          })) as never,
        );
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
