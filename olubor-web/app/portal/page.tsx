"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderOpen, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/portal/AuthProvider";
import RequireAuth from "@/components/portal/RequireAuth";
import StatusBadge from "@/components/portal/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import { PROGRAM_LABELS, type Application } from "@/lib/supabase/types";

export default function PortalPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const LOAD_ERROR =
  "We could not load your applications. If the database has just been created, give it a moment and refresh.";

async function fetchApplications(email: string): Promise<Application[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

function Dashboard() {
  const { user } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const email = user?.email;

  const load = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      setApplications(await fetchApplications(email));
    } catch (err) {
      console.error("[portal] could not load applications", err);
      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) return;

    let cancelled = false;
    void fetchApplications(email).then(
      (rows) => {
        if (cancelled) return;
        setApplications(rows);
        setError(null);
        setLoading(false);
      },
      (err) => {
        if (cancelled) return;
        console.error("[portal] could not load applications", err);
        setError(LOAD_ERROR);
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [email]);

  return (
    <div className="space-y-8">
      {/* Start a new application ------------------------------------------- */}
      <section className="border border-gray-200 rounded-xl bg-white p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-ink mb-1">Start a new application</h2>
            <p className="text-ink-2 text-[15px] leading-relaxed">
              Choose the programme you are applying for — each one asks for different documents.
            </p>
          </div>

          <Link
            href="/apply"
            className="liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-full bg-purple-mid text-white text-[13px] font-semibold uppercase tracking-wide hover:bg-purple transition"
          >
            <Plus className="w-4 h-4" />
            Choose programme
          </Link>
        </div>
      </section>

      {/* Existing applications --------------------------------------------- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">Your applications</h2>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-2 hover:text-purple-mid transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-ink-3 py-12 justify-center">
            <LoaderCircle className="w-5 h-5 animate-spin" />
            <span className="text-[15px]">Loading your applications…</span>
          </div>
        )}

        {!loading && error && (
          <p role="alert" className="text-[14px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center bg-white">
            <span className="w-11 h-11 rounded-lg bg-plum-50 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-5 h-5 text-purple-mid" />
            </span>
            <p className="font-semibold text-ink mb-1">Nothing here yet</p>
            <p className="text-ink-2 text-[15px]">
              Choose a programme above and your application will appear here.
            </p>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <ul className="space-y-3">
            {applications.map((application) => (
              <li key={application.id}>
                <Link
                  href={`/portal/applications/${application.id}`}
                  className="block border border-gray-200 rounded-xl bg-white p-5 hover:border-purple transition group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[13px] font-semibold text-purple-mid bg-plum-50 px-2.5 py-1 rounded">
                        {application.reference_code}
                      </span>
                      <StatusBadge status={application.status} />
                    </div>
                    <span className="text-[13px] text-ink-3">
                      Updated {formatDate(application.updated_at)}
                    </span>
                  </div>

                  <p className="font-semibold text-ink">
                    {PROGRAM_LABELS[application.program_type] ?? "Application"}
                  </p>

                  <div className="flex items-center justify-end mt-4">
                    <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-purple-mid transition" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
