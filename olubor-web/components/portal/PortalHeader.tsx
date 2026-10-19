"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle, LogOut, UserRound } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function PortalHeader() {
  const { user, loading, configured, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const signedIn = configured && !loading && Boolean(user);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/portal/sign-in");
  };

  return (
    <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-kicker text-ink-3 mb-2">Client portal</p>
        <h1 className="text-title text-ink">
          {!configured ? "Client portal" : signedIn ? "Your applications" : "Client sign in"}
        </h1>
      </div>

      {signedIn && (
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 text-[13px] text-ink-2 max-w-[220px] truncate">
            <UserRound className="w-4 h-4 text-ink-3 shrink-0" />
            {user?.email}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-300 text-[13px] font-semibold text-ink-2 hover:border-purple hover:text-purple-mid transition"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}

      {loading && configured && (
        <span className="inline-flex items-center gap-2 text-[13px] text-ink-3">
          <LoaderCircle className="w-4 h-4 animate-spin" /> Loading…
        </span>
      )}

      {!signedIn && pathname !== "/portal/sign-in" && (
        <nav className="flex items-center gap-4 text-[13px] font-semibold">
          <Link href="/portal/sign-up" className="text-purple-mid hover:underline underline-offset-4">
            Create an account
          </Link>
        </nav>
      )}
    </header>
  );
}
