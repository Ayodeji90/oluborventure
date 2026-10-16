import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import { Check, ArrowRight } from "lucide-react";

const featured = {
  name: "UK Master's Bundle",
  price: "From ₦450,000",
  note: "Service fees only. School and application fees not included.",
  features: [
    "University shortlist — five schools matched to your profile",
    "SOP and essay editing",
    "Application filing and tracking",
    "Visa interview preparation",
    "Pre-departure support",
  ],
};

const others = [
  { name: "Scholarship Max", price: "From ₦350,000", desc: "Scholarship matching, essay coaching, recommendation-letter review, interview prep." },
  { name: "Global Job Search", price: "From ₦280,000", desc: "CV and LinkedIn optimization, job matching, cover letters, work-visa guidance." },
  { name: "Visa Support", price: "From ₦150,000", desc: "Document checklist, application review, one mock interview, submission guidance." },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        crumb="Programs"
        title="Pick a starting point."
        description="Fixed-fee packages scoped after your free consultation. Custom quotes available."
      />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Featured */}
          <div className="grid lg:grid-cols-2 gap-12 border-2 border-purple rounded-xl p-8 md:p-12 mb-4">
            <div>
              <p className="text-kicker text-purple mb-3">Most requested</p>
              <h2 className="text-3xl font-bold text-ink mb-2">{featured.name}</h2>
              <p className="text-3xl font-bold text-purple mb-8">{featured.price}</p>
              <CTAButton href="/contact" variant="primary" className="w-full sm:w-auto">
                Start application <ArrowRight className="w-4 h-4 inline ml-1" />
              </CTAButton>
            </div>
            <ul className="divide-y divide-gray-200 border-t border-gray-200 self-start">
              {featured.features.map((f) => (
                <li key={f} className="flex items-start gap-3 py-4">
                  <Check className="w-4 h-4 text-purple mt-1 shrink-0" />
                  <span className="text-ink-2 text-[15px]">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-ink-3 mb-16">{featured.note}</p>

          {/* Others as rows */}
          <ul className="divide-y divide-gray-200 border-t border-gray-200">
            {others.map((p) => (
              <li key={p.name} className="grid md:grid-cols-[1fr_auto_1.6fr_auto] items-baseline gap-x-10 py-8">
                <h3 className="text-xl font-bold text-ink">{p.name}</h3>
                <span className="text-lg font-bold text-purple whitespace-nowrap">{p.price}</span>
                <p className="text-ink-2 text-[15px] leading-relaxed">{p.desc}</p>
                <Link href="/contact" className="text-amber font-semibold text-[15px] hover:underline underline-offset-4 justify-self-start md:justify-self-end whitespace-nowrap">
                  Enquire
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
