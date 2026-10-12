"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";

const faqs = [
  {
    q: "How much does a consultation cost?",
    a: "Your first consultation is completely free. We only charge when you proceed with a full service package.",
  },
  {
    q: "How long does the study abroad process take?",
    a: "Typically 3–6 months from application to visa, depending on the destination and intake date. Starting early gives you the best options.",
  },
  {
    q: "Can I get a full scholarship?",
    a: "Full scholarships exist but are competitive. We match you with opportunities that fit your grades, profile, and budget — including partial scholarships and funding combos.",
  },
  {
    q: "Which countries can you help me study in?",
    a: "We currently place students in the UK, Canada, USA, Germany, Australia, UAE, and more. Contact us for a specific country enquiry.",
  },
  {
    q: "Do you help with work visas and jobs too?",
    a: "Yes. Our International Jobs service covers CV optimization, job matching across target countries, interview prep, and work-visa guidance.",
  },
  {
    q: "Do I need to pay before starting my application?",
    a: "Service fees are structured into milestones. You'll know the full cost upfront and pay in stages as your application progresses.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHeader crumb="FAQ" title="Frequently Asked Questions" />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-cream rounded-2xl border border-orange-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-purple"
              >
                {f.q}
                <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600">{f.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <CTAButton href="/contact" variant="primary">Ask Us Directly</CTAButton>
        </div>
      </section>
    </>
  );
}
