"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/portal/AuthProvider";
import { SetupNotice } from "@/components/portal/RequireAuth";
import { authErrorMessage, authedFetch, readError } from "@/lib/appwrite/api";
import { isAppwriteConfigured } from "@/lib/appwrite/config";
import {
  PROGRAM_LABELS,
  PROGRAM_PREFIXES,
  type Application,
  type ProgramType,
} from "@/lib/appwrite/types";

const inputCls =
  "w-full px-4 py-3 min-h-[48px] rounded-lg border border-gray-300 bg-white text-[15px] text-ink focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition";
const labelCls = "block text-sm font-semibold text-ink mb-2";

export default function SignUpPage() {
  const { user, loading, configured, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set by /apply when someone picks a programme before creating an account.
  const requested = searchParams.get("program");
  const requestedProgram: ProgramType | null =
    requested && Object.prototype.hasOwnProperty.call(PROGRAM_PREFIXES, requested)
      ? (requested as ProgramType)
      : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (configured && !loading && user) router.replace("/portal");
  }, [configured, loading, user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Those passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    const normalisedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: normalisedEmail, password }),
      });

      if (!response.ok) {
        setError(await readError(response, "We could not create your account."));
        return;
      }

      // Account created — sign in so they land ready to work.
      try {
        await signIn(normalisedEmail, password);
      } catch (err) {
        setError(
          authErrorMessage(
            err,
            "Your account was created but signing you in failed. Please sign in manually.",
          ),
        );
        return;
      }

      // Arrived from /apply with a programme? Open that application straight
      // away rather than dropping them on an empty dashboard.
      if (requestedProgram) {
        try {
          const created = await authedFetch("/api/applications", {
            method: "POST",
            body: JSON.stringify({ program_type: requestedProgram }),
          });

          if (created.ok) {
            const { application } = (await created.json()) as { application: Application };
            router.replace(`/portal/applications/${application.$id}`);
            return;
          }
        } catch {
          // Fall through to the dashboard; they can start again from there.
        }
      }

      router.replace("/portal");
    } catch {
      setError("Network problem. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!isAppwriteConfigured) return <SetupNotice />;

  return (
    <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 items-start">
      <div className="border border-gray-200 rounded-xl bg-white p-7 sm:p-9 max-w-lg w-full">
        <h2 className="text-xl font-bold text-ink mb-1">Create your account</h2>
        <p className="text-ink-2 text-[15px] mb-7">
          Takes a minute. Then you can start, save and track your application.
        </p>

        {requestedProgram && (
          <p className="mb-6 text-[14px] text-purple-mid bg-plum-50 border border-plum-100 rounded-lg px-4 py-3">
            Applying for{" "}
            <strong className="font-semibold">{PROGRAM_LABELS[requestedProgram]}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="s-name" className={labelCls}>
              Full name
            </label>
            <input
              id="s-name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="s-email" className={labelCls}>
              Email
            </label>
            <input
              id="s-email"
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="s-password" className={labelCls}>
                Password
              </label>
              <input
                id="s-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="s-confirm" className={labelCls}>
                Confirm password
              </label>
              <input
                id="s-confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputCls}
              />
            </div>
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
            {busy ? "Creating your account…" : "Create account"}
            {!busy && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-[15px] text-ink-2 mt-6">
          Already have an account?{" "}
          <Link href="/portal/sign-in" className="text-purple-mid font-semibold hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>

      <aside className="border-t-2 border-purple pt-6 max-w-md">
        <h3 className="text-lg font-bold text-ink mb-3">What you can apply for</h3>
        <p className="text-ink-2 text-[15px] leading-relaxed mb-4">
          <strong className="text-ink">Masters of Research</strong> applications are open now.
          Bachelors, taught Masters and PhD applications follow shortly.
        </p>
        <p className="text-ink-2 text-[15px] leading-relaxed">
          You do not need every document to hand before you start — you can save a draft and
          upload as documents arrive.
        </p>
      </aside>
    </div>
  );
}
