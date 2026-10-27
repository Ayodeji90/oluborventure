import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getServerClient } from "@/lib/supabase/server";
import { SLUG_TO_PROGRAM, type ProgramType } from "@/lib/supabase/types";

const TEXT_FIELDS = new Set([
  "fullName", "email", "whatsapp", "phone", "waecSerial", "waecPin", "visaRefusal",
  "ref1Name", "ref1Email", "ref1Institution", "ref2Name", "ref2Email", "ref2Institution",
  "dob", "passportNumber", "passportExpiry", "departureCity", "destinationCity",
  "travelDate", "returnDate", "tripType", "numPassengers", "preferredAirline",
]);

function slugForProgram(program: ProgramType) {
  return Object.entries(SLUG_TO_PROGRAM).find(([, value]) => value === program)?.[0] ?? "";
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in to access your drafts." }, { status: 401 });

  const supabase = getServerClient();
  const requestedSlug = new URL(request.url).searchParams.get("program");

  if (requestedSlug) {
    const program = SLUG_TO_PROGRAM[requestedSlug];
    if (!program) return NextResponse.json({ error: "Invalid programme." }, { status: 400 });

    const { data: draft, error } = await supabase
      .from("application_drafts")
      .select("id, program_type, form_data, same_as_phone, updated_at")
      .eq("user_id", user.id)
      .eq("program_type", program)
      .maybeSingle();
    if (error) {
      console.error("[drafts] load failed", error);
      return NextResponse.json({ error: "Could not load your saved application." }, { status: 500 });
    }
    if (!draft) return NextResponse.json({ draft: null, documents: [] });

    const { data: documents, error: documentsError } = await supabase
      .from("application_draft_documents")
      .select("id, document_type, file_name, mime_type, size_bytes, uploaded_at")
      .eq("draft_id", draft.id)
      .order("uploaded_at");
    if (documentsError) {
      console.error("[drafts] document list failed", documentsError);
      return NextResponse.json({ error: "Could not load your saved documents." }, { status: 500 });
    }
    return NextResponse.json({ draft, documents: documents ?? [] });
  }

  const { data: drafts, error } = await supabase
    .from("application_drafts")
    .select("id, program_type, form_data, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);
  if (error) {
    console.error("[drafts] list failed", error);
    return NextResponse.json({ error: "Could not load your saved applications." }, { status: 500 });
  }

  const ids = (drafts ?? []).map((draft) => draft.id);
  const { data: documents, error: documentsError } = ids.length
    ? await supabase.from("application_draft_documents").select("draft_id").in("draft_id", ids)
    : { data: [], error: null };
  if (documentsError) {
    console.error("[drafts] document counts failed", documentsError);
    return NextResponse.json({ error: "Could not load your saved applications." }, { status: 500 });
  }
  const counts = new Map<string, number>();
  for (const document of documents ?? []) counts.set(document.draft_id, (counts.get(document.draft_id) ?? 0) + 1);

  return NextResponse.json({
    drafts: (drafts ?? []).map((draft) => ({
      ...draft,
      program_slug: slugForProgram(draft.program_type),
      document_count: counts.get(draft.id) ?? 0,
    })),
  });
}

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in to save your application." }, { status: 401 });
  if (Number(request.headers.get("content-length") ?? 0) > 64 * 1024) {
    return NextResponse.json({ error: "Draft is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid draft data." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid draft data." }, { status: 400 });
  }
  const input = body as { program?: unknown; formData?: unknown; sameAsPhone?: unknown };
  const program = typeof input.program === "string" ? SLUG_TO_PROGRAM[input.program] : undefined;
  if (!program) return NextResponse.json({ error: "Invalid programme." }, { status: 400 });
  if (!input.formData || typeof input.formData !== "object" || Array.isArray(input.formData)) {
    return NextResponse.json({ error: "Invalid application details." }, { status: 400 });
  }
  if (typeof input.sameAsPhone !== "boolean") {
    return NextResponse.json({ error: "Invalid contact preference." }, { status: 400 });
  }

  const formData: Record<string, string> = {};
  for (const [key, value] of Object.entries(input.formData)) {
    if (!TEXT_FIELDS.has(key) || typeof value !== "string" || value.length > 2000) {
      return NextResponse.json({ error: "One or more application details are invalid." }, { status: 400 });
    }
    formData[key] = value;
  }

  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("application_drafts")
    .upsert({
      user_id: user.id,
      program_type: program,
      form_data: formData,
      same_as_phone: input.sameAsPhone,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,program_type" })
    .select("id, updated_at")
    .single();
  if (error || !data) {
    console.error("[drafts] save failed", error);
    return NextResponse.json({ error: "Could not save your application. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, updated_at: data.updated_at });
}
