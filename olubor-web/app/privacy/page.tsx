import PageHeader from "@/components/PageHeader";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader crumb="Privacy" title="Privacy Policy" />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto prose text-gray-600">
          <p>
            We respect your privacy. Details about how we collect, use, and protect your
            information will be published here.
          </p>
          <p><em>Full policy coming soon.</em></p>
        </div>
      </section>
    </>
  );
}
