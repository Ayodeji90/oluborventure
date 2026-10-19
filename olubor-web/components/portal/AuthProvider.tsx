"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Models } from "appwrite";
import { getAccount } from "@/lib/appwrite/client";
import { isAppwriteConfigured } from "@/lib/appwrite/config";

type AppwriteUser = Models.User<Models.Preferences>;

type AuthContextValue = {
  user: AppwriteUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Reads the current Appwrite session. Resolves to null when the visitor is not
 * signed in (the SDK throws a 401) or when there is no backend configured.
 * Kept outside the component so the mount effect below can call it without the
 * hook linter treating its callers as "setState during render".
 */
async function loadCurrentUser(): Promise<AppwriteUser | null> {
  if (!isAppwriteConfigured) return null;
  try {
    return await getAccount().get();
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  // Start in the loading state only when there is a backend to talk to.
  const [loading, setLoading] = useState(isAppwriteConfigured);

  useEffect(() => {
    // Nothing to talk to; `loading` already starts false in that case.
    if (!isAppwriteConfigured) return;

    let cancelled = false;
    void loadCurrentUser().then((current) => {
      if (cancelled) return;
      setUser(current);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    const current = await loadCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await getAccount().createEmailPasswordSession({ email, password });
    setUser(await getAccount().get());
  }, []);

  const signOut = useCallback(async () => {
    try {
      await getAccount().deleteSession({ sessionId: "current" });
    } catch {
      // Already signed out server-side; clear local state regardless.
    }
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, configured: isAppwriteConfigured, signIn, signOut, refresh }),
    [user, loading, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
