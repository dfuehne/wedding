import fs from 'fs';
import path from 'path';

export function getStatesWithImages(): string[] {
  const locationsDir = path.join(process.cwd(), 'public/locations');
  const entries = fs.readdirSync(locationsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .filter((dir) => {
      const files = fs.readdirSync(path.join(locationsDir, dir.name));
      return files.some((file) => /\.(jpe?g|png|gif|webp)$/i.test(file));
    })
    .map((dir) => dir.name.toLowerCase().replace(/\s+/g, '-')); // match URL slug format
}