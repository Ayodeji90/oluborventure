import PageHeader from "@/components/PageHeader";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader crumb="Privacy" title="Privacy Policy" />
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-ink-2 leading-relaxed space-y-4">
          <p>
            We respect your privacy. Details about how we collect, use, and protect your
            information will be published here.
          </p>
          <p className="text-ink-3">Full policy coming soon.</p>
        </div>
      </section>
    </>
  );
}
