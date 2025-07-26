'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'components/Button/Button';

export default function WeddingPartyPage() {
  const partyPeople = ["Molly", "Kendall", "Dani", "Zach"];
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="self-start mb-6">
            <Button onClick={() => router.back()}>
                ← Back
            </Button>
        </div>
      <ul className="space-y-4 text-center text-lg font-medium">
        {partyPeople.map((item, idx) => (
          <li key={idx} className="text-gray-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}