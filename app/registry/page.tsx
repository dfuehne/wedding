"use client";

import { useEffect, useState } from "react";
import { Pinyon_Script } from 'next/font/google';
import { storage } from "@/lib/firebase";
import Navbar from "@/components/Navbar/navbar";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import Image from "next/image";
import { Button } from "components/Button/Button"

const fancyFont = Pinyon_Script({subsets: ['latin'], weight: '400' });

export default function VenuePage() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    async function loadPhotos() {
      const folderRef = ref(storage, "registry/");
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
          <div className="mx-auto place-self-center">
            {/* Logo */}
            <img
              src="logo.png"
              alt="Wedding Logo"
              className="mx-auto mb-6 w-32 h-auto"
            />
          </div>
          <div className="flex justify-center">
            <div className="text-center mb-6 mt-6">
                <h1 className={`text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight ${fancyFont.className}`}>
                    Click for Registries!
                </h1>
                <div className="flex justify-center gap-4 mt-4">
                  <Button href="https://www.honeyfund.com/site/fuehne-baker-09-04-2026">
                    Cash
                  </Button>
                  <Button href="https://www.amazon.com/wedding/guest-view/1LR43V8D1ISLI">
                    Amazon
                  </Button>
                </div>
            </div>
          </div>
            {photos[0] && (
            <div className="flex justify-center">
                <Image
                src={photos[0]}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={800}
                height={800}
                />
            </div>
          )}
      </main>
    </div>
  );
}
