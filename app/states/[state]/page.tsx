import { Button } from '@/components/Button/Button';
import type { Photo } from '@/lib/photos';
import StateGalleryClient from './StateGalleryClient'; 
import { getPhotosForState } from '@/lib/photos';

// Helper to format the state for display (can stay here)
const formatSlug = (state: string): string => {
  return state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default async function StateGalleryPage({ params }: { params: { state: string } }) {
  const param = await params;
  const stateName = formatSlug(param.state);
  let photos: Photo[] = [];
  let error: string | null = null;

  photos = getPhotosForState(param.state);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Button href="/gallery">
          ← Back to Map
        </Button>
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