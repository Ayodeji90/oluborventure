import { NextResponse } from "next/server";
import { getSessionClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/supabase/admin";

/**
 * POST /api/admin/auth
 *
 * Admin login — signs in through the Supabase SSR client and sets its session cookies.
 * Body: { email: string, password: string }
 */
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return NextResponse.json(
      { error: "email and password are required." },
      { status: 400 },
    );
  }

  const supabase = await getSessionClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 },
    );
  }

  // Verify the user has admin privileges
  const ok = await isAdminUser(data.user.id);
  if (!ok) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Access denied." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/admin/auth
 *
 * Admin logout — clears session cookies.
 */
export async function DELETE() {
  const supabase = await getSessionClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
