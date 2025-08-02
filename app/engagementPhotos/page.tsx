'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UnknownKeysParam } from 'zod';

type BlobItem = {
  url: string;
  pathname: string;
  uploadedAt: string;
};

export default function StatePage() {
  const [images, setImages] = useState<BlobItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
        try {
        const res = await fetch('/api/engagementPhotos');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawData: unknown = await res.json();

        if (Array.isArray(rawData)) {
            const typedData: BlobItem[] = rawData.map((item) => {
            if (
                typeof item === 'object' &&
                item !== null &&
                'url' in item &&
                'pathname' in item &&
                'uploadedAt' in item
            ) {
                return {
                url: item.url as string,
                pathname: item.pathname as string,
                uploadedAt: item.uploadedAt as string,
                };
            } else {
                throw new Error('Invalid data format');
            }
            });

            setImages(typedData);
        } else {
            throw new Error('Data is not an array');
        }
        } catch (err: unknown) {
        setError('Error loading images');
        }
    };

    fetchImages();
    }, []);
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
        {error && <p className="text-red-600">{error}</p>}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((img) => (
              <img
                key={img.pathname}
                src={img.url}
                alt={`Image ${img.pathname}`}
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
