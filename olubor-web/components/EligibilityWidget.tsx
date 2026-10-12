"use client";

import { useState } from "react";
import { Search, ChevronRight, CheckCircle2 } from "lucide-react";

const serviceOptions = ["Study Abroad", "Scholarship", "Visa Assistance", "Job Placement"];
const levelOptions = ["WAEC/NECO", "ND", "HND", "BSc", "Masters", "PhD"];
const budgetOptions = ["Under ₦1M", "₦1M – ₦3M", "₦3M – ₹7M", "Above ₦7M"];
const destOptions = ["UK", "Canada", "USA", "Germany", "Australia", "UAE", "Other"];

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
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-purple mb-2">You're on the list! 🎉</h3>
        <p className="text-gray-600 mb-2">
          Based on your profile, our counselors will reach out with matched programs and next steps within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-purple font-semibold underline underline-offset-4"
        >
          Check another profile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      <div className="inline-flex items-center gap-2 bg-cream text-purple px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
        <Search className="w-4 h-4" /> Free Eligibility Check
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-purple mb-1.5">What do you need help with?</label>
          <div className="grid grid-cols-2 gap-2">
            {serviceOptions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setService(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                  service === s
                    ? "bg-purple text-white border-purple"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-purple mb-1.5">Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple outline-none transition" required>
              <option value="">Select…</option>
              {destOptions.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple mb-1.5">Education level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple outline-none transition" required>
              <option value="">Select…</option>
              {levelOptions.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-purple mb-1.5">Budget</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple outline-none transition" required>
              <option value="">Select…</option>
              {budgetOptions.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple mb-1.5">Email / WhatsApp</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple outline-none transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full gradient-bg text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          Check My Eligibility <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-400 text-center">
          Free consultation • No commitment • We respond within 24 hours
        </p>
      </form>
    </div>
  );
}
