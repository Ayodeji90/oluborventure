import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { ALL_STATUSES, type ApplicationStatus } from "@/lib/supabase/types";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";

/**
 * PATCH /api/admin/applications/[id]
 *
 * Update application status. Authorization is checked in this route.
 * Body: { status: string }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { status } = body;

  if (!status || !ALL_STATUSES.includes(status as (typeof ALL_STATUSES)[number])) {
    return NextResponse.json(
      { error: `status must be one of: ${ALL_STATUSES.join(", ")}.` },
      { status: 400 },
    );
  }

  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("applications")
    .update({ status: status as ApplicationStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[admin/applications] update failed", error);
    return NextResponse.json(
      { error: "Could not update application status." },
      { status: 500 },
    );
  }

  if (!data) return NextResponse.json({ error: "Application not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
