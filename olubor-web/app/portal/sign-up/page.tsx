"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/portal/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { PROGRAM_LABELS, type ProgramType } from "@/lib/supabase/types";

const inputCls =
  "w-full px-4 py-3 min-h-[48px] rounded-lg border border-gray-300 bg-white text-[15px] text-ink focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition";
const labelCls = "block text-sm font-semibold text-ink mb-2";

const PROGRAM_KEYS = Object.keys(PROGRAM_LABELS) as ProgramType[];

function authErrorMessage(error: { code?: string; message: string }) {
  if (error.code === "over_email_send_rate_limit" || /email rate limit exceeded/i.test(error.message)) {
    return "We could not send a confirmation email right now. Please wait a little and try again.";
  }
  return error.message;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set by /apply when someone picks a programme before creating an account.
  const program = searchParams.get("program");
  const requestedProgram = program && PROGRAM_KEYS.includes(program as ProgramType)
    ? (program as ProgramType)
    : null;
  const requestedNext = searchParams.get("next");
  const nextPath = requestedNext?.startsWith("/apply/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/portal";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    if (!loading && user && nextPath && !verificationComplete) router.replace(nextPath);
  }, [loading, user, nextPath, router, verificationComplete]);

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
      if (!configured) {
        setError("The applicant portal is not configured yet. Please contact Olubor for help.");
        return;
      }
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalisedEmail,
        password,
        options: {
          data: { full_name: name.trim() },
        },
      });

      if (signUpError) {
        setError(authErrorMessage(signUpError));
        return;
      }

      if (data.session) {
        router.replace(nextPath);
        return;
      }

      setEmail(normalisedEmail);
      setPassword("");
      setConfirm("");
      setVerificationPending(true);
      setNotice(`We sent a verification code to ${normalisedEmail}.`);
    } catch {
      setError("Network problem. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: verificationCode.trim(),
        type: "signup",
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }
      if (!data.session) {
        setError("Your email was confirmed, but we could not start your session. Please sign in.");
        return;
      }

      setVerificationComplete(true);
    } catch {
      setError("We could not verify that code. Check it and try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleResendCode = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
      });

      if (resendError) {
        setError(authErrorMessage(resendError));
        return;
      }
      setNotice(`A new verification code was sent to ${email}.`);
    } catch {
      setError("We could not resend the code. Please try again shortly.");
    } finally {
      setBusy(false);
    }
  };

  if (verificationPending) {
    return (
      <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 items-start">
        <div className="border border-gray-200 rounded-xl bg-white p-7 sm:p-9 max-w-lg w-full">
          <h2 className="text-xl font-bold text-ink mb-2">
            {verificationComplete ? "Email confirmed" : "Check your email"}
          </h2>
          <p className="text-ink-2 text-[15px] mb-6">
            {verificationComplete ? "Your account is ready. Continue to your application." : <>Enter the verification code we sent to <strong className="text-ink">{email}</strong> to finish creating your account.</>}
          </p>

          {requestedProgram && (
            <p className="mb-6 text-[14px] text-purple-mid bg-plum-50 border border-plum-100 rounded-lg px-4 py-3">
              Applying for <strong className="font-semibold">{PROGRAM_LABELS[requestedProgram]}</strong>
            </p>
          )}

          {verificationComplete ? (
            <div role="status" className="space-y-4">
              <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Your email has been confirmed successfully.
              </p>
              <button
                type="button"
                onClick={() => router.replace(nextPath)}
                className="w-full min-h-[52px] rounded-lg bg-purple px-8 font-semibold text-white transition hover:bg-purple-mid"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              {notice && <p role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</p>}
              <form onSubmit={handleVerifyCode} className="space-y-5">
            <div>
              <label htmlFor="s-verification-code" className={labelCls}>Email verification code</label>
              <input
                id="s-verification-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6,8}"
                minLength={6}
                maxLength={8}
                required
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))}
                placeholder="Enter the code from your email"
                className={`${inputCls} text-center tracking-[0.3em]`}
                aria-describedby="s-code-help"
              />
              <p id="s-code-help" className="mt-2 text-sm text-ink-3">The code is in the confirmation email from Olubor.</p>
            </div>

            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[52px] px-8 bg-purple text-white font-semibold rounded-lg hover:bg-purple-mid transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null}
              {busy ? "Verifying…" : "Verify email and continue"}
            </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
                <button type="button" onClick={handleResendCode} disabled={busy} className="font-semibold text-purple-mid hover:underline disabled:opacity-60">
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={() => { setVerificationPending(false); setVerificationCode(""); setError(null); setNotice(null); }}
                  disabled={busy}
                  className="text-ink-2 hover:underline disabled:opacity-60"
                >
                  Change email
                </button>
              </div>
            </>
          )}

          <p className="text-[15px] text-ink-2 mt-6">
            Already confirmed?{" "}
            <Link href={nextPath ? `/portal/sign-in?next=${encodeURIComponent(nextPath)}` : "/portal/sign-in"} className="text-purple-mid font-semibold hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>

        <aside className="border-t-2 border-purple pt-6 max-w-md">
          <h3 className="text-lg font-bold text-ink mb-3">{verificationComplete ? "You’re ready to begin" : "One quick step"}</h3>
          <p className="text-ink-2 text-[15px] leading-relaxed">
            Confirming your email makes sure we can reach you about your application and account.
          </p>
        </aside>
      </div>
    );
  }

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
          <Link href={nextPath ? `/portal/sign-in?next=${encodeURIComponent(nextPath)}` : "/portal/sign-in"} className="text-purple-mid font-semibold hover:underline underline-offset-4">
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
