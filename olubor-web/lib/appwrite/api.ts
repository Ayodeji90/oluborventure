"use client";

import { getAccount } from "./client";

/**
 * Fetch wrapper for portal API routes.
 *
 * Mints a 15-minute JWT from the current session and sends it as a bearer
 * token, which is how the route handlers learn who is calling (the Appwrite
 * web SDK holds its session in browser storage, not a server-readable cookie).
 */
export async function authedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const { jwt } = await getAccount().createJWT({ duration: 900 });

  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

/** Read the `{ error }` message from a failed route response. */
export async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

/** Turn an Appwrite SDK exception into something worth showing a user. */
export function authErrorMessage(err: unknown, fallback: string): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? (err as { code?: number }).code
      : undefined;

  switch (code) {
    case 401:
      return "That email and password did not match.";
    case 409:
      return "An account with that email already exists.";
    case 429:
      return "Too many attempts. Please wait a minute and try again.";
    default:
      return fallback;
  }
}
