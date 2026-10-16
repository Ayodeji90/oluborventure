import { Quote } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import { testimonials } from "@/data/testimonials";

export default function SuccessStoriesPage() {
  return (
    <>
      <PageHeader
        crumb="Success Stories"
        title="They went first."
        description="Every story below started with one free consultation."
      />
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {testimonials.map((t, i) => (
            <figure key={t.name} className={
              i === 0 ? "" : "border-t border-gray-200 pt-16"
            }>
              <Quote className="w-8 h-8 text-amber mb-5" aria-hidden />
              <blockquote className="text-xl md:text-2xl text-ink leading-snug font-medium mb-6 max-w-2xl">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-full bg-purple text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {t.initials}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{t.name}</span>
                  <span className="block text-sm text-ink-3">{t.detail}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="max-w-4xl mx-auto mt-16">
          <CTAButton href="/contact" variant="primary">Write your story next</CTAButton>
        </div>
      </section>
    </>
  );
}
