import fs from 'fs';
import path from 'path';

export function getWeddingPartyWithInfo(): string[] {
  const partyDir = path.join(process.cwd(), 'public/weddingParty');
  const entries = fs.readdirSync(partyDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .filter((dir) => {
      const files = fs.readdirSync(path.join(partyDir, dir.name));
      return files.some((file) => /\.json$/i.test(file));
    })
    .map((dir) => dir.name.toLowerCase().replace(/\s+/g, '-')); // match URL slug format
}