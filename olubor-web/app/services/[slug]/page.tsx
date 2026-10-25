import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Banknote,
  Plane,
  Languages,
  Ticket,
} from "lucide-react";
import CTAButton from "@/components/CTAButton";
import { services, type Service } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

const iconMap: Record<Service["icon"], React.ElementType> = {
  graduation: GraduationCap,
  money: Banknote,
  plane: Plane,
  language: Languages,
  ticket: Ticket,
};

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = iconMap[service.icon] ?? GraduationCap;
  const idx = services.findIndex((s) => s.slug === slug);
  const next = services[idx + 1] ?? null;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-purple pt-40 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-[14px] font-medium transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All services
          </Link>

          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
              <Icon className="w-7 h-7 text-amber" />
            </div>
            <div>
              <p className="text-kicker text-amber mb-3">Service</p>
              <h1 className="font-statement text-white text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] mb-4 max-w-2xl">
                {service.title}
              </h1>
              <p className="text-white/65 text-lg leading-relaxed max-w-2xl">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-sand">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 items-start">

          {/* Left: context */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-ink-3 mb-5">
              About this service
            </h2>
            <p className="text-ink-2 leading-relaxed text-[16px] mb-6">
              {service.description}
            </p>
            <p className="text-[15px] text-ink-2 leading-relaxed mb-8">
              Every engagement is scoped after your free consultation, so you only pay
              for what your case actually needs — no bundles, no hidden extras.
            </p>
            <CTAButton href="/contact" variant="primary">Book free consultation</CTAButton>
          </div>

          {/* Right: what's included */}
          <div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-ink-3 mb-5">
              What&apos;s included
            </h2>
            <ul className="space-y-3 mb-8">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-purple flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[16px] font-semibold text-ink leading-snug">{b}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-plum-50 border border-plum-100 p-6">
              <p className="text-[13px] font-semibold text-purple-mid mb-1">Not sure if this is right for you?</p>
              <p className="text-[13px] text-ink-2 leading-relaxed mb-4">
                Our free consultation is a no-pressure conversation. Tell us your
                situation and we&apos;ll tell you honestly what you need.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple-mid hover:gap-2.5 transition-all"
              >
                Get in touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Next service ─────────────────────────────────────────── */}
      {next && (
        <section className="py-14 px-4 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-kicker text-ink-3 mb-1">Next service</p>
              <h3 className="text-[20px] font-bold text-ink">{next.title}</h3>
            </div>
            <Link
              href={`/services/${next.slug}`}
              className="inline-flex items-center gap-2 h-11 px-6 bg-purple-mid text-white font-semibold rounded-xl text-[14px] hover:bg-purple transition"
            >
              View service <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
