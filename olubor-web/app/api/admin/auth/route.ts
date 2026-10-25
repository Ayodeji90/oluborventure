import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/supabase/admin";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

/**
 * POST /api/admin/auth
 *
 * Admin login — signs in with email/password and sets httpOnly cookies.
 * Body: { email: string, password: string }
 */
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required." },
      { status: 400 },
    );
  }

  // Use anon key client (not service_role) to sign in
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 },
    );
  }

  // Verify the user has admin privileges
  const ok = await isAdminUser(data.user.id);
  if (!ok) {
    return NextResponse.json({ error: "Access denied." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("sb-access-token", data.session.access_token, {
    ...COOKIE_OPTS,
    maxAge: 3600,
  });

  response.cookies.set("sb-refresh-token", data.session.refresh_token, {
    ...COOKIE_OPTS,
    maxAge: 7 * 24 * 3600,
  });

  return response;
}

/**
 * DELETE /api/admin/auth
 *
 * Admin logout — clears session cookies.
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set("sb-access-token", "", {
    ...COOKIE_OPTS,
    maxAge: 0,
  });

  response.cookies.set("sb-refresh-token", "", {
    ...COOKIE_OPTS,
    maxAge: 0,
  });

  return response;
}
