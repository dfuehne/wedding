 import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// ✅ Keep it inline-typed — no extra interface
export default async function StatePage() {

  const imagesDir = path.join(process.cwd(), 'public/engagementPhotos');
  let images: string[] = [];
  try {
    images = fs.readdirSync(imagesDir).filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
  } catch (error) {
    console.warn(`Could not read images`, error);
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/gallery"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          ← Back
        </Link>
      </div>
      <div className="p-6">
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((imgName) => (
              <img
                key={imgName}
                src={`/engagementPhotos/${imgName}`}
                alt={`image ${imgName}`}
                className="rounded shadow"
                loading="lazy"
              />
            ))
          ) : (
            <p>No images found.</p>
          )}
        </div>
      </div>
    </div>
  );
}