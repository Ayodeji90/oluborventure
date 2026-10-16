import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";
import Link from "next/link";
import { destinations } from "@/data/destinations";

export default function DestinationsPage() {
  return (
    <>
      <PageHeader
        crumb="Destinations"
        title="Where students go."
        description="Every destination below has a counselor who has completed the process themselves."
      />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ul className="divide-y divide-gray-200 border-t border-gray-200">
            {destinations.map((d) => (
              <li key={d.name} className="grid md:grid-cols-[1fr_1.4fr_1fr_auto] items-baseline gap-x-10 py-8">
                <h2 className="text-2xl font-bold text-ink">{d.name}</h2>
                <p className="text-ink-2 leading-relaxed">{d.tagline}</p>
                <span className="text-ink-3 text-sm">{d.highlights.join(" · ")}</span>
                <Link href="/contact" className="text-amber font-semibold text-[15px] hover:underline underline-offset-4 justify-self-start md:justify-self-end whitespace-nowrap">
                  Enquire
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex items-center gap-6 flex-wrap">
            <p className="text-ink-2">Country not listed? We place into 12 countries.</p>
            <CTAButton href="/contact" variant="secondary">Ask about yours</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
