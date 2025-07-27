import fs from 'fs';
import path from 'path';
import { Button } from 'components/Button/Button';
import { formatStateName } from '@/lib/utils';

interface Props {
  params: { state: string };
  images: string[];
}

// This function runs on the server during build or request time
export async function generateStaticParams() {
  // Optionally, generate all params for SSG
  return [];
}

// Server component with async
export default async function StatePage({ params }: { params: { state: string } }) {
  const state = params.state;

  // Path to public folder subdirectory
  const imagesDir = path.join(process.cwd(), 'public', state);

  let images: string[] = [];
  try {
    // Read files from the state's public folder
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
        <h1 className="text-3xl font-bold">Zoe and Duncan's Adventures in {formatStateName(state)}!</h1>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((imgName) => (
              <img
                key={imgName}
                src={`/${state}/${imgName}`}
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