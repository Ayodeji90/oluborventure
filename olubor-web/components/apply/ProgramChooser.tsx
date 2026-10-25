"use client";

import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Award, Plane, ArrowRight } from "lucide-react";

const PROGRAMS = [
  {
    slug: "masters-of-research",
    label: "Masters of Research",
    blurb: "Research-led masters with a dedicated supervisor and a written proposal.",
    icon: BookOpen,
    accentBg: "bg-plum-50",
    accentText: "text-purple-mid",
    borderHover: "hover:border-purple-mid",
  },
  {
    slug: "bachelors",
    label: "Bachelors",
    blurb: "Undergraduate degree entry, direct or via a foundation year.",
    icon: GraduationCap,
    accentBg: "bg-amber/10",
    accentText: "text-amber-600",
    borderHover: "hover:border-amber",
  },
  {
    slug: "phd",
    label: "PhD",
    blurb: "Doctoral research with a supervisory team and a detailed research proposal.",
    icon: Award,
    accentBg: "bg-emerald/10",
    accentText: "text-emerald-600",
    borderHover: "hover:border-emerald-500",
  },
  {
    slug: "flight-booking",
    label: "Flight Booking",
    blurb: "Best-fare search, booking, and support if your plans change.",
    icon: Plane,
    accentBg: "bg-orange-50",
    accentText: "text-orange-500",
    borderHover: "hover:border-orange-400",
  },
];

export default function ProgramChooser() {
  const router = useRouter();

  return (
    <div>
      <p className="text-kicker text-ink-3 mb-8">Select a programme to begin your application</p>
      <div className="grid sm:grid-cols-2 gap-5">
        {PROGRAMS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => router.push(`/apply/${p.slug}`)}
              className={`group text-left rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg ${p.borderHover} focus:outline-none focus:ring-2 focus:ring-purple-mid/30`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${p.accentBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${p.accentText}`} />
                </div>
                <ArrowRight
                  className="w-5 h-5 text-ink-3 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
                  aria-hidden
                />
              </div>
              <h2 className="text-[18px] font-bold text-ink mb-1.5 group-hover:text-purple-mid transition-colors">
                {p.label}
              </h2>
              <p className="text-[14px] text-ink-2 leading-relaxed">{p.blurb}</p>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[14px] text-ink-3 mt-10">
        Not sure which programme fits you?{" "}
        <a
          href="https://wa.me/447404662298?text=Hello%20Olubor%20Ventures!%20I%20need%20guidance%20on%20which%20programme%20to%20choose."
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-mid font-semibold hover:underline underline-offset-4 inline-flex items-center gap-1"
        >
          Chat with a counselor <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </p>
    </div>
  );
}
