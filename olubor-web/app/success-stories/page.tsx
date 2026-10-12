import { Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import { testimonials } from "@/data/testimonials";

export default function SuccessStoriesPage() {
  return (
    <>
      <PageHeader
        crumb="Success Stories"
        title="Loved By Students Everywhere"
        description="Real people, real admissions, real careers abroad."
      />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="card-hover bg-cream p-8 rounded-3xl border border-orange-100">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-purple rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {t.initials}
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-purple">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.detail}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-gray-600 italic">"{t.quote}"</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <CTAButton href="/contact" variant="primary">Write Your Story Next</CTAButton>
        </div>
      </section>
    </>
  );
}
