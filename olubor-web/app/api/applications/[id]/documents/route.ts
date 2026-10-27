import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
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
const ALLOWED_DOCUMENT_TYPES = new Set([
  "passport", "degreeCerts", "transcripts", "waecCert", "cv", "sop",
  "researchProposal", "visaRefusalLetter", "publishedPapers", "mastersCert",
  "mastersTranscripts", "undergradCert", "undergradTranscripts",
]);

async function matchesFileSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const startsWith = (...signature: number[]) => signature.every((byte, i) => bytes[i] === byte);
  if (file.type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (file.type === "image/jpeg") return startsWith(0xff, 0xd8, 0xff);
  if (file.type === "image/png") return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (file.type === "application/msword") return startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return startsWith(0x50, 0x4b, 0x03, 0x04);
  }
  if (file.type === "image/heic" || file.type === "image/heif") {
    const brand = new TextDecoder().decode(bytes.slice(8, 12));
    return new TextDecoder().decode(bytes.slice(4, 8)) === "ftyp" && ["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand);
  }
  return false;
}

/**
 * POST /api/applications/[id]/documents
 *
 * Receives a file upload, stores it in Supabase Storage, saves metadata.
 * Requires a verified session that owns the application. The service role is
 * used only after ownership has been checked.
 * FormData fields: file (binary), document_type (string)
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: application_id } = await params;
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in to upload documents." }, { status: 401 });

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(application_id)) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 256 * 1024) {
    return NextResponse.json({ error: "Upload exceeds the 10 MB size limit." }, { status: 413 });
  }

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
  if (!ALLOWED_DOCUMENT_TYPES.has(document_type)) {
    return NextResponse.json({ error: "Document type is not accepted." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 10 MB size limit." },
      { status: 413 },
    );
  }

  if (!ALLOWED_MIME.has(file.type) || !(await matchesFileSignature(file))) {
    return NextResponse.json(
      { error: "File type not accepted. Upload PDF, JPG, PNG, or Word." },
      { status: 415 },
    );
  }

  const supabase = getServerClient();
  const { data: application } = await supabase
    .from("applications")
    .select("id, user_id")
    .eq("id", application_id)
    .maybeSingle();
  if (!application || application.user_id !== user.id) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const filename = (file.name.split(/[\\/]/).pop() ?? "document")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120) || "document";
  const filePath = `${application_id}/${document_type}/${crypto.randomUUID()}-${filename}`;

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
    await supabase.storage.from("application-documents").remove([filePath]);
    return NextResponse.json(
      { error: "Could not save document metadata. Please try again." },
      { status: 500 },
    );
  }

  if (!docData) {
    await supabase.storage.from("application-documents").remove([filePath]);
    return NextResponse.json({ error: "Could not save document metadata. Please try again." }, { status: 500 });
  }

  return NextResponse.json(
    { document_id: docData!.id, file_path: filePath },
    { status: 201 },
  );
}
