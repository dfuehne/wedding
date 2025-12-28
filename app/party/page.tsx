'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { WeddingPartyMember } from '@/lib/weddingPartyMember'
import Navbar from "@/components/Navbar/navbar";

export default function WeddingPartyPage() {
  const [weddingPartyWithInfo, setWeddingPartyWithInfo] = useState<WeddingPartyMember[]>([]);

  useEffect(() => {
      fetch('/api/weddingPartyWithInfo')
        .then((res) => res.json())
        .then((data: unknown) => {
          if (
            Array.isArray(data) &&
            data.every(
          (item) =>
            typeof item === 'object' &&
            item !== null &&
            'name' in item &&
            'role' in item &&
            'relationship' in item
        )
          ) {
            setWeddingPartyWithInfo(data  as WeddingPartyMember[]);
          } else {
            console.error('Invalid data format for setWeddingPartyWithInfo:', data);
          }
        })
        .catch((err) => console.error('Error loading states:', err));
    }, []);

  return (
    <div>
      <Navbar/>
      <main className="pt-14 p-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <img
            src="logo.png"
            alt="Wedding Logo"
            className="mx-auto mb-6 w-32 h-auto"
          />
          <h1 className="mb-4 max-w-2xl mx-auto text-2xl leading-none font-extrabold tracking-tight md:text-3xl xl:text-4xl">
            Wedding Party!
          </h1>

            <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> {/* top line */}

            {weddingPartyWithInfo.map((item, idx) => (
              <div key={item.slug} className="w-full text-center my-8">
                {idx !== 0 && (
                  <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> // line between sections
                )}
                <Link href={`/partyMembers/${item.slug}`}>
                  <span className="text-2xl font-medium cursor-pointer hover:underline transition">
                    {item.name}, {item.role}
                  </span>
                </Link>
              </div>
            ))}

            <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> {/* bottom line */}
        </div>
      </main>
    </div>
  );
}