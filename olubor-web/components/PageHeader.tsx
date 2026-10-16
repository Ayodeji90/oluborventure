import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  crumb: string;
};

export default function PageHeader({ title, description, crumb }: Props) {
  return (
    <section className="border-b border-gray-200 bg-white pt-36 pb-14 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-kicker text-ink-3 mb-3">
          <Link href="/" className="hover:text-amber transition">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          {crumb}
        </p>
        <h1 className="text-display text-ink max-w-3xl">{title}</h1>
        {description && <p className="mt-4 text-lg text-ink-2 max-w-2xl leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
