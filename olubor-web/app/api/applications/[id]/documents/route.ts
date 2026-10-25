import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/**
 * POST /api/applications/[id]/documents
 *
 * Receives a file upload, stores it in Supabase Storage, saves metadata.
 * No auth required — uses the service_role key server-side.
 * FormData fields: file (binary), document_type (string), application_id (string)
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: application_id } = await params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const document_type = formData.get("document_type");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!document_type || typeof document_type !== "string") {
    return NextResponse.json(
      { error: "document_type is required." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 10 MB size limit." },
      { status: 413 },
    );
  }

  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "File type not accepted. Upload PDF, JPG, PNG, or Word." },
      { status: 415 },
    );
  }

  if (!application_id) {
    return NextResponse.json(
      { error: "application_id is required." },
      { status: 400 },
    );
  }

  const filename = file.name;
  const filePath = `${application_id}/${document_type}/${Date.now()}-${filename}`;

  const supabase = getServerClient();

  const { error: uploadError } = await supabase.storage
    .from("application-documents")
    .upload(filePath, file, { contentType: file.type });

  if (uploadError) {
    console.error("[documents] storage upload failed", uploadError);
    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 },
    );
  }

  const { data: docData, error: insertError } = await supabase
    .from("application_documents")
    .insert({
      application_id,
      document_type,
      file_path: filePath,
      file_name: filename,
      mime_type: file.type || null,
      size_bytes: file.size,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[documents] metadata insert failed", insertError);
    return NextResponse.json(
      { error: "Could not save document metadata. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { document_id: docData!.id, file_path: filePath },
    { status: 201 },
  );
}
