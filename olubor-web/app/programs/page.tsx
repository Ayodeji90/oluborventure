import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import { CheckCircle2, Sparkles } from "lucide-react";

const programs = [
  {
    name: "UK Master's Bundle",
    price: "From ₦450,000",
    slots: "Limited slots",
    featured: true,
    features: ["University shortlist (5 schools)", "SOP & essay editing", "Application filing", "Visa interview prep", "Pre-departure support"],
  },
  {
    name: "Scholarship Max Package",
    price: "From ₦350,000",
    slots: null,
    featured: false,
    features: ["Scholarship matching", "Essay writing coaching", "Recommendation letter review", "Interview preparation", "Application submissions"],
  },
  {
    name: "Global Job Search",
    price: "From ₦280,000",
    slots: null,
    featured: false,
    features: ["CV & LinkedIn optimization", "Job matching (target countries)", "Cover letter templates", "Interview coaching", "Work visa guidance"],
  },
  {
    name: "Visa Support Only",
    price: "From ₦150,000",
    slots: null,
    featured: false,
    features: ["Document checklist", "Application review", "Mock interview session", "Submission guidance"],
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        crumb="Programs"
        title="Choose Your Program"
        description="Pick a ready-made package or talk to us for a custom route."
      />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p) => (
            <div
              key={p.name}
              className={`card-hover rounded-3xl p-7 border relative ${
                p.featured
                  ? "bg-purple text-white border-purple shadow-xl"
                  : "bg-cream text-gray-700 border-orange-100"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-bg text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> POPULAR
                </span>
              )}
              {p.slots && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.featured ? "bg-gold text-purple" : "bg-red-100 text-red-600"}`}>
                  ⚡ {p.slots}
                </span>
              )}
              <h3 className={`text-xl font-bold mt-4 mb-2 ${p.featured ? "text-white" : "text-purple"}`}>{p.name}</h3>
              <p className={`text-2xl font-extrabold mb-6 ${p.featured ? "text-gold" : "text-orange"}`}>{p.price}</p>
              <ul className="space-y-2.5 mb-8 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${p.featured ? "text-gold" : "text-orange"}`} /> {f}
                  </li>
                ))}
              </ul>
              <CTAButton
                href="/contact"
                variant={p.featured ? "gradient" : "secondary"}
                className="w-full text-sm"
              >
                Start Application
              </CTAButton>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-10">
          Prices shown are service fees only (school/application fees not included). Custom quotes available.
        </p>
      </section>
    </>
  );
}
