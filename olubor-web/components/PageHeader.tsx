import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  crumb: string;
};

export default function PageHeader({ title, description, crumb }: Props) {
  return (
    <section className="bg-purple text-white pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm opacity-70 mb-3">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">•</span>
          {crumb}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        {description && (
          <p className="mt-4 text-lg opacity-80 max-w-3xl mx-auto">{description}</p>
        )}
      </div>
    </section>
  );
}
