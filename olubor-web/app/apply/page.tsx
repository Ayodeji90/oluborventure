import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProgramChooser from "@/components/apply/ProgramChooser";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Choose the programme you are applying for. Requirements differ from programme to programme.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        crumb="Get started"
        title="Choose your programme."
        description="Requirements differ from programme to programme — pick yours and we will show you exactly what to prepare before you start."
      />
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <ProgramChooser />
        </div>
      </section>
    </>
  );
}
