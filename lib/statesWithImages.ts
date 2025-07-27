import fs from 'fs';
import path from 'path';

export function getStatesWithImages(): string[] {
  const publicDir = path.join(process.cwd(), 'public');
  const entries = fs.readdirSync(publicDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .filter((dir) => {
      const files = fs.readdirSync(path.join(publicDir, dir.name));
      return files.some((file) => /\.(jpe?g|png|gif|webp)$/i.test(file));
    })
    .map((dir) => dir.name.toLowerCase().replace(/\s+/g, '-')); // match URL slug format
}