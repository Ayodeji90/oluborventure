"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Settings2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

/**
 * Client-side gate for portal routes.
 *
 * This is a UI guard. Database row-level security and route authorization remain
 * the actual data boundary.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (configured && !loading && !user) router.replace("/portal/sign-in");
  }, [configured, loading, user, router]);

  if (!configured) return <SetupNotice />;

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-ink-3 py-24 justify-center">
        <LoaderCircle className="w-5 h-5 animate-spin" />
        <span className="text-[15px]">Checking your session…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-ink-3 py-24 justify-center">
        <LoaderCircle className="w-5 h-5 animate-spin" />
        <span className="text-[15px]">Taking you to sign in…</span>
      </div>
    );
  }

  return <>{children}</>;
}

/** Shown before Supabase has been configured, so the page is never a blank shell. */
export function SetupNotice() {
  return (
    <div className="border border-gray-200 rounded-xl p-8 sm:p-10 bg-white max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-lg bg-plum-100 flex items-center justify-center shrink-0">
          <Settings2 className="w-5 h-5 text-purple-mid" />
        </span>
        <h2 className="text-xl font-bold text-ink">The portal is not connected yet</h2>
      </div>
      <p className="text-ink-2 text-[15px] leading-relaxed mb-5">
        This screen goes live once the Supabase backend is configured. Two steps:
      </p>
      <ol className="space-y-3 text-[15px] text-ink-2 leading-relaxed mb-6">
        <li className="flex gap-3">
          <span className="font-semibold text-purple-mid shrink-0">1.</span>
          <span>
            Create a project at{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-purple-mid font-semibold hover:underline underline-offset-4"
            >
              Supabase dashboard
            </a>
            , then copy <code className="text-[13px] bg-plum-50 px-1.5 py-0.5 rounded">.env.example</code>{" "}
            to <code className="text-[13px] bg-plum-50 px-1.5 py-0.5 rounded">.env.local</code> and
              fill in the project URL and public anon key.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-semibold text-purple-mid shrink-0">2.</span>
          <span>
            Run{" "}
            <code className="text-[13px] bg-plum-50 px-1.5 py-0.5 rounded">
              supabase/migrations
            </code>{" "}
              apply the SQL migrations to create the tables and private document bucket.
          </span>
        </li>
      </ol>
      <p className="text-[13px] text-ink-3 leading-relaxed">
        Full schema reference:{" "}
        <code className="text-[13px] bg-plum-50 px-1.5 py-0.5 rounded">
          supabase/migrations/001_initial.sql
        </code>
      </p>
    </div>
  );
}
