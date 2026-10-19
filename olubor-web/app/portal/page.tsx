"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Query } from "appwrite";
import { ArrowRight, FolderOpen, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/portal/AuthProvider";
import RequireAuth from "@/components/portal/RequireAuth";
import StatusBadge from "@/components/portal/StatusBadge";
import { getTables } from "@/lib/appwrite/client";
import { APPWRITE_DATABASE_ID, TABLES } from "@/lib/appwrite/config";
import { PROGRAM_LABELS, type Application } from "@/lib/appwrite/types";

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

/**
 * Module scope, deliberately: the mount effect below must not call setState
 * synchronously, so it calls this and updates state from the promise callbacks.
 */
async function fetchApplications(userId: string): Promise<Application[]> {
  const result = await getTables().listRows<Application>({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.applications,
    queries: [Query.equal("user_id", userId), Query.orderDesc("$createdAt"), Query.limit(50)],
  });
  return result.rows;
}

function Dashboard() {
  const { user } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.$id;

  // Explicit reload, used by the Refresh button (an event handler, not an effect).
  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      setApplications(await fetchApplications(userId));
    } catch (err) {
      console.error("[portal] could not load applications", err);
      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    void fetchApplications(userId).then(
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
  }, [userId]);

  const drafts = applications.filter((a) => a.status === "draft");

  return (
    <div className="space-y-8">
      {/* Start a new application ------------------------------------------- */}
      <section className="border border-gray-200 rounded-xl bg-white p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-ink mb-1">Start a new application</h2>
            <p className="text-ink-2 text-[15px] leading-relaxed">
              {drafts.length > 0
                ? `You have ${drafts.length} draft application${drafts.length === 1 ? "" : "s"} in progress below.`
                : "Choose the programme you are applying for — each one asks for different documents. You can save and come back any time."}
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
              <li key={application.$id}>
                <Link
                  href={`/portal/applications/${application.$id}`}
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
                      Updated {formatDate(application.$updatedAt)}
                    </span>
                  </div>

                  <p className="font-semibold text-ink">
                    {PROGRAM_LABELS[application.program_type] ?? "Application"}
                    {application.target_university ? ` · ${application.target_university}` : ""}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-purple-mid rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, application.completion_pct ?? 0))}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-ink-3 tabular-nums">
                      {application.completion_pct ?? 0}%
                    </span>
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
