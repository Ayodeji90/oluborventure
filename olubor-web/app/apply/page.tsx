import type { Metadata } from "next";
import ProgramChooser from "@/components/apply/ProgramChooser";

export const metadata: Metadata = {
  title: "Get started — Olubor Ventures",
  description:
    "Choose your programme and see exactly what documents you need to start your application with Olubor Ventures.",
};

export default function ApplyPage() {
  return (
    <>
      {/* ── Branded hero header ─────────────────────────────────────── */}
      <section className="relative bg-purple overflow-hidden pt-32 pb-20 px-4">
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
        {/* Decorative amber glow bottom-right */}
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-amber/10 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-kicker text-amber mb-4 tracking-widest">
            Begin your journey
          </p>
          <h1 className="font-statement text-white mb-5 !text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-tight tracking-tight">
            Choose your programme.
          </h1>
          <p className="text-white/65 max-w-xl mx-auto leading-relaxed text-base">
            Select the programme you are applying for and we will show you
            exactly what to prepare — then connect you with a counselor within
            one working day.
          </p>
        </div>
      </section>

      {/* ── Programme chooser on sand background ───────────────────── */}
      <section className="py-16 px-4 bg-sand min-h-[60vh]">
        <div className="max-w-5xl mx-auto">
          <ProgramChooser />
        </div>
      </section>
    </>
  );
}
