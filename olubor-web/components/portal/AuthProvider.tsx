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
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClient();
    let active = true;

    // Load the initial session once
    supabase.auth.getUser().then(
      ({ data }) => {
        if (!active) return;
        setUser(data.user);
        setLoading(false);
      },
      () => {
        if (!active) return;
        setUser(null);
        setLoading(false);
      },
    );

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  const refresh = useCallback(async () => {
    if (!configured) return;
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }, [configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) throw new Error("The applicant portal is not configured yet.");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, [configured]);

  const signOut = useCallback(async () => {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, configured, signIn, signOut, refresh }),
    [user, loading, configured, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
