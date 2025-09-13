"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import Navbar from "@/components/Navbar/navbar";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import Image from "next/image";

export default function EngagementPhotoPage() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    async function loadPhotos() {
      const folderRef = ref(storage, "engagement-photos/");
      const result = await listAll(folderRef);

      const urls = await Promise.all(
        result.items.map((itemRef) => getDownloadURL(itemRef))
      );

      setPhotos(urls);
    }
    loadPhotos();
  }, []);

  return (
    <div>
      <Navbar/>
      <main className="pt-14 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos.map((url, i) => (
            <img key={i} src={url} alt={`Photo ${i + 1}`} className="rounded-xl shadow" />
          ))}
        </div>
      </main>
    </div>
  );
}
