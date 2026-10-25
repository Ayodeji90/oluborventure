import Link from "next/link";
import Image from "next/image";
import CTAButton from "@/components/CTAButton";
import {
  Target,
  Eye,
  ShieldCheck,
  Star,
  HeartHandshake,
  Clock,
  GraduationCap,
  Globe,
  Users,
} from "lucide-react";

const stats = [
  { number: "500+", label: "Students placed", sub: "since 2016" },
  { number: "95%", label: "Visa approval rate", sub: "across all programmes" },
  { number: "12", label: "Countries", sub: "UK, US, CA, DE, AU, UAE & more" },
  { number: "10+", label: "Years of experience", sub: "formerly Future Builders" },
];

const values = [
  {
    icon: ShieldCheck,
    name: "Integrity",
    desc: "Transparent processes, honest recommendations — even when it costs us the sale.",
  },
  {
    icon: Star,
    name: "Excellence",
    desc: "One standard of service, whether your case is simple or complex.",
  },
  {
    icon: HeartHandshake,
    name: "Empathy",
    desc: "We treat your ambition like our own, because most of us have made this journey.",
  },
  {
    icon: Clock,
    name: "Reliability",
    desc: "Deadlines kept, documents returned, questions answered within one working day.",
  },
];

const differentiators = [
  {
    icon: GraduationCap,
    title: "End-to-end support",
    desc: "From choosing a country to landing at the airport — we stay with you through every stage of the process.",
  },
  {
    icon: Globe,
    title: "Real relationships",
    desc: "Direct partnerships with universities and embassies mean faster processing and fewer surprises.",
  },
  {
    icon: Users,
    title: "A team that's been there",
    desc: "Most of our consultants have studied abroad themselves. We give advice we'd give our own families.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-purple overflow-hidden">
        <Image
          src="/images/graduate.webp"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple/90 via-purple/80 to-purple" aria-hidden />

        <div className="relative pt-44 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-kicker text-amber mb-5">About Olubor Ventures</p>
            <h1 className="font-statement text-white text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.1] font-bold mb-6 max-w-3xl">
              Placing Nigerian students on the world stage since 2016.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-8">
              Formerly Future Builders Educational Institute, we&apos;ve grown into
              Lagos&apos;s most trusted international education and careers consultancy —
              guiding students through admissions, funding, visas, and life abroad.
            </p>
            <div className="flex flex-wrap gap-3">
              <CTAButton href="/services" variant="primary">Our Services</CTAButton>
              <CTAButton href="/contact" variant="secondary">Talk to a consultant</CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ────────────────────────────────────────────── */}
      <section className="bg-sand border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-5xl font-bold text-purple leading-none mb-1">{s.number}</span>
              <span className="font-semibold text-ink text-[15px]">{s.label}</span>
              <span className="text-ink-3 text-[13px] mt-0.5">{s.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-kicker text-purple-mid mb-4">Our story</p>
            <h2 className="font-statement text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-ink leading-[1.15] mb-6">
              A decade of opening doors that seemed closed.
            </h2>
            <div className="space-y-4 text-ink-2 leading-relaxed text-[16px]">
              <p>
                Olubor Ventures began as <strong className="text-ink">Future Builders Educational Institute</strong> in
                2016, built on a simple frustration: too many talented Nigerian students were being
                rejected or misled when trying to study abroad.
              </p>
              <p>
                We built the consultancy we wished had existed — one that treats every applicant as
                an individual, not a case number. Our team handles everything from university
                selection and application strategy to visa documentation and pre-departure briefings.
              </p>
              <p>
                Today, with over 500 students placed across 12 countries and a 95% visa approval
                rate, we are trusted by families from Lagos to Abuja to make one of the most
                important decisions of their lives.
              </p>
            </div>
          </div>

          {/* Image with floating stat card */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/5] relative">
              <Image
                src="/images/student.webp"
                alt="Student preparing for international study"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple/60 via-transparent to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-5 max-w-[200px]">
              <div className="text-3xl font-bold text-purple-mid leading-none mb-1">500+</div>
              <div className="text-[13px] font-semibold text-ink leading-snug">Students placed globally</div>
              <div className="text-[12px] text-ink-3 mt-0.5">since 2016</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-plum-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-kicker text-purple-mid mb-10">What drives us</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple rounded-2xl p-8 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                <Target className="w-5 h-5 text-amber" />
              </div>
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-white/50 mb-3">Mission</h3>
              <p className="text-[20px] font-semibold leading-snug text-white">
                Make global education and careers accessible to every Nigerian through
                personalized guidance — admissions, funding, visas, and placements.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-plum-100">
              <div className="w-10 h-10 rounded-xl bg-plum-50 flex items-center justify-center mb-5">
                <Eye className="w-5 h-5 text-purple-mid" />
              </div>
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-ink-3 mb-3">Vision</h3>
              <p className="text-[20px] font-semibold leading-snug text-ink">
                Be Africa&apos;s most trusted bridge to global opportunity — for students,
                professionals, and families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <p className="text-kicker text-purple-mid mb-3">What we hold to</p>
              <h2 className="font-statement text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-ink leading-tight max-w-sm">
                Four principles we never compromise on.
              </h2>
            </div>
            <p className="text-ink-3 max-w-sm text-[15px] leading-relaxed">
              These aren&apos;t wall posters. They&apos;re the commitments we return to every time a case
              gets complicated.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="rounded-2xl border border-gray-200 bg-sand p-6 hover:border-plum-100 hover:bg-plum-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white border border-plum-100 flex items-center justify-center mb-5 shadow-sm">
                  <Icon className="w-5 h-5 text-purple-mid" />
                </div>
                <h3 className="text-[17px] font-bold text-ink mb-2">{name}</h3>
                <p className="text-[14px] text-ink-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Olubor difference ────────────────────────────────── */}
      <section className="py-24 px-4 bg-sand border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-kicker text-purple-mid mb-3">Why choose us</p>
          <h2 className="font-statement text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-ink leading-tight mb-14 max-w-lg">
            The Olubor difference.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-amber" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-ink mb-2">{title}</h3>
                  <p className="text-ink-2 leading-relaxed text-[15px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-purple">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-kicker text-amber mb-4">Ready to start?</p>
          <h2 className="font-statement text-white text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-tight mb-5">
            Your path abroad starts with one conversation.
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
            No commitment, no pressure — just an honest assessment of your options.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <CTAButton href="/apply" variant="primary">Apply now</CTAButton>
            <CTAButton href="/contact" variant="secondary">Book a free consultation</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
