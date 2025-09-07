import { storage } from "@/lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

// Define the shape of a photo object
export interface Photo {
  url: string;
  name: string;
}

export async function getPhotosForState(slug: string): Promise<Photo[]> {
  try {
    const folderRef = ref(storage, `locations/${slug}/`);
    const result = await listAll(folderRef);

    const photos: Photo[] = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { url, name: item.name };
      })
    );

    return photos;
  } catch (error) {
    console.error(`Error fetching photos for slug ${slug}:`, error);
    return [];
  }
}
