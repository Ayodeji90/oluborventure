import { STATUS_LABELS, type ApplicationStatus } from "@/lib/appwrite/types";

const TONES: Record<string, string> = {
  neutral: "bg-gray-100 text-ink-2 border-gray-200",
  progress: "bg-plum-50 text-purple-mid border-plum-100",
  good: "bg-emerald/10 text-emerald-dark border-emerald/25",
  warn: "bg-amber/10 text-amber-600 border-amber/30",
  bad: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_LABELS[status] ?? STATUS_LABELS.draft;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[12px] font-semibold whitespace-nowrap ${
        TONES[meta.tone] ?? TONES.neutral
      }`}
    >
      {meta.label}
    </span>
  );
}
