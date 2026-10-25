import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { ALL_STATUSES, type ApplicationStatus } from "@/lib/supabase/types";

/**
 * PATCH /api/admin/applications/[id]
 *
 * Update application status. Protected by middleware.
 * Body: { status: string }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
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

  const { error } = await supabase
    .from("applications")
    .update({ status: status as ApplicationStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[admin/applications] update failed", error);
    return NextResponse.json(
      { error: "Could not update application status." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
