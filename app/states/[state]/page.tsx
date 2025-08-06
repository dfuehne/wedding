import fs from 'fs';
import path from 'path';
import { Button } from "components/Button/Button"
import { formatStateName } from '@/lib/utilsClient';

// This function runs on the server during build or request time
export async function generateStaticParams() {
  return [];
}

// ✅ Keep it inline-typed — no extra interface
export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const resolvedParams = await params;  // <-- await here!
  const state = resolvedParams.state;

  const imagesDir = path.join(process.cwd(), 'public/locations', state);

  let images: string[] = [];
  try {
    images = fs.readdirSync(imagesDir).filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
  } catch (error) {
    console.warn(`Could not read images for state "${state}":`, error);
  }

  return (
    <div>
      <div className="mb-6">
        <Button href="/gallery" className="mr-3">
          ← Back
        </Button>
      </div>
      <div className="p-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <img
            src="../logo.png"
            alt="Wedding Logo"
            className="mx-auto mb-6 w-32 h-auto"
            />
          <h1 className="mb-4 max-w-2xl mx-auto text-2xl leading-none font-extrabold tracking-tight md:text-3xl xl:text-4xl">
            Zoe and Duncan&apos;s Adventures in {formatStateName(state)}!
          </h1>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((imgName) => (
              <img
                key={imgName}
                src={`/locations/${state}/${imgName}`}
                alt={`${state} image ${imgName}`}
                className="rounded shadow"
                loading="lazy"
              />
            ))
          ) : (
            <p>No images found for {state}.</p>
          )}
        </div>
      </div>
    </div>
  );
}