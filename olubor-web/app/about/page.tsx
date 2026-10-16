import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import { Target, Eye } from "lucide-react";

const values = [
  ["Integrity", "Transparent processes, honest recommendations — even when it costs us the sale."],
  ["Excellence", "One standard of service, whether your case is simple or complex."],
  ["Empathy", "We treat your ambition like our own, because most of us have made this journey."],
  ["Reliability", "Deadlines kept, documents returned, questions answered within one working day."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumb="About"
        title="Placing students abroad since 2016."
        description="Olubor Ventures and Educational Consult — formerly Future Builders Educational Institute — is a Lagos-based consultancy for international education and careers."
      />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="border-t-2 border-purple pt-6">
              <Target className="w-5 h-5 text-purple mb-3" aria-hidden />
              <h3 className="text-kicker text-purple mb-2">Mission</h3>
              <p className="text-lg text-ink leading-relaxed">
                Make global education and careers accessible through personalized
                guidance — admissions, funding, visas, and placements.
              </p>
            </div>
            <div className="border-t-2 border-gray-200 pt-6">
              <Eye className="w-5 h-5 text-purple mb-3" aria-hidden />
              <h3 className="text-kicker text-purple mb-2">Vision</h3>
              <p className="text-lg text-ink leading-relaxed">
                Be Africa&apos;s most trusted bridge to global opportunity.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {[
              ["500+", "students placed since 2016"],
              ["95%", "visa approval rate"],
              ["12", "countries we place into"],
            ].map(([n, l]) => (
              <div key={l} className="border-t-2 border-gray-200 pt-6">
                <div className="text-5xl font-bold text-purple mb-2">{n}</div>
                <div className="text-ink-3">{l}</div>
              </div>
            ))}
          </div>

          <h2 className="text-title text-ink mb-10 max-w-md">What we hold to</h2>
          <ul className="divide-y divide-gray-200 border-t border-gray-200 mb-20">
            {values.map(([name, desc], i) => (
              <li key={name} className="grid md:grid-cols-[auto_1fr_2fr] gap-x-10 items-baseline py-7">
                <span className="text-sm text-ink-3 font-medium">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold text-ink">{name}</h3>
                <p className="text-ink-2 leading-relaxed">{desc}</p>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 justify-between items-center flex-wrap">
            <p className="text-lg text-ink-2 max-w-md">The next step costs nothing.</p>
            <CTAButton href="/contact" variant="primary">Start your journey</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
