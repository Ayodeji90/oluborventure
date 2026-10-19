"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Construction, LoaderCircle } from "lucide-react";
import RequireAuth from "@/components/portal/RequireAuth";
import StatusBadge from "@/components/portal/StatusBadge";
import { getTables } from "@/lib/appwrite/client";
import { APPWRITE_DATABASE_ID, TABLES } from "@/lib/appwrite/config";
import { PROGRAM_LABELS, type Application } from "@/lib/appwrite/types";

/** The wizard lands here next; for now it confirms the draft was created. */
const STEPS = [
  "Your details",
  "Programme & target",
  "Passport",
  "Degree certificates & transcripts",
  "WAEC / NECO & scratch card",
  "Detailed CV",
  "Two references",
  "Statement of Purpose",
  "Previous visa refusals",
  "Research proposal",
  "Review & submit",
];

const LOAD_ERROR = "We could not open this application. It may belong to another account.";

/**
 * Module scope, deliberately: the effect below must not call setState
 * synchronously, so it calls this and updates state from the promise callbacks.
 */
async function fetchApplication(rowId: string): Promise<Application> {
  return getTables().getRow<Application>({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.applications,
    rowId,
  });
}

export default function ApplicationPage() {
  return (
    <RequireAuth>
      <ApplicationDetail />
    </RequireAuth>
  );
}

function ApplicationDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    void fetchApplication(id).then(
      (row) => {
        if (cancelled) return;
        setApplication(row);
        setError(null);
        setLoading(false);
      },
      (err) => {
        if (cancelled) return;
        console.error("[portal] could not load application", err);
        setError(LOAD_ERROR);
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-ink-3 py-16 justify-center">
        <LoaderCircle className="w-5 h-5 animate-spin" />
        <span className="text-[15px]">Opening your application…</span>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="border border-gray-200 rounded-xl bg-white p-8 max-w-lg">
        <p role="alert" className="text-[15px] text-red-700 mb-5">
          {error ?? "Application not found."}
        </p>
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 text-purple-mid font-semibold text-[15px] hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to your applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/portal"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-3 hover:text-purple-mid transition"
      >
        <ArrowLeft className="w-4 h-4" /> All applications
      </Link>

      <section className="border border-gray-200 rounded-xl bg-white p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[13px] font-semibold text-purple-mid bg-plum-50 px-2.5 py-1 rounded">
              {application.reference_code}
            </span>
            <StatusBadge status={application.status} />
          </div>
          <span className="text-[13px] text-ink-3">
            {PROGRAM_LABELS[application.program_type] ?? "Application"}
          </span>
        </div>

        <h2 className="text-title text-ink mb-2">
          {application.target_university || "Your application"}
        </h2>
        <p className="text-ink-2 text-[15px] leading-relaxed">
          {application.target_course
            ? `${application.target_course}${application.target_intake ? ` · ${application.target_intake}` : ""}`
            : "Add your target university and course in the first step."}
        </p>
      </section>

      <section className="border border-plum-100 bg-plum-50 rounded-xl p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
            <Construction className="w-5 h-5 text-purple-mid" />
          </span>
          <div>
            <h3 className="font-bold text-ink mb-1">The application form is the next step</h3>
            <p className="text-ink-2 text-[15px] leading-relaxed">
              Your draft exists and is saved. The fill-in form below is being built as the next
              piece of work.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-ink mb-4">
          What the application will cover
        </h3>
        <ol className="space-y-2">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-3 border border-gray-200 rounded-lg bg-white px-4 py-3"
            >
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 bg-gray-100 text-ink-3">
                {index + 1}
              </span>
              <span className="text-[15px] text-ink-2">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
