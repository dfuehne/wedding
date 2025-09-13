"use client";

import { useEffect, useState } from "react";
import { Pinyon_Script } from 'next/font/google';
import { storage } from "@/lib/firebase";
import Navbar from "@/components/Navbar/navbar";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";

const fancyFont = Pinyon_Script({subsets: ['latin'], weight: '400' });

export default function VenuePage() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    async function loadPhotos() {
      const folderRef = ref(storage, "venue/");
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
            {photos[2] && (
            <div className="flex justify-center">
                <Image
                src={photos[2]}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={800}
                height={800}
                />
            </div>
          )}
          <div className="flex justify-center">
            <div className="text-center mb-6 mt-6">
            <h1 className={`text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight ${fancyFont.className}`}>
                The Barn at Sunset Ranch
            </h1>
            <p className="mt-2 text-2xl font-medium"> (Both Ceremony and Reception) </p>
            <Link href="https://maps.app.goo.gl/PqAtXkghYMDrsYSu8" className="text-2xl font-medium underline">
              27650 CR 337B
            </Link>
            <p className="text-2xl font-medium">Buena Vista, CO 81211</p>
            <Link href="https://www.thebarnatsunsetranch.com" className="text-2xl font-medium underline">
              Website
            </Link>

            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos[0] && (
            <Image
              src={photos[0]}
              alt="Photo 1"
              className="rounded-xl shadow"
              width={500}   // Next.js requires width & height
              height={500}  // or use fill style with parent container
            />
          )}
          {photos[1] && (
            <Image
              src={photos[1]}
              alt="Photo 2"
              className="rounded-xl shadow"
              width={500}   // Next.js requires width & height
              height={500}  // or use fill style with parent container
            />
          )}
          {photos[3] && (
            <Image
              src={photos[3]}
              alt="Photo 3"
              className="rounded-xl shadow"
              width={500}   // Next.js requires width & height
              height={500}  // or use fill style with parent container
            />
          )}
        </div>
      </main>
    </div>
  );
}
