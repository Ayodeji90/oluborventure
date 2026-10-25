import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { PROGRAM_LABELS, STATUS_LABELS, ALL_STATUSES, type Application, type ApplicationDocument, type ApplicationReference, type ApplicationStatus, type ProgramType } from "@/lib/supabase/types";
import StatusUpdater from "@/components/admin/StatusUpdater";
import { ArrowLeft, Download } from "lucide-react";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getServerClient();

  const [appResult, docsResult, refsResult] = await Promise.all([
    supabase.from("applications").select("*").eq("id", id).single(),
    supabase.from("application_documents").select("*").eq("application_id", id).order("uploaded_at"),
    supabase.from("application_references").select("*").eq("application_id", id).order("slot"),
  ]);

  const app = appResult.data as unknown as Application | null;
  const docs = docsResult.data as unknown as ApplicationDocument[] | null;
  const refs = refsResult.data as unknown as ApplicationReference[] | null;

  if (!app) notFound();

  const isFlight = app.program_type === "flight_booking";
  const statusInfo = STATUS_LABELS[app.status as ApplicationStatus];
  const toneClass: Record<string, string> = {
    neutral:"bg-gray-100 text-gray-600", progress:"bg-blue-50 text-blue-700",
    good:"bg-emerald-50 text-emerald-700", warn:"bg-amber-50 text-amber-700", bad:"bg-red-50 text-red-700",
  };

  // Generate signed download URLs for each document
  const docsWithUrls = await Promise.all(
    (docs ?? []).map(async (doc: ApplicationDocument) => {
      const { data } = await supabase.storage
        .from("application-documents")
        .createSignedUrl(doc.file_path, 3600);
      return { ...doc, signedUrl: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      {/* Back link */}
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-ink-3 hover:text-ink text-[14px] mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> All applications
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 mb-8">
        <div>
          <p className="text-kicker text-ink-3 mb-1">Application</p>
          <h1 className="text-2xl font-bold text-ink font-mono tracking-wider">{app.reference_code}</h1>
          <p className="text-ink-3 text-[13px] mt-1">
            Submitted {new Date(app.submitted_at).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="px-3 py-1.5 bg-plum-50 text-purple-mid text-[13px] font-semibold rounded-full border border-plum-100">
            {PROGRAM_LABELS[app.program_type as ProgramType] ?? app.program_type}
          </span>
          <span className={`px-3 py-1.5 text-[13px] font-semibold rounded-full ${toneClass[statusInfo?.tone ?? "neutral"]}`}>
            {statusInfo?.label ?? app.status}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contact */}
        <Section title="Applicant Details">
          <Grid>
            <Field label="Full name" value={app.full_name} />
            <Field label="Email" value={app.email} />
            <Field label="Phone" value={app.phone} />
            <Field label="WhatsApp" value={app.whatsapp} />
          </Grid>
        </Section>

        {/* Academic details */}
        {!isFlight && (
          <Section title="Academic Details">
            <Grid>
              <Field label="WAEC/NECO Serial" value={app.waec_serial} />
              <Field label="WAEC/NECO PIN" value={app.waec_pin} />
              <Field label="Visa refusal history" value={app.visa_refusal ? "Yes" : "No"} />
            </Grid>
          </Section>
        )}

        {/* Flight details */}
        {isFlight && (
          <Section title="Trip Details">
            <Grid>
              <Field label="Date of birth" value={app.dob} />
              <Field label="Passport number" value={app.passport_number} />
              <Field label="Passport expiry" value={app.passport_expiry} />
              <Field label="Departure" value={app.departure_city} />
              <Field label="Destination" value={app.destination_city} />
              <Field label="Travel date" value={app.travel_date} />
              <Field label="Return date" value={app.return_date} />
              <Field label="Trip type" value={app.trip_type} />
              <Field label="Passengers" value={app.num_passengers?.toString()} />
              <Field label="Preferred airline" value={app.preferred_airline} />
            </Grid>
          </Section>
        )}

        {/* Documents */}
        {docsWithUrls.length > 0 && (
          <Section title="Documents">
            <ul className="divide-y divide-gray-100">
              {docsWithUrls.map(doc => (
                <li key={doc.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{doc.document_type.replace(/_/g, " ")}</p>
                    <p className="text-[12px] text-ink-3">{doc.file_name ?? doc.file_path.split("/").pop()}</p>
                  </div>
                  {doc.signedUrl && (
                    <a href={doc.signedUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-plum-50 border border-plum-100 text-purple-mid text-[13px] font-semibold hover:bg-plum-100 transition whitespace-nowrap">
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* References */}
        {refs && refs.length > 0 && (
          <Section title="Academic References">
            {refs.map((ref: ApplicationReference) => (
              <div key={ref.id} className="rounded-xl border border-plum-100 bg-plum-50/40 p-5 mb-3">
                <p className="text-[12px] font-bold text-purple-mid uppercase tracking-widest mb-3">Reference {ref.slot}</p>
                <Grid>
                  <Field label="Name" value={ref.full_name} />
                  <Field label="Email" value={ref.email} />
                  <Field label="Institution" value={ref.institution} />
                </Grid>
              </div>
            ))}
          </Section>
        )}

        {/* Status update */}
        <Section title="Update Status">
          <StatusUpdater applicationId={id} currentStatus={app.status as ApplicationStatus} />
        </Section>
      </div>
    </div>
  );
}

// Small helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-sand border-b border-gray-100">
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-ink-3 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-[14px] text-ink">{value || <span className="text-ink-3">—</span>}</p>
    </div>
  );
}
