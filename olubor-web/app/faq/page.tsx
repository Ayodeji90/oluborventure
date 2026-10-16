"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
    a: "Full scholarships exist but are competitive. We match you with opportunities that fit your grades, profile, and budget — including partial scholarships and funding combinations.",
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
      <PageHeader crumb="FAQ" title="Questions, answered." />
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto border-t border-gray-200">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-gray-200">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex justify-between items-center gap-6 py-5 text-left text-lg font-semibold text-ink hover:text-purple transition min-h-[44px]"
              >
                {f.q}
                <Plus className={`w-5 h-5 shrink-0 text-ink-3 transition-transform ${open === i ? "rotate-45" : ""}`} />
              </button>
              {open === i && (
                <div className="pb-6 text-ink-2 leading-relaxed max-w-2xl">{f.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto mt-14 flex items-center gap-6 flex-wrap">
          <p className="text-ink-2">Something else on your mind?</p>
          <CTAButton href="/contact" variant="secondary">Ask us directly</CTAButton>
        </div>
      </section>
    </>
  );
}
