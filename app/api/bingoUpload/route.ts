import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function sanitizeSegment(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function buildUploadPath(name: string, fileName: string) {
  const safeName = sanitizeSegment(name);
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `bingo-photos/${safeName}/${Date.now()}-${safeFileName}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const name = formData.get("name");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A file is required for upload." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "A name is required before uploading." },
        { status: 400 }
      );
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!bucketName) {
      return NextResponse.json(
        { error: "Storage bucket is not configured." },
        { status: 500 }
      );
    }

    const bucket = adminStorage.bucket(bucketName);
  const filePath = buildUploadPath(name, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadedFile = bucket.file(filePath);

    await uploadedFile.save(fileBuffer, {
      metadata: {
        contentType: file.type || "application/octet-stream",
      },
      resumable: false,
    });

    const [url] = await uploadedFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ url, path: filePath });
  } catch (error) {
    console.error("Bingo upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}