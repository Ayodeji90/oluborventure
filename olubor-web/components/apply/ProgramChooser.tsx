"use client";

import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Award,
  Plane,
  Check,
  ArrowRight,
  Send,
  MessageCircle,
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────────────────── */
type ProgramKey = "masters_research" | "bachelors" | "phd" | "flight_booking";

type Program = {
  key: ProgramKey;
  label: string;
  blurb: string;
  icon: React.ElementType;
  accentBg: string;
  accentText: string;
  borderActive: string;
  requirements: string[];
};

/* ─── Programme data ────────────────────────────────────────────────── */
const PROGRAMS: Program[] = [
  {
    key: "masters_research",
    label: "Masters of Research",
    blurb: "Research-led masters with a supervisor and a written proposal.",
    icon: BookOpen,
    accentBg: "bg-plum-50",
    accentText: "text-purple-mid",
    borderActive: "border-purple-mid",
    requirements: [
      "International Passport — expiry must be at least 7 months after the course start date.",
      "Official Degree Certificates and Transcripts — Statements of Results are not accepted.",
      "Official WAEC or NECO Certificate — minimum C6 in English Language. Printouts or statements are not accepted.",
      "WAEC or NECO scratch card (serial number and PIN) — compulsory for result verification on the WAEC/NECO portals.",
      "Detailed CV — include secondary school, university, and work experience. No gaps exceeding 6 months without engagement.",
      "Two academic or professional references.",
      "Statement of Purpose addressed to the university — ensure you research the course, university, city, and modules.",
      "Any previous visa refusal.",
      "Research Proposal.",
    ],
  },
  {
    key: "bachelors",
    label: "Bachelors",
    blurb: "Undergraduate degree entry, direct or via a foundation year.",
    icon: GraduationCap,
    accentBg: "bg-amber/10",
    accentText: "text-amber-600",
    borderActive: "border-amber",
    requirements: [
      "International Passport — expiry must be at least 7 months after the course start date.",
      "Official WAEC or NECO Certificate — minimum 5 credits including English Language and Mathematics.",
      "WAEC or NECO scratch card (serial number and PIN).",
      "Statement of Purpose addressed to the university.",
      "Any previous visa refusal.",
      "CV (if applicable).",
    ],
  },
  {
    key: "phd",
    label: "PhD",
    blurb: "Doctoral research with a supervisory team and a detailed research proposal.",
    icon: Award,
    accentBg: "bg-emerald/10",
    accentText: "text-emerald",
    borderActive: "border-emerald",
    requirements: [
      "International Passport — expiry must be at least 7 months after the course start date.",
      "Masters Degree Certificate and Transcripts.",
      "Undergraduate Degree Certificate and Transcripts.",
      "WAEC or NECO Certificate.",
      "Detailed CV — full academic and work history with no unexplained gaps.",
      "Detailed Research Proposal.",
      "Two academic references.",
      "Statement of Purpose addressed to the university.",
      "Published papers or prior research work (if any).",
      "Any previous visa refusal.",
    ],
  },
  {
    key: "flight_booking",
    label: "Flight Booking",
    blurb: "Best-fare search, booking, and support if your plans change.",
    icon: Plane,
    accentBg: "bg-sunset/10",
    accentText: "text-sunset",
    borderActive: "border-sunset",
    requirements: [
      "Full name exactly as it appears on your passport.",
      "Passport number and expiry date.",
      "Preferred travel date(s).",
      "Departure city and destination city.",
      "Number of passengers travelling.",
      "One-way or return trip.",
      "Preferred airline (optional).",
      "WhatsApp number for booking confirmation and real-time updates.",
    ],
  },
];

