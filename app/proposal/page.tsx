'use client';

import Link from 'next/link';
import { Button } from 'components/Button/Button';
import { CluePin } from '@/src/cluePin';

export default function ProposalPage() {

  const pins: CluePin[] = [
    { id: 'bp', x: 58.0, y: 8.0, label: 'Before You Play', link: '/proposalClues/before-you-play' },
    { id: 'i', x: 58.0, y: 20.0, label: 'Introduction', link: '/proposalClues/introduction' },
    { id: '1', x: 55.8, y: 35.8, label: 'Clue 1', link: '/proposalClues/clue-1' },
    { id: '2', x: 51.9, y: 45.8, label: 'Clue 2', link: '/proposalClues/clue-2' },
    { id: '3', x: 61.0, y: 38.4, label: 'Clue 3', link: '/proposalClues/clue-3' },
    { id: '4', x: 68.4, y: 86.9, label: 'Clue 4', link: '/proposalClues/clue-4' },
    { id: '5', x: 60.5, y: 96.2, label: 'Clue 5', link: '/proposalClues/clue-5' },
    { id: '6', x: 73.4, y: 86.9, label: 'Clue 6', link: '/proposalClues/clue-6' },
    { id: '7', x: 64.8, y: 79.7, label: 'Clue 7, Proposal', link: '/proposalClues/clue-7' },
  ];

  return (
    <div>
      <div className="mb-6">
        <Button href="/" className="mr-3">
          ← Back
        </Button>
      </div>

      <div
        className="relative w-full max-w-4xl mx-auto"
      >
        <img
          src="/catalina.svg"
          alt="Catalina Map"
          className="w-full h-auto"
        />

        {pins.map((pin) => (
          <Link
            key={pin.id}
            href={pin.link}
            className="absolute z-50"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white group-hover:scale-110 transition" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded-lg shadow-md whitespace-nowrap">
              {pin.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}