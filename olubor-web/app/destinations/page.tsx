import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { destinations } from "@/data/destinations";

export default function DestinationsPage() {
  return (
    <>
      <PageHeader
        crumb="Destinations"
        title="Destinations to Explore"
        description="Browse popular destinations students love, with routes that fit your budget and goals."
      />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((d) => (
            <div key={d.name} className="card-hover bg-cream rounded-3xl p-8 border border-orange-100">
              <span className="text-5xl">{d.flag}</span>
              <h3 className="text-2xl font-bold text-purple mt-4 mb-2">{d.name}</h3>
              <p className="text-gray-600 mb-5">{d.tagline}</p>
              <ul className="space-y-2 mb-6">
                {d.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-orange" /> {h}
                  </li>
                ))}
              </ul>
              <CTAButton href="/contact" variant="primary" className="w-full text-sm">Enquire About {d.name} <ArrowRight className="w-4 h-4 ml-1" /></CTAButton>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
