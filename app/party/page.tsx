'use client';

import { useEffect, useState } from 'react';
import { Button } from 'components/Button/Button';
import { formatPersonName } from '@/lib/utilsClient'

export default function WeddingPartyPage() {
  const [weddingPartyWithInfo, setWeddingPartyWithInfo] = useState<string[]>([]);

  useEffect(() => {
      fetch('/api/weddingPartyWithInfo')
        .then((res) => res.json())
        .then((data: unknown) => {
          if (
            Array.isArray(data) &&
            data.every((item) => typeof item === 'string')
          ) {
            setWeddingPartyWithInfo(data);
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <ul className="space-y-4 text-center text-lg font-medium">
          {weddingPartyWithInfo.map((item) => (
            <li key={item}>
              <Button href={`/partyMembers/${item}`} className="mr-3">
                {formatPersonName(item)}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}