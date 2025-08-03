'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from 'components/Button/Button';
import { CluePin } from '@/src/cluePin';
import { useEffect, useRef, useState } from 'react';

export default function ProposalPage() {
  const searchParams = useSearchParams();

  const pins: CluePin[] = [
    { id: 'before-you-play', x: 58.0, y: 10.0, label: 'Before You Play', link: '/proposalClues/before-you-play', zoom: 1.0, tx: 58.0, ty:20.0},
    { id: 'introduction', x: 58.0, y: 23.0, label: 'Introduction', link: '/proposalClues/introduction', zoom: 1.5, tx:33.33, ty:23.0},
    { id: 'clue-1', x: 55.8, y: 35.8, label: 'Clue 1', link: '/proposalClues/clue-1', zoom: 1.5, tx: 33.33, ty:33.33},
    { id: 'clue-2', x: 51.9, y: 45.8, label: 'Clue 2', link: '/proposalClues/clue-2', zoom: 1.5, tx: 33.33, ty:33.33},
    { id: 'clue-3', x: 61.0, y: 38.4, label: 'Clue 3', link: '/proposalClues/clue-3', zoom: 1.5, tx: 33.33, ty:33.33},
    { id: 'clue-4', x: 67.4, y: 85.9, label: 'Clue 4', link: '/proposalClues/clue-4', zoom: 1.4, tx: 33.33, ty:63.33},
    { id: 'clue-5', x: 60.5, y: 96.2, label: 'Clue 5', link: '/proposalClues/clue-5', zoom: 1.5, tx: 33.33, ty:33.33},
    { id: 'clue-6', x: 66.1, y: 82.9, label: 'Clue 6', link: '/proposalClues/clue-6', zoom: 1.5, tx: 33.33, ty:33.33},
    { id: 'clue-7', x: 65.1, y: 81.0, label: 'Clue 7: Proposal', link: '/proposalClues/clue-7', zoom: 5, tx: 9, ty:3},
  ];

  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  useEffect(() => {
      const focused = searchParams.get('focusedClue');
      if (!focused) return;
      const foundIndex = pins.findIndex(p => p.id === focused);
      if (foundIndex > 0) setFocusedIndex(foundIndex);
  }, [searchParams]);


  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleFocus = (index: number) => {
    const pin = pins[index];
    if (!pin) return;

    setFocusedIndex(index);

    const button = buttonRefs.current[pin.id];
    if (button) {
      button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const focusedPin = pins[focusedIndex];

  return (
    <div>
      {/* Back button */}
<div className="mb-6 flex">
  <Button href="/" className="inline-flex mr-3">
    ← Back
  </Button>
  <Button href="/engagementPhotos" className="inline-flex">
    Just Show Me The Engagement Pictures
  </Button>
</div>

      {/* Scrollable Buttons */}
      <div className="overflow-x-auto mb-4 z-10 relative">
        <div className="flex gap-0 px-0 py-0 w-max mx-auto">
          {pins.map((pin, index) => (
            <button
              key={pin.id}
              ref={(el) => {
                buttonRefs.current[pin.id] = el;
              }}
              onClick={() => handleFocus(index)}
              className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap transition-all
                ${index === focusedIndex ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}`}
            >
              {pin.label}
            </button>
          ))}
        </div>
      </div>

      {/* instruction text */}
      <p className="text-center text-sm mb-4 text-gray-700">
        Click on the green clue location to play!
      </p>

      {/* Map + Zoomed Pins */}
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
        {focusedPin && (
          <div
            className="transition-transform duration-500 ease-in-out relative"
            style={{
              transformOrigin: 'top left',
              transform: `scale(${focusedPin.zoom}) translate(${-focusedPin.x + focusedPin.tx}%, ${-focusedPin.y + focusedPin.ty}%)`,
            }}
          >
            <img
              src="/catalina.svg"
              alt="Catalina Map"
              className="w-full h-auto"
            />

            {/* {focusedIndex > 0 && (() => {
              const prevPin = pins[focusedIndex - 1];
              const currPin = focusedPin;

              // Pin positions in percentage (as per your layout)
              const x1 = prevPin.x;
              const y1 = prevPin.y;
              const x2 = currPin.x;
              const y2 = currPin.y;

              return (
                <svg
                  className="absolute left-0 top-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1={x1 + 0.25 / currPin.zoom}
                    y1={y1 + 0.25 / currPin.zoom}
                    x2={x2}// + 0.25 / currPin.zoom}
                    y2={y2}// + 0.25 / currPin.zoom}
                    stroke="blue"
                    strokeWidth="0.1"
                    strokeDasharray="1 1"
                    markerEnd="url(#arrowhead)"
                  />
                </svg>
              );
            })()} */}

            {pins.map((pin, index) => {
              if (Math.abs(index + 0.5 - focusedIndex) > 1) return null;

              return (
                <Link
                key={pin.id}
                href={pin.link}
                className="absolute"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                }}
              >
                <div className="relative"
                  style={{
                    transform: `scale(${1 / focusedPin.zoom})`,
                    transformOrigin: 'center',
                  }}
                  >
                  {/* Pin dot (centered) */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white transition transform -translate-x-1/2 -translate-y-1/2
                      ${index === focusedIndex ? 'bg-green-500 scale-125 z-50' : 'bg-red-600'}`}
                  />

                  {/* Label to the right of the pin */}
              <div className="absolute right-full top-1/2 -translate-y-5 -translate-x-3 ml-2 px-2 py-1 text-xs bg-black text-white rounded-lg shadow-md whitespace-nowrap">
                {pin.label}
              </div>
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}