"use client";
import Link from "next/link";
import { ArrowRight, Quote, GraduationCap, FileCheck2, Plane, Presentation } from "lucide-react";
import EligibilityWidget from "@/components/EligibilityWidget";
import CTAButton from "@/components/CTAButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroRotator from "@/components/HeroRotator";

import { destinations } from "@/data/destinations";
import { testimonials } from "@/data/testimonials";

const destImages: Record<string, string> = {
  "United Kingdom": "/images/flight1.jpg",
  Canada: "/images/boarding.jpg",
  "United States": "/images/airport.jpg",
  Germany: "/images/jet.jpg",
  Australia: "/images/runway.jpg",
  "United Arab Emirates": "/images/flight2.jpg",
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
      {/* HERO: rotating plane/aviation photo, dark overlay, centered copy — Prime style, plus the eligibility widget */}
      <section className="relative bg-ink overflow-hidden">
        <HeroRotator />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink/85" aria-hidden />

        <div className="relative pt-44 pb-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-kicker text-white/60 mb-5">
              Formerly Future Builders Educational Institute
            </p>
            <h1 className="text-display font-statement text-white mb-6 !text-[clamp(2.25rem,4.5vw,3.75rem)]">
              Study abroad, without the guesswork.
            </h1>
            <p className="hero-lede text-white/75 max-w-xl mx-auto mb-8">
              Olubor places students and professionals into universities and
              careers across the UK, USA, Canada, Germany, Australia and the
              UAE — admissions, scholarships, visas, and jobs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <CTAButton href="/services" variant="primary">
                Our Services
              </CTAButton>
              <CTAButton href="/about" variant="secondary">
                About Us
              </CTAButton>
            </div>
            <div className="hero-stats flex flex-wrap justify-center items-baseline gap-x-8 gap-y-2.5 mt-10">
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

        {/* Widget straddles the hero bottom edge */}
        <div className="relative px-4 lg:px-8">
          <div
            className="max-w-4xl mx-auto translate-y-1/3"
            id="eligibility-check"
          >
            <EligibilityWidget />
          </div>
        </div>
        <div className="h-40 md:h-32" aria-hidden />
      </section>

      {/* Numbered service process — Prime's 4-card row */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-title text-ink mb-12 max-w-xl">
            Brief on our study abroad consultation services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="bg-white border border-gray-200 p-8 pb-10 shadow-sm"
              >
                <span className="flex h-14 w-14 items-center justify-center border-2 border-amber text-amber text-2xl font-bold mb-6">
                  {s.n}
                </span>
                <h3 className="font-bold text-purple-mid tracking-wide uppercase text-[17px] leading-snug mb-4">
                  {s.lines[0]}
                  <br />
                  {s.lines[1]}
                </h3>
                <p className="text-ink-2 text-[15px] leading-relaxed">
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
            backgroundImage: "url(/images/student.jpg)",
          }}
          role="img"
          aria-label="A smiling student in graduation gown"
        />
        <div className="bg-purple text-white px-8 md:px-14 py-16 md:py-20 flex flex-col justify-center">
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
      <section className="py-24 px-4 bg-white">
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
                className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={destImages[d.name] ?? "/images/student.jpg"}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                className="bg-white border border-gray-200 shadow-sm p-8 text-center"
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
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
            <CTAButton href="/#eligibility-check" variant="secondary">
              Check eligibility
            </CTAButton>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
