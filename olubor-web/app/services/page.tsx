import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumb="Services"
        title="What we do"
        description="Seven services, one accountable team. Every engagement starts with a free consultation."
      />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ul className="divide-y divide-gray-200 border-t border-gray-200">
            {services.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group grid md:grid-cols-[auto_1fr_2fr_auto] items-baseline gap-x-10 py-8 hover:bg-sand/50 transition"
                >
                  <span className="text-sm text-ink-3 font-medium">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="text-2xl font-bold text-ink group-hover:text-purple transition">{s.title}</h2>
                  <p className="text-ink-2 leading-relaxed">{s.description}</p>
                  <ArrowRight className="w-5 h-5 justify-self-start md:justify-self-end text-gray-300 group-hover:text-amber group-hover:translate-x-0.5 transition-all mt-2 md:mt-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
