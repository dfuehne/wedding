import fs from 'node:fs/promises';
import path from 'node:path';

const IMAGES_ROOT = path.join(process.cwd(), 'public'); // anchor under /public

export async function getImageList(relPath: string): Promise<string[]> {
  const target = path.normalize(path.join(IMAGES_ROOT, relPath));
  if (!target.startsWith(IMAGES_ROOT)) {
    throw new Error(`Invalid path: outside public (got ${target})`);
  }

  const entries = await fs.readdir(target, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => /\.(?:jpg|jpeg|png|gif|webp)$/i.test(name));

  return files;
}