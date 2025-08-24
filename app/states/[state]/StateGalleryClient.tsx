'use client';

import { useState } from 'react';
import Bubble from '@/components/Bubble/Bubble';
import type { Photo } from '@/lib/photos';

interface StateGalleryClientProps {
  initialPhotos: Photo[];
  initialError: string | null;
}

export default function StateGalleryClient({ initialPhotos, initialError }: StateGalleryClientProps) {
  // The state is now initialized with the data passed down from the server.
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [error, setError] = useState<string | null>(initialError);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (photos.length === 0) {
    return <p className="text-center">No photos found for this location.</p>;
  }

  return <Bubble photos={photos} />;
}