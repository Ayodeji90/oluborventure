"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  Check,
  MessageCircle,
  ArrowLeft,
  Send,
} from "lucide-react";
import Link from "next/link";

/* ─── Upload constraints ──────────────────────────────────────── */
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/* ─── Shared input styles ─────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-3 min-h-[48px] rounded-xl border border-plum-100 bg-white text-[15px] text-ink " +
  "focus:border-purple-mid focus:ring-2 focus:ring-purple-mid/20 outline-none transition placeholder:text-ink-3";
const labelCls = "block text-sm font-semibold text-ink mb-1.5";

/* ─── Section wrapper ─────────────────────────────────────────── */
function FormSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="px-6 py-5 bg-sand border-b border-gray-100 flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-purple-mid text-white text-[12px] font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <legend className="text-[17px] font-bold text-ink">{title}</legend>
      </div>
      <div className="px-6 py-6 space-y-5">{children}</div>
    </fieldset>
  );
}

/* ─── Text / email / tel / date / number field ────────────────── */
function Field({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  helpText,
  min,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  helpText?: string;
  min?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}{" "}
        {required && (
          <span className="text-red-500" aria-hidden>
            *
          </span>
        )}
      </label>
      {helpText && (
        <p className="text-[13px] text-ink-3 mb-2 leading-relaxed">{helpText}</p>
      )}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  );
}

/* ─── Radio group ─────────────────────────────────────────────── */
function RadioGroup({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
}: {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <p className={labelCls}>
        {label}{" "}
        {required && (
          <span className="text-red-500" aria-hidden>
            *
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all text-[15px] font-medium select-none ${
              value === o.value
                ? "border-purple-mid bg-plum-50 text-purple-mid"
                : "border-gray-200 bg-white text-ink-2 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={id}
              value={o.value}
              checked={value === o.value}
              required={required && !value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {value === o.value && <Check className="w-4 h-4 shrink-0" />}
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ─── File upload field ───────────────────────────────────────── */
function FileField({
  id,
  label,
  helpText,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  required = false,
  files,
  onChange,
}: {
  id: string;
  label: string;
  helpText?: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const hasFiles = files.length > 0;
  const acceptLabel = accept
    .split(",")
    .map((s) => s.replace(".", "").toUpperCase())
    .join(", ");

  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}{" "}
        {required && (
          <span className="text-red-500" aria-hidden>
            *
          </span>
        )}
      </label>
      {helpText && (
        <p className="text-[13px] text-ink-3 mb-2 leading-relaxed">{helpText}</p>
      )}

      <button
        type="button"
        onClick={() => ref.current?.click()}
        aria-label={`Upload ${label}`}
        className={`w-full rounded-xl border-2 border-dashed p-5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-purple-mid/30 ${
          hasFiles
            ? "border-emerald-400 bg-emerald-50"
            : "border-plum-100 bg-plum-50/40 hover:border-purple-mid/50 hover:bg-plum-50"
        }`}
      >
        <input
          ref={ref}
          type="file"
          id={id}
          accept={accept}
          multiple={multiple}
          required={required && !hasFiles}
          className="sr-only"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files ?? []);
            const tooBig = newFiles.find((f) => f.size > MAX_FILE_BYTES);
            const badType = newFiles.find((f) => f.type && !ALLOWED_MIME.has(f.type));
            if (tooBig) {
              setFileError(`"${tooBig.name}" exceeds the 10 MB limit.`);
              e.target.value = "";
              return;
            }
            if (badType) {
              setFileError(`"${badType.name}" is not an accepted file type. Use PDF, JPG, PNG, or Word.`);
              e.target.value = "";
              return;
            }
            setFileError(null);
            onChange(multiple ? [...files, ...newFiles] : newFiles);
            e.target.value = "";
          }}
        />

        {!hasFiles ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-plum-100 flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4 text-ink-3" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-ink-2">
                Click to upload
              </p>
              <p className="text-[12px] text-ink-3">
                {acceptLabel}
                {multiple ? " · Multiple files allowed" : ""}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[13px] text-ink-2 flex-1 truncate">
                  {f.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(files.filter((_, idx) => idx !== i));
                  }}
                  aria-label={`Remove ${f.name}`}
                  className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {multiple && (
              <p className="text-[12px] text-ink-3 pt-1">Click to add more files</p>
            )}
          </div>
        )}
      </button>
      {fileError && (
        <p className="mt-1.5 text-[13px] text-red-600">{fileError}</p>
      )}
    </div>
  );
}

