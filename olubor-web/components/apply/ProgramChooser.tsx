"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Clock, LoaderCircle } from "lucide-react";
import { authedFetch, readError } from "@/lib/appwrite/api";
import { getCurrentUser } from "@/lib/appwrite/client";
import { isAppwriteConfigured } from "@/lib/appwrite/config";
import { PROGRAM_LABELS, type Application, type ProgramType } from "@/lib/appwrite/types";

type ProgramOption = {
  type: ProgramType;
  blurb: string;
  available: boolean;
  /** Shown once the programme is selected. */
  requirements?: string[];
};

/**
 * Requirement sets are per-programme; the Masters of Research set is the one
 * that is live. Adding a programme here means adding its checklist — the
 * application wizard renders from this list.
 */
const PROGRAMS: ProgramOption[] = [
  {
    type: "masters_of_research",
    blurb: "Research-led masters with a supervisor and a written proposal.",
    available: true,
    requirements: [
      "International passport — valid at least 7 months after the course starts",
      "Official degree certificates and transcripts — statements of results are not accepted",
      "WAEC or NECO certificate — minimum C6 in English, printouts are not accepted",
      "WAEC/NECO scratch card — serial number and PIN",
      "Detailed CV — no gaps longer than 6 months",
      "Two academic or professional referees",
      "Statement of Purpose — addressed to the university",
      "Research proposal",
      "Any previous visa refusal",
    ],
  },
  {
    type: "masters",
    blurb: "Taught masters programmes with coursework and a dissertation.",
    available: false,
  },
  {
    type: "bachelors",
    blurb: "Undergraduate degree entry, direct or via a foundation year.",
    available: false,
  },
  {
    type: "phd",
    blurb: "Doctoral research with a supervisory team.",
    available: false,
  },
];

export default function ProgramChooser() {
  const router = useRouter();
  const [selected, setSelected] = useState<ProgramType | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = PROGRAMS.find((p) => p.type === selected && p.available) ?? null;

  const start = async () => {
    if (!active) return;
    setBusy(true);
    setError(null);

    try {
      // Not signed in yet? Hold the choice and send them to create an account;
      // /portal/sign-up picks the programme back up after registration.
      const user = await getCurrentUser();
      if (!user) {
        router.push(`/portal/sign-up?program=${active.type}`);
        return;
      }

      const response = await authedFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({ program_type: active.type }),
      });

      if (!response.ok) {
        setError(await readError(response, "We could not start your application."));
        return;
      }

      const { application } = (await response.json()) as { application: Application };
      router.push(`/portal/applications/${application.$id}`);
    } catch {
      setError("Network problem. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-kicker text-ink-3 mb-4">Step 1 — choose programme</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {PROGRAMS.map((program) => {
          const isSelected = selected === program.type && program.available;
          return (
            <button
              key={program.type}
              type="button"
              disabled={!program.available}
              aria-pressed={isSelected}
              onClick={() => {
                setSelected(program.type);
                setError(null);
              }}
              className={`text-left rounded-xl border p-6 transition ${
                !program.available
                  ? "border-gray-200 bg-white/60 cursor-not-allowed"
                  : isSelected
                    ? "border-purple bg-plum-50 ring-2 ring-purple/20"
                    : "border-gray-200 bg-white hover:border-purple"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-lg font-bold text-ink">
                  {PROGRAM_LABELS[program.type]}
                </h2>
                {program.available ? (
                  isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-purple-mid text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full border-2 border-gray-300 shrink-0" />
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3 bg-gray-100 px-2.5 py-1 rounded-full shrink-0">
                    <Clock className="w-3 h-3" />
                    Soon
                  </span>
                )}
              </div>
              <p className="text-[15px] text-ink-2 leading-relaxed">{program.blurb}</p>
            </button>
          );
        })}
      </div>

      {active?.requirements && (
        <div className="mt-8 border border-gray-200 rounded-xl bg-white p-6 sm:p-7">
          <h3 className="font-bold text-ink mb-1">
            What {PROGRAM_LABELS[active.type]} needs
          </h3>
          <p className="text-[15px] text-ink-2 mb-5">
            Have these ready before you submit. You do not need all of them to start — you can
            save a draft and upload as documents arrive.
          </p>
          <ul className="space-y-2.5">
            {active.requirements.map((requirement) => (
              <li key={requirement} className="flex items-start gap-3 text-[15px] text-ink-2">
                <Check className="w-4 h-4 text-purple-mid shrink-0 mt-1" />
                <span className="leading-relaxed">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-6 text-[14px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
        >
          {error}
        </p>
      )}

      {/*
        The programme list above is informational and always visible. Only the
        action depends on the backend being wired up, and applicants must never
        be shown setup instructions.
      */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={start}
          disabled={!active || busy || !isAppwriteConfigured}
          className="liquid-glass inline-flex items-center gap-2 h-12 px-7 rounded-full bg-purple-mid text-white text-[13px] font-semibold uppercase tracking-wide hover:bg-purple transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null}
          {busy ? "Starting…" : "Start application"}
          {!busy && <ArrowRight className="w-4 h-4" />}
        </button>

        <p className="text-[14px] text-ink-3">
          {!isAppwriteConfigured
            ? "Online applications open shortly. In the meantime, here is what each programme asks for."
            : active
              ? "You will create an account so your progress is saved."
              : "Choose a programme to continue."}
        </p>
      </div>
    </div>
  );
}
