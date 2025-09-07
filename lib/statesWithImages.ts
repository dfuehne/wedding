// lib/getStatesWithImages.ts
import { storage } from "@/lib/firebase"; // make sure firebase storage is initialized
import { listAll, ref } from "firebase/storage";

// Get all "state" directories under locations/ that contain at least one image
export async function getStatesWithImages(): Promise<string[]> {
  const locationsRef = ref(storage, "locations/");

  // List everything under locations/
  const result = await listAll(locationsRef);

  // For each "folder" in locations/, check if it contains an image file
  const states: string[] = [];

  for (const prefix of result.prefixes) {
    // prefix is a folder (e.g., locations/california/)
    const files = await listAll(prefix);

    const hasImage = files.items.some((item) =>
      /\.(jpe?g|png|gif|webp|HEIC)$/i.test(item.name)
    );

    if (hasImage) {
      states.push(prefix.name.toLowerCase().replace(/\s+/g, "-"));
    }
  }

  return states;
}
