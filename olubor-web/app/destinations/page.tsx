import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { destinations } from "@/data/destinations";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function DestinationsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-purple pt-40 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-kicker text-amber mb-4">Study destinations</p>
          <h1 className="font-statement text-white text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] mb-5 max-w-2xl">
            Where our students go.
          </h1>
          <p className="text-white/65 text-lg max-w-xl leading-relaxed">
            Each destination below is one we have processed before — we know the visa rules, the scholarship landscape, and the universities that actually respond.
          </p>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────────────── */}
      <div className="bg-purple-mid px-4 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center sm:justify-start gap-x-10 gap-y-2">
          {[
            { n: "12+", label: "Countries we place into" },
            { n: "500+", label: "Students placed successfully" },
            { n: "95%", label: "Visa success rate" },
            { n: "3 continents", label: "Covered" },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-baseline gap-2">
              <span className="text-amber font-bold text-[17px]">{n}</span>
              <span className="text-white/60 text-[13px]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Destination cards ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-sand">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <div
                key={d.name}
                className="reveal-on-scroll card-hover bg-white rounded-2xl border border-gray-200 p-7 shadow-sm flex flex-col"
              >
                {/* Flag */}
                <div className="text-5xl mb-5 leading-none">{d.flag}</div>

                {/* Name + tagline */}
                <h2 className="text-[20px] font-bold text-ink mb-1">{d.name}</h2>
                <p className="text-[14px] text-ink-2 leading-relaxed mb-5 flex-1">
                  {d.tagline}
                </p>

                {/* Highlight pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {d.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center h-6 px-2.5 rounded-full bg-plum-50 border border-plum-100 text-[11px] font-semibold text-purple-mid"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Enquire link */}
                <Link
                  href={`/contact?destination=${encodeURIComponent(d.name)}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple-mid hover:text-purple transition group"
                >
                  Enquire about {d.name}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Not listed?" CTA ────────────────────────────────────── */}
      <section className="bg-purple py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-statement text-white text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight mb-2">
              Don&apos;t see your destination?
            </h2>
            <p className="text-white/65 text-[15px] max-w-md">
              We place into 12+ countries. If it&apos;s not listed, ask — we may still have processed it.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 h-12 px-7 bg-amber text-purple font-bold rounded-xl hover:brightness-105 transition text-[15px]"
          >
            Ask about your country <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
