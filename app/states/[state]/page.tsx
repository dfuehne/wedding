import { Button } from '@/components/Button/Button';
import { getPhotosForState } from '@/lib/photos';
import type { Photo } from '@/lib/photos';
import StateGalleryClient from './StateGalleryClient'; 


const formatSlug = (state: string): string =>
  state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default async function StateGalleryPage({
    params,
}: {
  params: Promise<{ state: string }>;
}) {
  const resolvedParams = await params;  // <-- await here!
  const state = resolvedParams.state;
  // No await
  const stateName = formatSlug(state);

  const photos: Photo[] = getPhotosForState(state);
  const error: string | null = null;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Button href="/gallery">← Back to Map</Button>
      </div>

      <div className="mx-auto max-w-3xl text-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl xl:text-4xl">
          Gallery: {stateName}
        </h1>
      </div>

      <StateGalleryClient initialPhotos={photos} initialError={error} />
    </div>
  );
}
