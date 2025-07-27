'use client';

import { Button } from 'components/Button/Button';

export default function WeddingPartyPage() {
  const partyPeople = ["Molly", "Kendall", "Dani", "Zach"];

  return (
    <div>
      <div className="mb-6">
        <Button href="/" className="mr-3">
          ← Back
        </Button>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <ul className="space-y-4 text-center text-lg font-medium">
          {partyPeople.map((item, idx) => (
            <li key={idx} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}