/* ─── Shared input styles ──────────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-3 min-h-[48px] rounded-xl border border-plum-100/60 bg-white text-[15px] text-ink " +
  "focus:border-purple-mid focus:ring-2 focus:ring-purple-mid/20 outline-none transition placeholder:text-ink-3";
const labelCls = "block text-sm font-semibold text-ink mb-1.5";

/* ─── Component ─────────────────────────────────────────────────────── */
export default function ProgramChooser() {
  const [selected, setSelected] = useState<ProgramKey | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const active = PROGRAMS.find((p) => p.key === selected) ?? null;

  const handleSelect = (key: ProgramKey) => {
    setSelected(key);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    const label = active?.label ?? "a programme";
    const msg = [
      `Hello Olubor Ventures!`,
      `My name is ${name}.`,
      `I am interested in applying for *${label}*.`,
      email ? `Email: ${email}` : "",
      whatsapp ? `WhatsApp: ${whatsapp}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/447404662298?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <div>
      {/* ── Step 1: Programme cards ───────────────────────────────── */}
      <div className="mb-12">
        <p className="text-kicker text-ink-3 mb-6">Step 1 — Select your programme</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {PROGRAMS.map((program) => {
            const isSelected = selected === program.key;
            const Icon = program.icon;
            return (
              <button
                key={program.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelect(program.key)}
                className={`group text-left rounded-2xl border-2 p-6 transition-all duration-300 ${
                  isSelected
                    ? `${program.borderActive} bg-white shadow-lg`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* Icon bubble */}
                  <div
                    className={`w-12 h-12 rounded-2xl ${program.accentBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon className={`w-5 h-5 ${program.accentText}`} />
                  </div>
                  {/* Selection indicator */}
                  {isSelected ? (
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-purple-mid text-white`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full border-2 border-gray-300 shrink-0 mt-0.5 group-hover:border-gray-400 transition" />
                  )}
                </div>
                <h2 className="text-[17px] font-bold text-ink mb-1.5">
                  {program.label}
                </h2>
                <p className="text-[14px] text-ink-2 leading-relaxed">
                  {program.blurb}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Step 2 + 3: Shown only after a programme is selected ─── */}
      {active && (
        <div className="space-y-6">

          {/* Requirements card */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Card header — dark purple band */}
            <div className="bg-purple px-6 py-5">
              <p className="text-kicker text-amber mb-1">Step 2 — Documents required</p>
              <h3 className="text-xl font-bold text-white leading-snug">
                What {active.label} requires
              </h3>
              <p className="text-white/65 text-[14px] mt-1.5 leading-relaxed">
                Send us these documents to begin. You don&apos;t need all of
                them upfront — submit what you have and we will guide you
                through the rest.
              </p>
            </div>

            {/* Numbered requirement rows */}
            <ul className="divide-y divide-gray-100 bg-white">
              {active.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-4 px-6 py-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-plum-50 border border-plum-100 flex items-center justify-center text-[12px] font-bold text-purple-mid mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-ink-2 leading-relaxed pt-0.5">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact form card */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Card header — sand band */}
            <div className="bg-sand px-6 py-5 border-b border-gray-100">
              <p className="text-kicker text-ink-3 mb-1">Step 3 — Your contact details</p>
              <h3 className="text-xl font-bold text-ink">
                Let&apos;s get in touch.
              </h3>
              <p className="text-ink-2 text-[14px] mt-1">
                A counselor will reach out within one working day with your
                personalised next steps.
              </p>
            </div>

            <div className="bg-white px-6 py-7">
              {submitted ? (
                /* ── Confirmation state ── */
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Check className="w-8 h-8 text-emerald" />
                  </div>
                  <h4 className="text-xl font-bold text-ink mb-2">
                    We&apos;ve received your details.
                  </h4>
                  <p className="text-ink-2 text-[15px] max-w-sm mx-auto leading-relaxed mb-7">
                    A counselor will follow up on your{" "}
                    <strong>{active.label}</strong> enquiry within one working
                    day. While you wait, feel free to message us directly.
                  </p>
                  <button
                    onClick={handleWhatsApp}
                    className="inline-flex items-center gap-2.5 px-7 h-12 bg-emerald text-white font-semibold rounded-xl hover:bg-emerald-dark transition text-[15px]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat with us on WhatsApp
                  </button>
                </div>
              ) : (
                /* ── Form state ── */
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label htmlFor="ap-name" className={labelCls}>
                      Full name
                    </label>
                    <input
                      id="ap-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className={inputCls}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ap-email" className={labelCls}>
                        Email address
                      </label>
                      <input
                        id="ap-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="ap-wa" className={labelCls}>
                        WhatsApp number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="ap-wa"
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+234 or +44 …"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Programme summary pill */}
                  <div className="flex items-center gap-2 py-3 px-4 bg-plum-50 rounded-xl border border-plum-100">
                    <Check className="w-4 h-4 text-purple-mid shrink-0" />
                    <span className="text-[14px] text-purple-mid font-semibold">
                      Applying for: {active.label}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 h-12 px-8 bg-purple text-white font-semibold rounded-xl hover:bg-purple-mid transition text-[15px]"
                  >
                    <Send className="w-4 h-4" />
                    Send my details
                  </button>
                  <p className="text-[13px] text-ink-3">
                    We will never share your details with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* WhatsApp nudge for impatient visitors */}
          <p className="text-[14px] text-ink-3 text-center pb-4">
            Prefer to message us directly?{" "}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="text-emerald font-semibold hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              Chat on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
