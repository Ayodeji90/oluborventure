"use client";

/**
 * Browser Appwrite client. Safe to import from client components only.
 * Sessions are held by the SDK in browser storage, which is why the portal
 * guards routes on the client rather than in `proxy.ts`.
 */

import { Account, Client, Storage, TablesDB, type Models } from "appwrite";
import {
  APPWRITE_BUCKET_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  isAppwriteConfigured,
} from "./config";

let client: Client | undefined;

export function getClient(): Client {
  if (!client) {
    client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  }
  return client;
}

export const getAccount = () => new Account(getClient());

/** Database handle for the portal's database. */
export const getTables = () => new TablesDB(getClient());

/** Storage handle for the portal's bucket. */
export const getStorage = () => new Storage(getClient());

/**
 * The signed-in user, or null. For public pages (like `/apply`) that need to
 * branch on an existing session without pulling in the portal's provider.
 */
export async function getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
  if (!isAppwriteConfigured) return null;
  try {
    return await getAccount().get();
  } catch {
    return null;
  }
}

export { APPWRITE_BUCKET_ID, APPWRITE_DATABASE_ID };
