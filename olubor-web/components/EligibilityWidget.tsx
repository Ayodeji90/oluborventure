"use client";

import { useState } from "react";
import { ChevronRight, CircleCheckBig } from "lucide-react";

const serviceOptions = ["Study Abroad", "Scholarship", "Visa Assistance", "Job Placement"];
const levelOptions = ["WAEC/NECO", "ND", "HND", "BSc", "Masters", "PhD"];
const budgetOptions = ["Under ₦1M", "₦1M – ₦3M", "₦3M – ₦7M", "Above ₦7M"];
const destOptions = ["UK", "Canada", "USA", "Germany", "Australia", "UAE", "Other"];

const field =
  "w-full px-3.5 py-3 rounded-lg border border-gray-300 bg-white text-[15px] text-ink focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition appearance-none";

export default function EligibilityWidget() {
  const [service, setService] = useState("");
  const [destination, setDestination] = useState("");
  const [level, setLevel] = useState("");
  const [budget, setBudget] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 3: POST to Appwrite endpoint. For now simulate indicative match.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-8 text-left">
        <CircleCheckBig className="w-10 h-10 text-green-600 mb-4" />
        <h3 className="text-xl font-bold text-ink mb-2">Request received.</h3>
        <p className="text-ink-2 text-[15px] mb-6 leading-relaxed">
          A counselor will review your profile and reach out within one working
          day with matched programs and next steps.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-purple font-semibold text-[15px] hover:underline underline-offset-4"
        >
          Check another profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 md:p-8">
      <p className="text-kicker text-ink-3 mb-2">Free eligibility check</p>
      <h2 className="text-xl font-bold text-ink mb-6">See where you stand.</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">I need help with</label>
          <div className="grid grid-cols-2 gap-2">
            {serviceOptions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setService(s)}
                aria-pressed={service === s}
                className={`px-3 min-h-[44px] rounded-lg text-sm font-medium border transition ${
                  service === s
                    ? "bg-purple text-white border-purple"
                    : "bg-white text-ink-2 border-gray-300 hover:border-purple"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ew-dest" className="block text-sm font-semibold text-ink mb-2">Destination</label>
            <select id="ew-dest" value={destination} onChange={(e) => setDestination(e.target.value)} className={field} required>
              <option value="">Select…</option>
              {destOptions.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ew-level" className="block text-sm font-semibold text-ink mb-2">Education</label>
            <select id="ew-level" value={level} onChange={(e) => setLevel(e.target.value)} className={field} required>
              <option value="">Select…</option>
              {levelOptions.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ew-budget" className="block text-sm font-semibold text-ink mb-2">Budget</label>
            <select id="ew-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={field} required>
              <option value="">Select…</option>
              {budgetOptions.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ew-contact" className="block text-sm font-semibold text-ink mb-2">Email / WhatsApp</label>
            <input
              id="ew-contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@email.com"
              className={field}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-purple text-white font-semibold rounded-lg hover:bg-purple-mid transition flex items-center justify-center gap-1.5"
        >
          Check my eligibility <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-[13px] text-ink-3 text-center">
          Free consultation · No commitment · Reply within 1 working day
        </p>
      </form>
    </div>
  );
}
