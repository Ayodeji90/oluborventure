import { getServerClient } from "@/lib/supabase/server";
import ApplicationsTable from "@/components/admin/ApplicationsTable";

export default async function AdminPage() {
  const supabase = getServerClient();
  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, reference_code, program_type, status, full_name, phone, whatsapp, submitted_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error loading applications: {error.message}</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Applications</h1>
        <p className="text-ink-3 text-[14px] mt-1">{applications?.length ?? 0} total submissions</p>
      </div>
      <ApplicationsTable applications={applications ?? []} />
    </div>
  );
}
