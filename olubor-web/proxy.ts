import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Refresh Supabase cookies and enforce an admin check at the request boundary. */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminPage = path === "/admin" || path.startsWith("/admin/");
  const isAdminApi = path === "/api/admin" || path.startsWith("/api/admin/");
  const isAdminLogin = path === "/admin/login";
  const isAdminAuthApi = path === "/api/admin/auth";
  const mustAuthorizeAdmin =
    (isAdminPage && !isAdminLogin) || (isAdminApi && !isAdminAuthApi);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    if (mustAuthorizeAdmin && isAdminApi) {
      return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
    }
    if (mustAuthorizeAdmin) {
      return new NextResponse("Admin authentication is not configured.", { status: 503 });
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  let refreshedCookies: { name: string; value: string; options: CookieOptions }[] = [];
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        refreshedCookies = cookiesToSet;
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (mustAuthorizeAdmin) {
    const deny = (status: number) => {
      const denied = isAdminApi
        ? NextResponse.json({ error: status === 401 ? "Unauthorised." : "Forbidden." }, { status })
        : NextResponse.redirect(new URL("/admin/login", request.url));
      refreshedCookies.forEach(({ name, value, options }) => denied.cookies.set(name, value, options));
      return denied;
    };

    if (!user) return deny(401);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (error || profile?.is_admin !== true) return deny(403);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
    "/apply/:path*",
    "/api/admin/:path*",
    "/api/applications/:path*",
  ],
};
