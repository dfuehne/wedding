'use client';

import { useEffect, useState } from 'react';
import { Button } from 'components/Button/Button';
import { WeddingPartyMember } from '@/lib/weddingPartyMember'

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
      <div className="mb-6">
        <Button href="/" className="mr-3">
          ← Back
        </Button>
      </div>
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
        <ul className="space-y-4 text-lg font-medium">
          {weddingPartyWithInfo.map((item) => (
            <li key={item.slug}>
              <Button href={`/partyMembers/${item.slug}`} className="mr-3">
                {item.name}, {item.role}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}