import Link from "next/link";
import { GraduationCap, PiggyBank, ShieldCheck, Briefcase, CheckCircle2, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";

const services = [
  {
    slug: "study-abroad",
    icon: GraduationCap,
    title: "Study Abroad",
    desc: "Get admitted to top universities worldwide — from selection to enrollment.",
  },
  {
    slug: "scholarships",
    icon: PiggyBank,
    title: "Scholarships",
    desc: "Fully-funded and partial scholarships matched to your profile.",
  },
  {
    slug: "visa-assistance",
    icon: ShieldCheck,
    title: "Visa Assistance",
    desc: "Documentation, filing, and interview prep so your visa lands right.",
  },
  {
    slug: "international-jobs",
    icon: Briefcase,
    title: "International Jobs",
    desc: "Global job placements, CV optimization, and interview coaching.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumb="Services"
        title="Our Services"
        description="Comprehensive consulting to take you from where you are to where you want to be — globally."
      />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div key={s.slug} className="card-hover bg-cream rounded-3xl p-8 border border-orange-100">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6">
                <s.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple mb-3">{s.title}</h3>
              <p className="text-gray-600 mb-6">{s.desc}</p>
              <Link
                href={`/services/${s.slug}`}
                className="inline-flex items-center gap-1 text-purple font-semibold hover:gap-2 transition-all"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <CTAButton href="/contact" variant="primary">Talk to a Counselor</CTAButton>
        </div>
      </section>
    </>
  );
}
