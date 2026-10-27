import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import ApplicationForm from "@/components/apply/ApplicationForm";
import { getSessionClient } from "@/lib/supabase/server";
import { SLUG_TO_PROGRAM } from "@/lib/supabase/types";

/* ─── Programme metadata ────────────────────────────────────────── */
const PROGRAMS: Record<string, { label: string; description: string }> = {
  "masters-of-research": {
    label: "Masters of Research",
    description:
      "Research-led masters with a dedicated supervisor and a written proposal.",
  },
  bachelors: {
    label: "Bachelors",
    description:
      "Undergraduate degree entry — direct or via a foundation year.",
  },
  phd: {
    label: "PhD",
    description:
      "Doctoral research with a supervisory team and a detailed research proposal.",
  },
  "flight-booking": {
    label: "Flight Booking",
    description:
      "Best-fare search, booking, and full support if your plans change.",
  },
};

export function generateStaticParams() {
  return Object.keys(PROGRAMS).map((program) => ({ program }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ program: string }>;
}): Promise<Metadata> {
  const { program } = await params;
  const meta = PROGRAMS[program];
  if (!meta) return {};
  return {
    title: `${meta.label} Application — Olubor Ventures`,
    description: meta.description,
  };
}

export default async function ProgramApplicationPage({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program } = await params;
  const meta = PROGRAMS[program];
  if (!meta) notFound();

  return (
    <>
      {/* ── Branded hero header ───────────────────────────────── */}
      <section className="relative bg-purple overflow-hidden pt-32 pb-16 px-4">
        {/* Subtle background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{ backgroundImage: "url(/images/boarding.webp)" }}
          aria-hidden
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple via-purple/95 to-purple-mid/80"
          aria-hidden
        />
        {/* Amber glow bottom-right */}
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-amber/10 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-white/50 text-[13px] mb-7"
            aria-label="Breadcrumb"
          >
            <Link href="/apply" className="hover:text-white/80 transition">
              Get Started
            </Link>
            <span aria-hidden>›</span>
            <span className="text-white/80">{meta.label}</span>
          </nav>

          <p className="text-kicker text-amber mb-3">Application form</p>
          <h1
            className="font-statement text-white font-bold leading-tight tracking-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            {meta.label}
          </h1>
          <p className="text-white/65 mt-3 max-w-xl leading-relaxed text-base">
            {meta.description} Fill in your details below and upload your
            documents — a counselor will follow up within one working day.
          </p>
        </div>
      </section>

      {/* ── Form on sand background ───────────────────────────── */}
      <section className="py-16 px-4 bg-sand min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
            <AuthenticatedApplication program={program} programLabel={meta.label} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function AuthenticatedApplication({
  program,
  programLabel,
}: {
  program: string;
  programLabel: string;
}) {
  const supabase = await getSessionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const programType = SLUG_TO_PROGRAM[program];
    if (!programType) notFound();
    const query = new URLSearchParams({
      program: programType,
      next: `/apply/${program}`,
    });
    redirect(`/portal/sign-up?${query.toString()}`);
  }

  return <ApplicationForm program={program} programLabel={programLabel} />;
}
