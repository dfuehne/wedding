import fs from 'fs';
import path from 'path';
import { WeddingPartyMember } from 'lib/weddingPartyMember';


export function getWeddingPartyWithInfo(): WeddingPartyMember[] {
  const partyDir = path.join(process.cwd(), 'public/weddingParty');
  const entries = fs.readdirSync(partyDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .flatMap((dir) => {
      const dirPath = path.join(partyDir, dir.name);
      const files = fs.readdirSync(dirPath);
      const jsonFile = files.find((file) => /\.json$/i.test(file));
      if (!jsonFile) return []; // skip if no json

      const jsonPath = path.join(dirPath, jsonFile);
      const raw = fs.readFileSync(jsonPath, "utf-8");
      const data = JSON.parse(raw) as WeddingPartyMember;

      // slug for URL matching
      const slug = dir.name.toLowerCase().replace(/\s+/g, '-');

      return [
        new WeddingPartyMember(
          data.name ?? dir.name,
          data.role ?? 'Loser',
          data.age ?? 999,
          data.relationship ?? '',
          data.info ?? 'Loser',
          slug
        ),
      ];
    });
}
