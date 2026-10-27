import { redirect } from "next/navigation";
import { getSessionClient } from "./server";
import { isAdminUser } from "./admin";

/** Resolve the current user from a verified Supabase session cookie. */
export async function getAuthenticatedUser() {
  const supabase = await getSessionClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

/** Verify both the Supabase session and the server-controlled admin flag. */
export async function getAuthenticatedAdmin() {
  const user = await getAuthenticatedUser();
  if (!user || !(await isAdminUser(user.id))) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getAuthenticatedAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
