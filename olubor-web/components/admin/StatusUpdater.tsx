"use client";
import { useState } from "react";
import { ALL_STATUSES, STATUS_LABELS, type ApplicationStatus } from "@/lib/supabase/types";

export default function StatusUpdater({ applicationId, currentStatus }: { applicationId: string; currentStatus: ApplicationStatus }) {
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    await fetch(`/api/admin/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)}
        className="h-10 px-3 rounded-xl border border-plum-100 text-[14px] text-ink bg-white focus:border-purple-mid focus:outline-none focus:ring-2 focus:ring-purple-mid/20 transition">
        {ALL_STATUSES.map(s => (
          <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
        ))}
      </select>
      <button onClick={handleSave} disabled={saving || status === currentStatus}
        className="h-10 px-5 bg-purple-mid text-white text-[14px] font-semibold rounded-xl hover:bg-purple transition disabled:opacity-50 disabled:cursor-not-allowed">
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save status"}
      </button>
    </div>
  );
}
