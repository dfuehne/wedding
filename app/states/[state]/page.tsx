import { Button } from '@/components/Button/Button';
import { getPhotosForState, type Photo } from '@/lib/photos';
import StateGalleryClient from './StateGalleryClient'; 

const formatSlug = (state: string): string =>
  state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default async function StateGalleryPage({
  params,
}: {
  params: { state: string };
}) {
  const state = params.state;
  const stateName = formatSlug(state);

  let photos: Photo[] = [];
  let error: string | null = null;

  try {
    photos = await getPhotosForState(state);  // <-- await here
  } catch (err) {
    console.error(err);
    error = "Failed to load photos for this location.";
  }

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
