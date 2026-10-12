import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import { services } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageHeader crumb={service.title} title={service.title} description={service.description} />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-purple mb-6">What's included</h2>
          <ul className="space-y-4 mb-12">
            {service.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 bg-cream rounded-xl p-4 border border-orange-100">
                <CheckCircle2 className="w-5 h-5 text-orange" />
                <span className="font-medium text-gray-700">{b}</span>
              </li>
            ))}
          </ul>
          <div className="gradient-bg rounded-2xl p-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Not sure where to start?</h3>
            <p className="text-white/90 mb-6">Book a free consultation — we'll map your route in one call.</p>
            <CTAButton href="/contact" variant="secondary">Book Free Consultation</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
