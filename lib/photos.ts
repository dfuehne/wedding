// src/lib/photos.ts

import fs from 'fs';
import path from 'path';

// Define the shape of a photo object
export interface Photo {
  url: string;
}

export function getPhotosForState(slug: string): Photo[] {
  const directoryPath = path.join(process.cwd(), 'public/locations', slug);

  try {
    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      console.warn(`Directory not found for slug: ${slug}`);
      return [];
    }
    
    const files = fs.readdirSync(directoryPath);

    return files
      .filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file))
      .map((file) => ({
        url: `/locations/${slug}/${file}`, // Construct the public URL
      }));
  } catch (error) {
    console.error(`Error reading directory for slug ${slug}:`, error);
    return [];
  }
}