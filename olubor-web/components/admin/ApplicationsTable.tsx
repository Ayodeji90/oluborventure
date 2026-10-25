"use client";
import { useState } from "react";
import Link from "next/link";
import { PROGRAM_LABELS, STATUS_LABELS, type Application, type ApplicationStatus, type ProgramType } from "@/lib/supabase/types";

const TONE_CLASS: Record<string, string> = {
  neutral:  "bg-gray-100 text-gray-600",
  progress: "bg-blue-50 text-blue-700",
  good:     "bg-emerald-50 text-emerald-700",
  warn:     "bg-amber-50 text-amber-700",
  bad:      "bg-red-50 text-red-700",
};

type PartialApp = Pick<Application, "id"|"reference_code"|"program_type"|"status"|"full_name"|"phone"|"whatsapp"|"submitted_at">;

export default function ApplicationsTable({ applications }: { applications: PartialApp[] }) {
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = applications.filter(a =>
    (!programFilter || a.program_type === programFilter) &&
    (!statusFilter || a.status === statusFilter)
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={programFilter} onChange={e => setProgramFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-[13px] text-ink bg-white focus:outline-none focus:border-purple-mid">
          <option value="">All programmes</option>
          {(Object.entries(PROGRAM_LABELS) as [ProgramType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-[13px] text-ink bg-white focus:outline-none focus:border-purple-mid">
          <option value="">All statuses</option>
          {(Object.entries(STATUS_LABELS) as [ApplicationStatus, {label:string;tone:string}][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        {(programFilter || statusFilter) && (
          <button onClick={() => { setProgramFilter(""); setStatusFilter(""); }}
            className="h-9 px-3 text-[13px] text-ink-3 hover:text-ink transition">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-gray-100 bg-sand">
                {["Reference","Programme","Applicant","Phone","WhatsApp","Status","Submitted"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-bold text-ink-3 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-ink-3 text-[14px]">No applications found.</td></tr>
              )}
              {filtered.map(a => {
                const sl = STATUS_LABELS[a.status as ApplicationStatus];
                return (
                  <tr key={a.id} className="hover:bg-plum-50/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-[13px] font-semibold text-purple-mid whitespace-nowrap">
                      <Link href={`/admin/${a.id}`} className="hover:underline underline-offset-2">{a.reference_code}</Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{PROGRAM_LABELS[a.program_type as ProgramType] ?? a.program_type}</td>
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                      <Link href={`/admin/${a.id}`} className="hover:text-purple-mid transition">{a.full_name}</Link>
                    </td>
                    <td className="px-4 py-3 text-ink-2 whitespace-nowrap">{a.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-2 whitespace-nowrap">{a.whatsapp ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${TONE_CLASS[sl?.tone ?? "neutral"]}`}>
                        {sl?.label ?? a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-3 whitespace-nowrap text-[13px]">
                      {new Date(a.submitted_at).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
