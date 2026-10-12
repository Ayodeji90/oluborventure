import PageHeader from "@/components/PageHeader";

export default function TermsPage() {
  return (
    <>
      <PageHeader crumb="Terms" title="Terms & Conditions" />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto prose text-gray-600">
          <p>
            Welcome to Olubor Ventures and Educational Consult. By using this website and our
            services, you agree to the terms that will be published here.
          </p>
          <p><em>Full terms coming soon.</em></p>
        </div>
      </section>
    </>
  );
}
