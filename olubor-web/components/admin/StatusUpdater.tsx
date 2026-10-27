"use client";
import { useState } from "react";
import { ALL_STATUSES, STATUS_LABELS, type ApplicationStatus } from "@/lib/supabase/types";

export default function StatusUpdater({ applicationId, currentStatus }: { applicationId: string; currentStatus: ApplicationStatus }) {
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [savedStatus, setSavedStatus] = useState<ApplicationStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true); setSaved(false); setError(null);
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? "Status could not be updated.");
      }
      setSavedStatus(status);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)}
        className="h-10 px-3 rounded-xl border border-plum-100 text-[14px] text-ink bg-white focus:border-purple-mid focus:outline-none focus:ring-2 focus:ring-purple-mid/20 transition">
        {ALL_STATUSES.map(s => (
          <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
        ))}
      </select>
      <button onClick={handleSave} disabled={saving || status === savedStatus}
        className="h-10 px-5 bg-purple-mid text-white text-[14px] font-semibold rounded-xl hover:bg-purple transition disabled:opacity-50 disabled:cursor-not-allowed">
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save status"}
      </button>
      {error && <p role="alert" className="w-full text-[13px] text-red-700">{error}</p>}
    </div>
  );
}
