import { NextResponse } from "next/server";
import { AppwriteException, ID, Permission, Role } from "node-appwrite";
import { APPWRITE_DATABASE_ID, TABLES } from "@/lib/appwrite/config";
import { getServerTables, getServerUsers, isServerConfigured } from "@/lib/appwrite/server";

/**
 * Creates a portal account.
 *
 * Appwrite Cloud 2.5 has no client-side sign-up, so this runs server-side with
 * the API key: create the auth user, then the matching `profiles` row. The
 * browser signs in straight afterwards with `account.createEmailPasswordSession`.
 */
export async function POST(request: Request) {
  if (!isServerConfigured) {
    return NextResponse.json(
      { error: "The portal backend is not configured yet." },
      { status: 503 },
    );
  }

  let payload: { name?: unknown; email?: unknown; password?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(payload.password ?? "");

  if (name.length < 2 || name.length > 128) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Your password must be at least 8 characters." },
      { status: 400 },
    );
  }

  // 1. The auth user.
  let userId: string;
  try {
    const user = await getServerUsers().create({
      userId: ID.unique(),
      email,
      password,
      name,
    });
    userId = user.$id;
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 409) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
    console.error("[register] user creation failed", err);
    return NextResponse.json({ error: "Could not create your account." }, { status: 500 });
  }

  // 2. The profile row. Read/update go to the owner only; all other writes go
  //    through this server, which uses the API key.
  try {
    await getServerTables().createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: TABLES.profiles,
      rowId: userId,
      data: { user_id: userId, full_name: name, email },
      permissions: [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
      ],
    });
  } catch (err) {
    // Roll the auth user back so the address isn't left in a half-built state.
    console.error("[register] profile creation failed, rolling back user", err);
    try {
      await getServerUsers().delete({ userId });
    } catch {
      /* best effort */
    }
    return NextResponse.json({ error: "Could not finish setting up your account." }, { status: 500 });
  }

  return NextResponse.json({ userId }, { status: 201 });
}
