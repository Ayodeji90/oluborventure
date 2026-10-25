import { getServerClient } from "./server";
import type { Profile } from "./types";

/** Returns true if the Supabase Auth user with the given id has is_admin = true. */
export async function isAdminUser(userId: string): Promise<boolean> {
  const supabase = getServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();
  return (data as unknown as Pick<Profile, "is_admin"> | null)?.is_admin === true;
}
