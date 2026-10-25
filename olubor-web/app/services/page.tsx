import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Banknote,
  Plane,
  Briefcase,
  MapPin,
  Languages,
  Ticket,
} from "lucide-react";
import CTAButton from "@/components/CTAButton";
import { services, type Service } from "@/data/services";

const iconMap: Record<Service["icon"], React.ElementType> = {
  graduation: GraduationCap,
  money: Banknote,
  plane: Plane,
  language: Languages,
  ticket: Ticket,
};

const steps = [
  { n: "01", title: "Free consultation", desc: "Tell us your goals and timeline — no cost, no commitment." },
  { n: "02", title: "Custom plan", desc: "We map out exactly what your case needs and walk you through the process." },
  { n: "03", title: "We handle the work", desc: "Documents, deadlines, applications — we manage every step with you." },
  { n: "04", title: "You arrive", desc: "Pre-departure briefing, contact in-country, and ongoing support after landing." },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-purple pt-40 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-kicker text-amber mb-4">What we do</p>
          <h1 className="font-statement text-white text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] mb-5 max-w-3xl">
            Seven services, one accountable team.
          </h1>
          <p className="text-white/65 text-lg max-w-2xl leading-relaxed">
            From choosing a university to landing at the airport — every engagement
            starts with a free consultation and ends with you exactly where you wanted to be.
          </p>
        </div>
      </section>

      {/* ── Services grid ────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-sand">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] ?? GraduationCap;
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 p-7 flex flex-col hover:border-plum-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-plum-50 border border-plum-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-mid" />
                  </div>
                  <span className="text-[12px] font-semibold text-ink-3 tabular-nums mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="text-[19px] font-bold text-ink group-hover:text-purple-mid transition mb-2">
                  {s.title}
                </h2>
                <p className="text-[14px] text-ink-2 leading-relaxed flex-1 mb-5">
                  {s.description}
                </p>

                <ul className="space-y-1.5 mb-6">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[13px] text-ink-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1.5 text-[14px] font-semibold text-purple-mid group-hover:gap-2.5 transition-all mt-auto">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <p className="text-kicker text-purple-mid mb-3">The process</p>
              <h2 className="font-statement text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-ink leading-tight">
                How we work with you.
              </h2>
            </div>
            <p className="text-ink-3 text-[15px] max-w-xs leading-relaxed">
              No hidden steps, no surprise fees. This is exactly what happens from your first call to your first day abroad.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%_-_16px)] w-8 h-px bg-plum-100" aria-hidden />
                )}
                <div className="w-12 h-12 rounded-2xl bg-purple flex items-center justify-center mb-5">
                  <span className="text-[13px] font-bold text-amber">{step.n}</span>
                </div>
                <h3 className="text-[17px] font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-[14px] text-ink-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-purple">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-kicker text-amber mb-2">Ready to get started?</p>
            <h2 className="font-statement text-white text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold leading-tight max-w-md">
              Your free consultation takes 30 minutes and costs nothing.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <CTAButton href="/contact" variant="primary">Book a consultation</CTAButton>
            <CTAButton href="/apply" variant="secondary">Apply now</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
