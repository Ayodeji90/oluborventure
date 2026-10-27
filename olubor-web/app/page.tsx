import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, FileCheck2, Plane, Presentation } from "lucide-react";
import CTAButton from "@/components/CTAButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroRotator from "@/components/HeroRotator";

import { destinations } from "@/data/destinations";
import { testimonials } from "@/data/testimonials";

const destImages: Record<string, string> = {
  "United Kingdom": "/images/flight1.webp",
  Canada: "/images/boarding.webp",
  "United States": "/images/airport.webp",
  Germany: "/images/jet.webp",
  Australia: "/images/runway.webp",
  "United Arab Emirates": "/images/flight2.webp",
};

const steps = [
  {
    n: "1",
    lines: ["STUDY", "ABROAD"],
    icon: GraduationCap,
    text: "We counsel students one-on-one on the best country, university and field of study for their profile and budget.",
  },
  {
    n: "2",
    lines: ["APPLICATION", "PROCESSES"],
    icon: FileCheck2,
    text: "Guidance every step of the way on your applications — documents, deadlines, and submission to your chosen universities.",
  },
  {
    n: "3",
    lines: ["VISA", "GUIDANCE"],
    icon: Plane,
    text: "Securing your student visa is the final gate. We handle documentation review and interview preparation until it's stamped.",
  },
  {
    n: "4",
    lines: ["EDUCATIONAL", "EXHIBITION"],
    icon: Presentation,
    text: "We connect you to fairs and exhibitions across our network of partner schools and universities worldwide.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO: rotating plane/aviation photo, dark overlay, centered copy — Prime style */}
      <section className="relative bg-ink overflow-hidden">
        <HeroRotator />
        <div className="absolute inset-0 bg-black/45" aria-hidden />

        <div className="relative flex min-h-[600px] items-center px-4 pb-16 pt-40 sm:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-kicker hero-enter text-amber/90 mb-5">
              Formerly Future Builders Educational Institute
            </p>
            <h1 className="text-display font-statement text-white mb-6 !text-[clamp(2.25rem,4.5vw,3.75rem)] hero-enter hero-enter-delay-1">
              Study abroad, without the guesswork.
            </h1>
            <p className="hero-lede hero-enter hero-enter-delay-2 text-white/80 max-w-xl mx-auto mb-8">
              Olubor places students and professionals into universities and
              careers across the UK, USA, Canada, Germany, Australia and the
              UAE — admissions, scholarships, visas, and jobs.
            </p>
            <div className="hero-enter hero-enter-delay-2 flex flex-wrap justify-center gap-3">
              <CTAButton href="/contact" variant="primary">
                Book a free consultation
              </CTAButton>
              <CTAButton href="/apply" variant="secondary" className="bg-white/10 text-white border-white/40 hover:bg-white hover:text-ink">
                Start an application
              </CTAButton>
            </div>
            <div className="hero-stats hero-enter hero-enter-delay-3 flex flex-wrap justify-center items-baseline gap-x-8 gap-y-2.5 mt-10">
              <span>
                <span className="stat-strong">500+</span>{" "}
                <span className="stat-label">students placed</span>
              </span>
              <span>
                <span className="stat-strong">95%</span>{" "}
                <span className="stat-label">visa success</span>
              </span>
              <span>
                <span className="stat-strong">10 yrs</span>{" "}
                <span className="stat-label">of experience</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered service process — Prime's 4-card row */}
      <section className="bg-sand py-20 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-11 max-w-2xl">
            <p className="text-kicker text-purple-mid mb-3">Support at every stage</p>
            <h2 className="text-title text-ink">
              From choosing a path to preparing for what comes next.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="process-card reveal-on-scroll rounded-2xl bg-white border border-gray-200 p-7 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-plum-50 text-purple-mid">
                    <s.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[13px] font-semibold tracking-wider text-ink-3">0{s.n}</span>
                </div>
                <h3 className="font-bold text-ink text-[17px] leading-snug mb-3">
                  {s.lines[0]}
                  {" "}{s.lines[1].toLowerCase()}
                </h3>
                <p className="text-ink-2 text-[14px] leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dependable claim: photo left / purple panel right with icon stats — Prime signature */}
      <section className="grid lg:grid-cols-2">
        <div
          className="min-h-[420px] bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/graduate.webp)",
          }}
          role="img"
          aria-label="A proud smiling graduate in cap and gown holding a diploma on university campus"
        />
        <div className="relative overflow-hidden bg-purple text-white px-8 md:px-14 py-16 md:py-20 flex flex-col justify-center">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" aria-hidden />
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" aria-hidden />
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-10 max-w-lg">
            We are dependable and reliable, owned and managed student
            placement agents in Nigeria.
          </h2>
          <CTAButton href="/about" variant="secondary">
            More About Olubor
          </CTAButton>
          <div className="grid grid-cols-3 gap-6 mt-14 max-w-lg">
            {[
              { icon: GraduationCap, l1: "Dedicated", l2: "consultants" },
              { icon: FileCheck2, l1: "Goal", l2: "achievement" },
              { icon: Plane, l1: "24/7", l2: "support" },
            ].map((f) => (
              <div key={f.l1} className="flex items-start gap-3">
                <f.icon className="w-8 h-8 shrink-0 text-white/90" strokeWidth={1.5} />
                <span className="text-[15px] font-semibold leading-tight">
                  {f.l1}
                  <br />
                  {f.l2}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations: real photo cards — Prime style */}
      <section className="py-20 sm:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-title text-ink mb-4 max-w-xl">
            Choose your best destination to study!
          </h2>
          <p className="text-ink-2 max-w-2xl mb-12">
            We place students into universities across the UK and Europe, USA,
            Canada, Australia, Germany, and the UAE.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <Link
                key={d.name}
                href="/destinations"
                className="group reveal-on-scroll card-hover overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={destImages[d.name] ?? "/images/student.webp"}
                    alt={d.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <GraduationCap className="w-5 h-5 text-amber shrink-0" />
                  <span className="font-bold text-ink tracking-wide uppercase text-[15px] group-hover:text-purple-mid transition">
                    {d.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories: Prime-style white testimonial cards */}
      <section className="py-24 px-4 bg-plum-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-title text-ink mb-12 text-center">
            Our successful stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="reveal-on-scroll card-hover rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center"
              >
                <span className="w-16 h-16 rounded-full bg-purple text-white flex items-center justify-center font-bold text-lg mx-auto mb-5 ring-4 ring-plum-100">
                  {t.initials}
                </span>
                <blockquote className="text-ink-2 text-[15px] leading-relaxed mb-5">
                  “{t.quote}”
                </blockquote>
                <figcaption>
                  <span className="block font-bold text-ink">{t.name}</span>
                  <span className="block text-sm text-ink-3 mt-1">
                    {t.detail}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-1.5 text-amber font-semibold hover:gap-2.5 transition-all"
            >
              All success stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto rounded-3xl bg-plum-50 border border-plum-100 p-8 sm:p-10 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-title text-ink mb-3">
              Start with a free consultation.
            </h2>
            <p className="text-ink-2 max-w-md">
              Thirty minutes with a counselor. You leave with a route, a budget,
              and a timeline.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <CTAButton href="/contact" variant="primary">
              Book free consultation
            </CTAButton>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
