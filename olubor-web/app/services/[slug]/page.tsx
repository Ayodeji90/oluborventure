import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import Link from "next/link";
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-12">
          <div>
            <h2 className="text-kicker text-ink-3 mb-4">What&apos;s included</h2>
            <p className="text-ink-2 leading-relaxed mb-8">
              Every engagement is scoped after your free consultation, so you pay
              only for what your case needs.
            </p>
            <CTAButton href="/contact" variant="primary">Book free consultation</CTAButton>
          </div>
          <ol className="divide-y divide-gray-200 border-t border-gray-200">
            {service.bullets.map((b, i) => (
              <li key={b} className="grid grid-cols-[auto_1fr] gap-x-6 items-baseline py-5">
                <span className="text-sm text-ink-3 font-medium">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg text-ink font-medium">{b}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/services" className="text-amber font-semibold text-[15px] hover:underline underline-offset-4">
            ← All services
          </Link>
        </div>
      </section>
    </>
  );
}