/* ─── Reference sub-form (2 referees) ────────────────────────── */
function ReferencePair({
  values,
  onChange,
}: {
  values: {
    ref1Name: string;
    ref1Email: string;
    ref1Institution: string;
    ref2Name: string;
    ref2Email: string;
    ref2Institution: string;
  };
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      {[1, 2].map((n) => (
        <div
          key={n}
          className="rounded-xl border border-plum-100 bg-plum-50/30 p-5 space-y-4"
        >
          <p className="text-[13px] font-bold text-purple-mid uppercase tracking-widest">
            Reference {n}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              id={`ref${n}Name`}
              label="Full name"
              required
              value={values[`ref${n}Name` as keyof typeof values]}
              onChange={(v) => onChange(`ref${n}Name`, v)}
              placeholder="Dr. / Prof. Full Name"
            />
            <Field
              id={`ref${n}Email`}
              label="Email address"
              type="email"
              required
              value={values[`ref${n}Email` as keyof typeof values]}
              onChange={(v) => onChange(`ref${n}Email`, v)}
              placeholder="referee@university.edu"
            />
          </div>
          <Field
            id={`ref${n}Institution`}
            label="Institution / Organisation"
            required
            value={values[`ref${n}Institution` as keyof typeof values]}
            onChange={(v) => onChange(`ref${n}Institution`, v)}
            placeholder="University of Lagos"
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Visa refusal section ────────────────────────────────────── */
function VisaSection({
  had,
  onHadChange,
  refusalFiles,
  onRefusalChange,
}: {
  had: string;
  onHadChange: (v: string) => void;
  refusalFiles: File[];
  onRefusalChange: (f: File[]) => void;
}) {
  return (
    <div className="space-y-4">
      <RadioGroup
        id="visaRefusal"
        label="Have you ever been refused a visa to any country?"
        options={[
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ]}
        value={had}
        onChange={onHadChange}
        required
      />
      {had === "yes" && (
        <FileField
          id="visaRefusalLetter"
          label="Visa Refusal Letter"
          helpText="Upload the refusal letter(s). Include all refusals if there are more than one."
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          files={refusalFiles}
          onChange={onRefusalChange}
        />
      )}
    </div>
  );
}

/* ─── Main ApplicationForm ────────────────────────────────────── */
type TextData = Record<string, string>;
type FileData = Record<string, File[]>;

interface Props {
  program: string;
  programLabel: string;
}

export default function ApplicationForm({ program, programLabel }: Props) {
  const [text, setText] = useState<TextData>({
    fullName: "",
    email: "",
    whatsapp: "",
    phone: "",
    waecSerial: "",
    waecPin: "",
    visaRefusal: "",
    ref1Name: "",
    ref1Email: "",
    ref1Institution: "",
    ref2Name: "",
    ref2Email: "",
    ref2Institution: "",
    // Flight-specific
    dob: "",
    passportNumber: "",
    passportExpiry: "",
    departureCity: "",
    destinationCity: "",
    travelDate: "",
    returnDate: "",
    tripType: "",
    numPassengers: "1",
    preferredAirline: "",
  });

  const [files, setFiles] = useState<FileData>({
    passport: [],
    degreeCerts: [],
    transcripts: [],
    waecCert: [],
    cv: [],
    sop: [],
    researchProposal: [],
    visaRefusalLetter: [],
    publishedPapers: [],
    mastersCert: [],
    mastersTranscripts: [],
    undergradCert: [],
    undergradTranscripts: [],
  });

  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState("");

  const set = (k: string, v: string) =>
    setText((prev) => ({ ...prev, [k]: v }));
  const setF = (k: string, v: File[]) =>
    setFiles((prev) => ({ ...prev, [k]: v }));

  const handlePhoneChange = (v: string) => {
    setText((prev) => ({
      ...prev,
      phone: v,
      ...(sameAsPhone ? { whatsapp: v } : {}),
    }));
  };

  const handleSameAsPhone = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) set("whatsapp", text.phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Submit text data
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program,
          text,
          hasVisaRefusal: text.visaRefusal === "yes",
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Submission failed. Please try again.");
      }
      const { application_id, reference_code } = await res.json();

      // 2. Upload files in parallel
      const uploads = Object.entries(files).flatMap(([docType, fileList]) =>
        fileList.map((file) => uploadDoc(application_id, docType, file)),
      );
      await Promise.all(uploads);

      setReferenceCode(reference_code);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function uploadDoc(applicationId: string, docType: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("document_type", docType);
    // Fire and forget individual upload failures — don't block the confirmation screen
    await fetch(`/api/applications/${applicationId}/documents`, {
      method: "POST",
      body: fd,
    }).catch(console.error);
  }

  const buildWhatsAppMsg = () => {
    const fileList = Object.entries(files)
      .filter(([, f]) => f.length > 0)
      .map(([key, f]) => {
        const names: Record<string, string> = {
          passport: "International Passport",
          degreeCerts: "Degree Certificate(s)",
          transcripts: "Transcripts",
          waecCert: "WAEC/NECO Certificate",
          cv: "CV/Resume",
          sop: "Statement of Purpose",
          researchProposal: "Research Proposal",
          visaRefusalLetter: "Visa Refusal Letter",
          publishedPapers: "Published Papers",
          mastersCert: "Masters Degree Certificate",
          mastersTranscripts: "Masters Transcripts",
          undergradCert: "Undergraduate Degree Certificate",
          undergradTranscripts: "Undergraduate Transcripts",
        };
        return `✓ ${names[key] ?? key} (${f.length} file${f.length > 1 ? "s" : ""} ready)`;
      });

    const lines = [
      `Hello Olubor Ventures!`,
      referenceCode ? `Reference: *${referenceCode}*` : "",
      `I am submitting my application for *${programLabel}*.`,
      ``,
      `*Contact Details*`,
      `Name: ${text.fullName}`,
      `Email: ${text.email}`,
      `WhatsApp: ${text.whatsapp}`,
      text.phone ? `Phone: ${text.phone}` : "",
    ];

    if (program !== "flight-booking") {
      if (text.waecSerial) lines.push(`WAEC Serial: ${text.waecSerial}`);
      if (text.waecPin) lines.push(`WAEC PIN: ${text.waecPin}`);
      if (text.ref1Name) {
        lines.push(``, `*References*`);
        lines.push(
          `Ref 1: ${text.ref1Name} — ${text.ref1Email} (${text.ref1Institution})`
        );
        if (text.ref2Name)
          lines.push(
            `Ref 2: ${text.ref2Name} — ${text.ref2Email} (${text.ref2Institution})`
          );
      }
      if (text.visaRefusal)
        lines.push(`Visa refusal: ${text.visaRefusal === "yes" ? "Yes" : "No"}`);
    } else {
      lines.push(
        ``,
        `*Trip Details*`,
        `Passport No: ${text.passportNumber}`,
        `Passport Expiry: ${text.passportExpiry}`,
        `Date of Birth: ${text.dob}`,
        `From: ${text.departureCity}`,
        `To: ${text.destinationCity}`,
        `Travel Date: ${text.travelDate}`,
        `Trip Type: ${text.tripType === "return" ? "Return" : "One-way"}`,
        text.returnDate ? `Return Date: ${text.returnDate}` : "",
        `Passengers: ${text.numPassengers}`,
        text.preferredAirline ? `Preferred Airline: ${text.preferredAirline}` : ""
      );
    }

    if (fileList.length > 0) {
      lines.push(``, `*Documents ready*`);
      lines.push(...fileList);
      lines.push(``, `I will send the document files on this chat shortly.`);
    }

    return lines.filter((l) => l !== "").join("\n");
  };

  /* ── Confirmation screen ─────────────────────────────────────── */
  if (submitted) {
    const uploadedFiles = Object.values(files).flat();
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-ink mb-3">
          Application received!
        </h2>
        {referenceCode && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-plum-50 border border-plum-100 rounded-xl mb-6">
            <span className="text-[13px] text-ink-3 font-medium">Your reference:</span>
            <span className="text-[16px] font-bold text-purple-mid tracking-widest">{referenceCode}</span>
          </div>
        )}
        <p className="text-ink-2 max-w-md mx-auto leading-relaxed mb-8">
          A counselor from Olubor Ventures will review your{" "}
          <strong>{programLabel}</strong> application and follow up within one
          working day. Click below to send your details directly on WhatsApp.
        </p>

        <a
          href={`https://wa.me/447404662298?text=${encodeURIComponent(buildWhatsAppMsg())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-8 h-14 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-[16px]"
        >
          <MessageCircle className="w-5 h-5" />
          Send via WhatsApp
        </a>

        {uploadedFiles.length > 0 && (
          <div className="mt-8 max-w-sm mx-auto text-left bg-amber/10 border border-amber/30 rounded-xl p-5">
            <p className="text-[14px] font-semibold text-amber-700 mb-2">
              Don&apos;t forget your documents
            </p>
            <p className="text-[13px] text-ink-2 leading-relaxed">
              After sending the WhatsApp message above, please attach your{" "}
              <strong>{uploadedFiles.length}</strong> document
              {uploadedFiles.length > 1 ? "s" : ""} to the same chat so our
              team can process them.
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/apply"
            className="inline-flex items-center gap-1.5 text-ink-3 hover:text-ink text-[14px] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to programmes
          </Link>
        </div>
      </div>
    );
  }

  /* ── Steps counter helper ────────────────────────────────────── */
  let step = 0;
  const s = () => ++step;

  /* ── Form ───────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── FLIGHT BOOKING FORM ──────────────────────────────── */}
      {program === "flight-booking" && (
        <>
          <FormSection step={s()} title="Traveller Details">
            <Field
              id="fullName"
              label="Full name (exactly as on passport)"
              required
              value={text.fullName}
              onChange={(v) => set("fullName", v)}
              placeholder="Firstname Middlename Lastname"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id="dob"
                label="Date of birth"
                type="date"
                required
                value={text.dob}
                onChange={(v) => set("dob", v)}
              />
              <Field
                id="passportNumber"
                label="Passport number"
                required
                value={text.passportNumber}
                onChange={(v) => set("passportNumber", v)}
                placeholder="A12345678"
              />
            </div>
            <Field
              id="passportExpiry"
              label="Passport expiry date"
              type="date"
              required
              value={text.passportExpiry}
              onChange={(v) => set("passportExpiry", v)}
              helpText="Must be valid for at least 6 months beyond your travel date."
            />
          </FormSection>

          <FormSection step={s()} title="Trip Details">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id="departureCity"
                label="Departure city"
                required
                value={text.departureCity}
                onChange={(v) => set("departureCity", v)}
                placeholder="Lagos"
              />
              <Field
                id="destinationCity"
                label="Destination city"
                required
                value={text.destinationCity}
                onChange={(v) => set("destinationCity", v)}
                placeholder="London"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id="travelDate"
                label="Preferred travel date"
                type="date"
                required
                value={text.travelDate}
                onChange={(v) => set("travelDate", v)}
              />
              <Field
                id="numPassengers"
                label="Number of passengers"
                type="number"
                required
                min="1"
                value={text.numPassengers}
                onChange={(v) => set("numPassengers", v)}
              />
            </div>
            <RadioGroup
              id="tripType"
              label="Trip type"
              options={[
                { value: "one-way", label: "One-way" },
                { value: "return", label: "Return" },
              ]}
              value={text.tripType}
              onChange={(v) => set("tripType", v)}
              required
            />
            {text.tripType === "return" && (
              <Field
                id="returnDate"
                label="Return date"
                type="date"
                required
                value={text.returnDate}
                onChange={(v) => set("returnDate", v)}
              />
            )}
            <Field
              id="preferredAirline"
              label="Preferred airline (optional)"
              value={text.preferredAirline}
              onChange={(v) => set("preferredAirline", v)}
              placeholder="e.g. British Airways, Emirates…"
            />
          </FormSection>

          <FormSection step={s()} title="Your Contact Details">
            <Field
              id="phone"
              label="Phone number"
              type="tel"
              required
              value={text.phone}
              onChange={handlePhoneChange}
              placeholder="+234 or +44 …"
            />
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => handleSameAsPhone(e.target.checked)}
                className="w-5 h-5 rounded border-plum-100 accent-purple-mid cursor-pointer"
              />
              <span className="text-[14px] text-ink-2 font-medium">
                My WhatsApp number is the same as my phone number
              </span>
            </label>
            {!sameAsPhone && (
              <Field
                id="whatsapp"
                label="WhatsApp number"
                type="tel"
                required
                value={text.whatsapp}
                onChange={(v) => set("whatsapp", v)}
                placeholder="+234 or +44 …"
                helpText="Booking confirmation and updates will be sent here."
              />
            )}
            <Field
              id="email"
              label="Email address"
              type="email"
              required
              value={text.email}
              onChange={(v) => set("email", v)}
              placeholder="your@email.com"
            />
          </FormSection>
        </>
      )}

      {/* ── ACADEMIC PROGRAMMES (Masters / Bachelors / PhD) ────── */}
      {program !== "flight-booking" && (
        <>
          {/* Personal details */}
          <FormSection step={s()} title="Your Personal Details">
            <Field
              id="fullName"
              label="Full name"
              required
              value={text.fullName}
              onChange={(v) => set("fullName", v)}
              placeholder="Your full name"
            />
            <Field
              id="phone"
              label="Phone number"
              type="tel"
              required
              value={text.phone}
              onChange={handlePhoneChange}
              placeholder="+234 or +44 …"
            />
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => handleSameAsPhone(e.target.checked)}
                className="w-5 h-5 rounded border-plum-100 accent-purple-mid cursor-pointer"
              />
              <span className="text-[14px] text-ink-2 font-medium">
                My WhatsApp number is the same as my phone number
              </span>
            </label>
            {!sameAsPhone && (
              <Field
                id="whatsapp"
                label="WhatsApp number"
                type="tel"
                required
                value={text.whatsapp}
                onChange={(v) => set("whatsapp", v)}
                placeholder="+234 or +44 …"
              />
            )}
            <Field
              id="email"
              label="Email address"
              type="email"
              required
              value={text.email}
              onChange={(v) => set("email", v)}
              placeholder="your@email.com"
            />
          </FormSection>

          {/* Passport */}
          <FormSection step={s()} title="International Passport">
            <FileField
              id="passport"
              label="Upload your passport (photo page)"
              helpText="Expiry must be at least 7 months after the course start date. Accepted: PDF, JPG, PNG."
              accept=".pdf,.jpg,.jpeg,.png"
              required
              files={files.passport}
              onChange={(f) => setF("passport", f)}
            />
          </FormSection>

          {/* Academic qualifications */}
          <FormSection step={s()} title="Academic Qualifications">
            {/* Masters needs undergrad + masters certs; PhD needs both; Bachelors only WAEC */}
            {program === "phd" && (
              <>
                <FileField
                  id="mastersCert"
                  label="Masters Degree Certificate(s)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  required
                  files={files.mastersCert}
                  onChange={(f) => setF("mastersCert", f)}
                />
                <FileField
                  id="mastersTranscripts"
                  label="Masters Official Transcripts"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  required
                  files={files.mastersTranscripts}
                  onChange={(f) => setF("mastersTranscripts", f)}
                />
                <FileField
                  id="undergradCert"
                  label="Undergraduate Degree Certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  required
                  files={files.undergradCert}
                  onChange={(f) => setF("undergradCert", f)}
                />
                <FileField
                  id="undergradTranscripts"
                  label="Undergraduate Official Transcripts"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  required
                  files={files.undergradTranscripts}
                  onChange={(f) => setF("undergradTranscripts", f)}
                />
              </>
            )}

            {program === "masters-of-research" && (
              <>
                <FileField
                  id="degreeCerts"
                  label="Degree Certificate(s)"
                  helpText="Official certificates only. Statements of Results are not accepted."
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  required
                  files={files.degreeCerts}
                  onChange={(f) => setF("degreeCerts", f)}
                />
                <FileField
                  id="transcripts"
                  label="Official Transcripts"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  required
                  files={files.transcripts}
                  onChange={(f) => setF("transcripts", f)}
                />
              </>
            )}

            <FileField
              id="waecCert"
              label={
                program === "bachelors"
                  ? "WAEC or NECO Certificate (minimum 5 credits including English and Maths)"
                  : "WAEC or NECO Certificate"
              }
              helpText="Official certificate only — minimum C6 in English Language. Printouts or statements are not accepted."
              accept=".pdf,.jpg,.jpeg,.png"
              required
              files={files.waecCert}
              onChange={(f) => setF("waecCert", f)}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                id="waecSerial"
                label="WAEC/NECO Scratch Card Serial Number"
                required
                value={text.waecSerial}
                onChange={(v) => set("waecSerial", v)}
                placeholder="e.g. 1234567890"
                helpText="Needed for result verification on the WAEC/NECO portal."
              />
              <Field
                id="waecPin"
                label="WAEC/NECO Scratch Card PIN"
                required
                value={text.waecPin}
                onChange={(v) => set("waecPin", v)}
                placeholder="e.g. 0987654321"
              />
            </div>
          </FormSection>

          {/* Supporting documents */}
          <FormSection step={s()} title="Supporting Documents">
            <FileField
              id="cv"
              label={
                program === "bachelors"
                  ? "Curriculum Vitae (CV) — optional"
                  : "Curriculum Vitae (CV)"
              }
              helpText={
                program !== "bachelors"
                  ? "Include secondary school, university, and work experience. No unexplained gaps exceeding 6 months."
                  : undefined
              }
              accept=".pdf,.doc,.docx"
              required={program !== "bachelors"}
              files={files.cv}
              onChange={(f) => setF("cv", f)}
            />
            <FileField
              id="sop"
              label="Statement of Purpose"
              helpText="Addressed to the university. Research the course, modules, city, and university specifically."
              accept=".pdf,.doc,.docx"
              required
              files={files.sop}
              onChange={(f) => setF("sop", f)}
            />
            {(program === "masters-of-research" || program === "phd") && (
              <FileField
                id="researchProposal"
                label="Research Proposal"
                accept=".pdf,.doc,.docx"
                required
                files={files.researchProposal}
                onChange={(f) => setF("researchProposal", f)}
              />
            )}
            {program === "phd" && (
              <FileField
                id="publishedPapers"
                label="Published Papers or Prior Research Work (optional)"
                accept=".pdf"
                multiple
                files={files.publishedPapers}
                onChange={(f) => setF("publishedPapers", f)}
              />
            )}
          </FormSection>

          {/* References (MRes and PhD only) */}
          {(program === "masters-of-research" || program === "phd") && (
            <FormSection step={s()} title="Academic References">
              <p className="text-[14px] text-ink-2 -mt-1">
                Provide the details of two academic or professional referees. We
                will contact them directly for a reference letter.
              </p>
              <ReferencePair
                values={{
                  ref1Name: text.ref1Name,
                  ref1Email: text.ref1Email,
                  ref1Institution: text.ref1Institution,
                  ref2Name: text.ref2Name,
                  ref2Email: text.ref2Email,
                  ref2Institution: text.ref2Institution,
                }}
                onChange={set}
              />
            </FormSection>
          )}

          {/* Visa history */}
          <FormSection step={s()} title="Visa History">
            <VisaSection
              had={text.visaRefusal}
              onHadChange={(v) => set("visaRefusal", v)}
              refusalFiles={files.visaRefusalLetter}
              onRefusalChange={(f) => setF("visaRefusalLetter", f)}
            />
          </FormSection>
        </>
      )}

      {/* ── Submit ────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-[14px] text-red-700 leading-relaxed">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2.5 h-14 px-8 bg-purple-mid text-white font-semibold rounded-xl hover:bg-purple transition text-[16px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Submitting…
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Application
            </>
          )}
        </button>
        <Link
          href="/apply"
          className="inline-flex items-center justify-center gap-2 h-14 px-6 border-2 border-gray-200 text-ink-2 font-semibold rounded-xl hover:border-gray-300 hover:text-ink transition text-[15px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programmes
        </Link>
      </div>

      <p className="text-[13px] text-ink-3">
        Fields marked <span className="text-red-500">*</span> are required. Your
        details are kept private and never shared with third parties.
      </p>
    </form>
  );
}
