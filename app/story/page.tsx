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
        <div className="max-w-4xl mx-auto p-8 rounded-lg font-serif leading-relaxed text-justify">
          <p className="text-xl font-medium indent-8">
          Zoe was a sophomore at Colorado School of Mines competing on the cross country and track team when she met Duncan, a freshman joining the team.
          Zoe thought Duncan was a little weird, and they didn't really talk their first year. Then, covid hit and no one saw each other much.
          </p>
          <p className="text-xl font-medium indent-8">
          Right after the summer of 2020, Duncan slid back into Zoe's life through her Instagram DMs. Two months later, Zoe finally liked message. Luckily Duncan tried again. Zoe decided that he was cute, and wanted to invite him to bake in her apartment (with help from her roommates Molly, Mel, and Alex).
          For their first real date, they went together to a wine party at his apartment. Duncan tried to impress Zoe by setting up a table and showing her his *best* magic tricks. 
          </p>
          <div className="flex justify-center">
                <Image
                src={"https://firebasestorage.googleapis.com/v0/b/zdwedding.firebasestorage.app/o/story%2FIMG_7638.PNG?alt=media&token=2e07ad2a-57a0-4b95-a68c-e74c1a07e4b1"}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={200}
                height={200}
                />
            </div>
          <p className="text-xl font-medium indent-8"></p>
          <p className="text-xl font-medium indent-8">
            After a date to Buffalo Rose, a couple trips to the mountains, and lots of cross country practices, Zoe and Duncan were official that fall of 2020!
          During the next few years of undergrad and grad school at Mines, they traveled around the country for competition and also took a few trips for fun (check out our {" "}
          
            <Link href="/gallery" className="text-blue-300 hover:underline">
               Gallery page!)
          </Link>
          </p>
          <p className="text-xl font-medium indent-8">
          After graduation, Zoe moved to San Francisco for a job and Duncan moved to UChicago to begin his Physics PhD. They made it work long distance for a year, with lots of weekend trips to see each other.
          </p>
          <div className="flex justify-center">
                <Image
                src={"https://firebasestorage.googleapis.com/v0/b/zdwedding.firebasestorage.app/o/story%2FIMG_0859.jpeg?alt=media&token=8d1768c2-a049-43d4-90b4-bf6f53e6f455"}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={400}
                height={400}
                />
            </div>
          <p className="text-xl font-medium indent-8">
          In June of 2025 Duncan proposed to Zoe at a beautiful spot in the coastline of Catalina Island after a creating a massive scavenger hunt for her to solve, and supripsed her with family and friends! (Check out the {" "}
          
          
          <Link href="/proposal" className="text-blue-300 hover:underline">
               Proposal page
          </Link> {" "} for more details!)
          </p>
         <div className="flex justify-center">
                <Image
                src={"https://firebasestorage.googleapis.com/v0/b/zdwedding.firebasestorage.app/o/story%2FPXL_20250621_051727799.MP_Original.JPG?alt=media&token=9e4f10c0-58fd-445e-b2df-fce985ee4d63"}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={400}
                height={400}
                />
            </div>
          <p className="text-xl font-medium indent-8">
          Serendipitously Zoe was able to secure an internal transfer to the Chicago office of her company soon after and they are excited to start this next chapter of their lives together in the same city!
          We would love to celebrate this next chapter with you at our wedding!
          </p>
          <div className="flex justify-center">
                <Image
                src={"https://firebasestorage.googleapis.com/v0/b/zdwedding.firebasestorage.app/o/story%2FIMG_2663.HEIC?alt=media&token=ef1bc1d3-95b2-454e-b9be-abcf14369eca"}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={400}
                height={400}
                />
          </div>
        </div>
    
      </main>
    </div>
  );
}
