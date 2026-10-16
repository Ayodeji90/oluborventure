import PageHeader from "@/components/PageHeader";

export default function TermsPage() {
  return (
    <>
      <PageHeader crumb="Terms" title="Terms & Conditions" />
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-ink-2 leading-relaxed space-y-4">
          <p>
            Welcome to Olubor Ventures and Educational Consult. By using this website and our
            services, you agree to the terms that will be published here.
          </p>
          <p className="text-ink-3">Full terms coming soon.</p>
        </div>
      </section>
    </>
  );
}
