import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { getServerClient } from "@/lib/supabase/server";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "application/pdf", "image/jpeg", "image/png", "image/heic", "image/heif",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_DOCUMENT_TYPES = new Set([
  "passport", "degreeCerts", "transcripts", "waecCert", "cv", "sop",
  "researchProposal", "visaRefusalLetter", "publishedPapers", "mastersCert",
  "mastersTranscripts", "undergradCert", "undergradTranscripts",
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function matchesFileSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const startsWith = (...signature: number[]) => signature.every((byte, i) => bytes[i] === byte);
  if (file.type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (file.type === "image/jpeg") return startsWith(0xff, 0xd8, 0xff);
  if (file.type === "image/png") return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (file.type === "application/msword") return startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return startsWith(0x50, 0x4b, 0x03, 0x04);
  if (file.type === "image/heic" || file.type === "image/heif") {
    const brand = new TextDecoder().decode(bytes.slice(8, 12));
    return new TextDecoder().decode(bytes.slice(4, 8)) === "ftyp" && ["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand);
  }
  return false;
}

async function ownedDraft(draftId: string, userId: string) {
  if (!UUID_RE.test(draftId)) return null;
  const supabase = getServerClient();
  const { data } = await supabase
    .from("application_drafts")
    .select("id")
    .eq("id", draftId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in to save documents." }, { status: 401 });
  const { id: draftId } = await params;
  if (!(await ownedDraft(draftId, user.id))) return NextResponse.json({ error: "Draft not found." }, { status: 404 });

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
  const documentType = formData.get("document_type");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (typeof documentType !== "string" || !ALLOWED_DOCUMENT_TYPES.has(documentType)) {
    return NextResponse.json({ error: "Document type is not accepted." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be no larger than 10 MB." }, { status: 413 });
  }
  if (!ALLOWED_MIME.has(file.type) || !(await matchesFileSignature(file))) {
    return NextResponse.json({ error: "File type not accepted. Upload PDF, JPG, PNG, or Word." }, { status: 415 });
  }

  const filename = (file.name.split(/[\\/]/).pop() ?? "document")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120) || "document";
  const filePath = `drafts/${draftId}/${documentType}/${crypto.randomUUID()}-${filename}`;
  const supabase = getServerClient();
  const { error: uploadError } = await supabase.storage
    .from("application-documents")
    .upload(filePath, file, { contentType: file.type });
  if (uploadError) {
    console.error("[draft-documents] storage upload failed", uploadError);
    return NextResponse.json({ error: "File upload failed. Please try again." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("application_draft_documents")
    .insert({
      draft_id: draftId,
      document_type: documentType,
      file_path: filePath,
      file_name: filename,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select("id, document_type, file_name, mime_type, size_bytes, uploaded_at")
    .single();
  if (error || !data) {
    console.error("[draft-documents] metadata insert failed", error);
    await supabase.storage.from("application-documents").remove([filePath]);
    return NextResponse.json({ error: "Could not save document details. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ document: data }, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Sign in to remove documents." }, { status: 401 });
  const { id: draftId } = await params;
  if (!(await ownedDraft(draftId, user.id))) return NextResponse.json({ error: "Draft not found." }, { status: 404 });

  const documentId = new URL(request.url).searchParams.get("document_id");
  if (!documentId || !UUID_RE.test(documentId)) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const supabase = getServerClient();
  const { data: document } = await supabase
    .from("application_draft_documents")
    .select("id, file_path")
    .eq("id", documentId)
    .eq("draft_id", draftId)
    .maybeSingle();
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  const { error: storageError } = await supabase.storage.from("application-documents").remove([document.file_path]);
  if (storageError) {
    console.error("[draft-documents] storage remove failed", storageError);
    return NextResponse.json({ error: "Could not remove the saved file. Please try again." }, { status: 500 });
  }
  const { error } = await supabase.from("application_draft_documents").delete().eq("id", documentId);
  if (error) {
    console.error("[draft-documents] metadata remove failed", error);
    return NextResponse.json({ error: "Could not update the saved application. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
