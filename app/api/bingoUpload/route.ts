import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

function sanitizeSegment(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function buildUploadPath(name: string, fileName: string) {
  const safeName = sanitizeSegment(name);
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `bingo-photos/${safeName}/${Date.now()}-${safeFileName}`;
}

function buildChallengeUploadPath(name: string, challengeID: string) {
  const safeName = sanitizeSegment(name);
  const safeChallengeId = challengeID.trim().replace(/[\\/]+/g, "_");
  return `bingo-photos/${safeName}/${safeChallengeId}`;
}

function buildSessionFolderPath(name: string) {
  const safeName = sanitizeSegment(name);
  return `bingo-photos/${safeName}/.keep`;
}

function buildSessionSeedPath(name: string) {
  const safeName = sanitizeSegment(name);
  return `bingo-photos/${safeName}/.seed`;
}

function buildSessionPrefix(name: string) {
  const safeName = sanitizeSegment(name);
  return `bingo-photos/${safeName}/`;
}

async function sessionExists(name: string) {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    throw new Error("Storage bucket is not configured.");
  }

  const bucket = adminStorage.bucket(bucketName);
  const prefix = buildSessionPrefix(name);
  const [_, __, apiResponse] = await bucket.getFiles({
    prefix: "bingo-photos/",
    delimiter: "/",
  });

  const prefixesResponse = apiResponse as { prefixes?: string[] } | undefined;
  const prefixes = Array.isArray(prefixesResponse?.prefixes) ? prefixesResponse.prefixes : [];
  return prefixes.some((folderPrefix) => folderPrefix === prefix);
}

async function ensureSessionFolder(name: string) {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    throw new Error("Storage bucket is not configured.");
  }

  const bucket = adminStorage.bucket(bucketName);
  const folderPath = buildSessionFolderPath(name);
  const placeholderFile = bucket.file(folderPath);
  const seedPath = buildSessionSeedPath(name);
  const seedFile = bucket.file(seedPath);
  const seed = randomUUID();

  await placeholderFile.save(Buffer.alloc(0), {
    metadata: {
      contentType: "text/plain",
    },
    resumable: false,
  });

  await seedFile.save(Buffer.from(seed, "utf8"), {
    metadata: {
      contentType: "text/plain",
    },
    resumable: false,
  });

  return { folderPath, seed };
}

async function getSessionSeed(name: string) {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    throw new Error("Storage bucket is not configured.");
  }

  const bucket = adminStorage.bucket(bucketName);
  const seedFile = bucket.file(buildSessionSeedPath(name));

  try {
    const [contents] = await seedFile.download();
    const seed = contents.toString("utf8").trim();

    if (seed) {
      return seed;
    }
  } catch (error) {
    // If the seed file does not exist yet, create it below.
  }

  const seed = randomUUID();
  await seedFile.save(Buffer.from(seed, "utf8"), {
    metadata: {
      contentType: "text/plain",
    },
    resumable: false,
  });

  return seed;
}

async function getBingoSessions() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    return [];
  }

  const bucket = adminStorage.bucket(bucketName);
  const [_, __, apiResponse] = await bucket.getFiles({
    prefix: "bingo-photos/",
    delimiter: "/",
  });

  const prefixesResponse = apiResponse as { prefixes?: string[] } | undefined;
  const prefixes = Array.isArray(prefixesResponse?.prefixes)
    ? prefixesResponse.prefixes
    : [];

  const sessions = prefixes
    .map((prefix) => prefix.replace("bingo-photos/", "").replace(/\/$/, ""))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return Promise.all(
    sessions.map(async (session) => ({
      name: session,
      seed: await getSessionSeed(session),
    }))
  );
}

async function getCompletedChallengeIds(name: string) {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    return [];
  }

  const bucket = adminStorage.bucket(bucketName);
  const prefix = buildSessionPrefix(name);
  const [files] = await bucket.getFiles({ prefix });

  return files
    .map((file) => file.name.slice(prefix.length))
    .filter((relativePath) => relativePath.length > 0 && !relativePath.includes("/"))
    .filter((relativePath) => !relativePath.startsWith("."))
    .sort((a, b) => a.localeCompare(b));
}

async function getCompletedChallengePhotos(name: string) {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!bucketName) {
    return [] as Array<{ challengeID: string; url: string }>;
  }

  const bucket = adminStorage.bucket(bucketName);
  const prefix = buildSessionPrefix(name);
  const [files] = await bucket.getFiles({ prefix });

  const completedPhotos = await Promise.all(
    files
      .map((file) => file.name.slice(prefix.length))
      .filter((relativePath) => relativePath.length > 0 && !relativePath.includes("/"))
      .filter((relativePath) => !relativePath.startsWith("."))
      .map(async (challengeID) => {
        const file = bucket.file(`${prefix}${challengeID}`);
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        });

        return { challengeID, url };
      })
  );

  return completedPhotos.sort((a, b) => a.challengeID.localeCompare(b.challengeID));
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const session = url.searchParams.get("session");

    if (session) {
      const completedChallengeIds = await getCompletedChallengeIds(session);
      const completedChallengePhotos = await getCompletedChallengePhotos(session);
      return NextResponse.json({ completedChallengeIds, completedChallengePhotos });
    }

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
    const action = formData.get("action");
    const file = formData.get("file");
    const name = formData.get("name");

    if (action === "create-folder") {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { error: "A name is required before creating a session folder." },
          { status: 400 }
        );
      }

      if (await sessionExists(name)) {
        return NextResponse.json(
          { error: "That session already exists." },
          { status: 409 }
        );
      }

      const { folderPath, seed } = await ensureSessionFolder(name);
      return NextResponse.json({ path: folderPath, seed });
    }

    if (action === "upload-challenge-photo") {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { error: "A session name is required before uploading." },
          { status: 400 }
        );
      }

      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "A file is required for upload." },
          { status: 400 }
        );
      }

      const challengeID = formData.get("challengeID");

      if (typeof challengeID !== "string" || !challengeID.trim()) {
        return NextResponse.json(
          { error: "A challenge ID is required before uploading." },
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

      if (!(await sessionExists(name))) {
        return NextResponse.json(
          { error: "That session does not exist." },
          { status: 404 }
        );
      }

      const filePath = buildChallengeUploadPath(name, challengeID);
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const uploadedFile = bucket.file(filePath);

      await uploadedFile.save(fileBuffer, {
        metadata: {
          contentType: file.type || "application/octet-stream",
        },
        resumable: false,
      });

      return NextResponse.json({ path: filePath, challengeID: challengeID.trim() });
    }

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