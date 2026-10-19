/**
 * Server-only Appwrite client.
 *
 * Used by route handlers. The API key bypasses row permissions, so anything
 * that writes must validate its own input and set row permissions explicitly.
 *
 * Never import this from a client component — the key would leak into the bundle.
 */

import { Account, Client, Storage, TablesDB, Users } from "node-appwrite";

const ENDPOINT = process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "";
const PROJECT_ID =
  process.env.APPWRITE_PROJECT_ID ?? process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";
const API_KEY = process.env.APPWRITE_API_KEY ?? "";

export const isServerConfigured = Boolean(ENDPOINT && PROJECT_ID && API_KEY);

let client: Client | undefined;

export function getServerClient(): Client {
  if (!isServerConfigured) {
    throw new Error(
      "Appwrite server credentials are missing. Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID and APPWRITE_API_KEY.",
    );
  }
  if (!client) {
    client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  }
  return client;
}

export const getServerTables = () => new TablesDB(getServerClient());
export const getServerStorage = () => new Storage(getServerClient());
export const getServerUsers = () => new Users(getServerClient());

export { ENDPOINT, PROJECT_ID };

/**
 * A client scoped to a single user by a short-lived JWT.
 *
 * The browser SDK keeps its session in browser storage, so it has no cookie the
 * server can read. Instead the client mints a JWT (`account.createJWT`) and
 * sends it as a bearer token; we swap it for a user id here.
 */
export function getClientWithJwt(jwt: string): Client {
  return new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setJWT(jwt);
}

/** Resolve the caller's user id from an `Authorization: Bearer <jwt>` header. */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const header = request.headers.get("authorization") ?? "";
  const jwt = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!jwt || !ENDPOINT || !PROJECT_ID) return null;

  try {
    const account = new Account(getClientWithJwt(jwt));
    const user = await account.get();
    return user.$id;
  } catch {
    return null;
  }
}
