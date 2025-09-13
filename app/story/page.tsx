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
          <div className="mx-auto place-self-center">
            {/* Logo */}
            <img
              src="logo.png"
              alt="Wedding Logo"
              className="mx-auto mb-6 w-32 h-auto"
            />
          </div>
            <div className="flex justify-center">
                <Image
                src={"https://firebasestorage.googleapis.com/v0/b/zdwedding.firebasestorage.app/o/story%2FIMG_0594.JPG?alt=media&token=8d601e3f-7ee5-46b2-aee2-771bbfebbeec"}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={800}
                height={800}
                />
            </div>
        <div className="flex justify-center">
          <p className="text-xl font-medium">
            We met in college.
          </p>
        </div>
    
      </main>
    </div>
  );
}
