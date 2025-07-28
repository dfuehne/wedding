import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { formatClueName } from '@/lib/utils'

// This function runs on the server during build or request time
export async function generateStaticParams() {
  return [];
}

// ✅ Keep it inline-typed — no extra interface
export default async function CluePage({
  params,
}: {
  params: Promise<{ clue: string }>;
}) {
  const resolvedParams = await params;  // <-- await here!
  const clue = resolvedParams.clue;

  const imagesDir = path.join(process.cwd(), 'public/clues', clue);

  let images: string[] = [];
  try {
    images = fs.readdirSync(imagesDir).filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
  } catch (error) {
    console.warn(`Could not read images for groomsman "${clue}":`, error);
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/proposal"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          ← Back
        </Link>
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          {formatClueName(clue)}:
        </h1>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((imgName) => (
              <img
                key={imgName}
                src={`/clues/${clue}/${imgName}`}
                alt={`${clue} image ${imgName}`}
                className="rounded shadow"
                loading="lazy"
              />
            ))
          ) : (
            <p>No images found for {clue}.</p>
          )}
        </div>
      </div>
    </div>
  );
}