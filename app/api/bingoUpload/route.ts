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

async function getBingoSessions() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    return [];
  }

  const bucket = adminStorage.bucket(bucketName);
  const [files, , apiResponse] = await bucket.getFiles({
    prefix: "bingo-photos/",
    delimiter: "/",
  });

  const prefixesResponse = apiResponse as { prefixes?: string[] } | undefined;
  const prefixes = Array.isArray(prefixesResponse?.prefixes)
    ? prefixesResponse.prefixes
    : [];
  const folderNames = prefixes
    .map((prefix) => prefix.replace("bingo-photos/", "").replace(/\/$/, ""))
    .filter(Boolean);

  const fileFolders = files
    .map((file) => file.name)
    .filter((name) => name.startsWith("bingo-photos/") && name.split("/").length >= 3)
    .map((name) => name.split("/")[1])
    .filter(Boolean);

  return Array.from(new Set([...folderNames, ...fileFolders])).sort((a, b) =>
    a.localeCompare(b)
  );
}

export async function GET() {
  try {
    const sessions = await getBingoSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Failed to load bingo sessions:", error);
    return NextResponse.json({ sessions: [] }, { status: 500 });
  }
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