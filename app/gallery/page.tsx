'use client';

import { Button } from 'components/Button/Button';
import Image from 'next/image';

const imageList = [
  'wigs.jpg',
  'face.jpg',
  'tent.jpeg',
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white p-4">
      {/* Back Button */}
      <div className="mb-6">
        <Button href="/" className="mr-3">
          ← Back
        </Button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageList.map((fileName) => (
          <Image
            key={fileName}
            src={`/${fileName}`}
            alt={fileName}
            width={300}
            height={200}
            className="rounded shadow-md"
          />
        ))}
      </div>
    </div>
  );
}