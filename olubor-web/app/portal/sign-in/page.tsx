"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/portal/AuthProvider";
import { SetupNotice } from "@/components/portal/RequireAuth";
import { authErrorMessage } from "@/lib/appwrite/api";
import { isAppwriteConfigured } from "@/lib/appwrite/config";

const inputCls =
  "w-full px-4 py-3 min-h-[48px] rounded-lg border border-gray-300 bg-white text-[15px] text-ink focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition";
const labelCls = "block text-sm font-semibold text-ink mb-2";

export default function SignInPage() {
  const { user, loading, configured, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Go straight to the dashboard.
  useEffect(() => {
    if (configured && !loading && user) router.replace("/portal");
  }, [configured, loading, user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace("/portal");
    } catch (err) {
      setError(authErrorMessage(err, "We could not sign you in just now. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  if (!isAppwriteConfigured) return <SetupNotice />;

  return (
    <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 items-start">
      <div className="border border-gray-200 rounded-xl bg-white p-7 sm:p-9 max-w-lg w-full">
        <h2 className="text-xl font-bold text-ink mb-1">Sign in</h2>
        <p className="text-ink-2 text-[15px] mb-7">
          Pick up your application where you left it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="p-email" className={labelCls}>
              Email
            </label>
            <input
              id="p-email"
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="p-password" className={labelCls}>
              Password
            </label>
            <input
              id="p-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-[14px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full min-h-[52px] px-8 bg-purple text-white font-semibold rounded-lg hover:bg-purple-mid transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null}
            {busy ? "Signing in…" : "Sign in"}
            {!busy && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-[15px] text-ink-2 mt-6">
          New here?{" "}
          <Link href="/portal/sign-up" className="text-purple-mid font-semibold hover:underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>

      <aside className="border-t-2 border-purple pt-6 max-w-md">
        <h3 className="text-lg font-bold text-ink mb-3">Why an account?</h3>
        <ul className="space-y-3 text-[15px] text-ink-2 leading-relaxed">
          <li>Save a partly finished application and come back to it.</li>
          <li>Upload documents across several sittings — no need to have everything ready at once.</li>
          <li>Track exactly where your case sits, from draft through to enrolment.</li>
        </ul>
      </aside>
    </div>
  );
}
