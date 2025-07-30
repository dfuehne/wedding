'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatClueName } from '@/lib/utilsClient'

type ApiResponse = { files: string[] } | { error: string };
type View = 'clue' | 'supp';

export default function CluePage(){
  const { clue } = useParams<{ clue: string }>();
  const [imageList, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('clue'); // 👈 default to PDF

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/proposalClues/${clue}`, {
          cache: 'no-store', // or 'force-cache' if these won’t change
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as ApiResponse;
        if ('error' in data) throw new Error(data.error);
        if (!cancelled) setImages(data.files);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [clue]);

  const tabBtn = (active: boolean) =>
    `px-4 py-2 rounded-md text-sm font-medium border transition
     ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/proposal"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          ← Back
        </Link>

        <div role="tablist" aria-label="Clue content" className="space-x-2">
          <button
            role="tab"
            aria-selected={view === 'clue'}
            className={tabBtn(view === 'clue')}
            onClick={() => setView('clue')}
          >
            Clue
          </button>
          <button
            role="tab"
            aria-selected={view === 'supp'}
            className={tabBtn(view === 'supp')}
            onClick={() => setView('supp')}
          >
            Supplemental Material
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">{formatClueName(String(clue))}:</h1>

      {/* ==== CLUE (PDF) — styled like your <img> (rounded, shadow, responsive) ==== */}
      {view === 'clue' && (
        <div className="relative w-full max-w-4xl mx-auto">
        <img
          src={`/clues/${clue}/clue.pdf`}
          alt={`/clues/${clue}/clue.pdf`}
          className="w-full h-auto"
        />
        </div>
      )}

      {/* ==== SUPPLEMENTAL IMAGES ==== */}
      {view === 'supp' && (
        <div className="p-6">
          {loading && <p>Loading images…</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && !error && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageList.length > 0 ? (
                imageList.map((imgName) => (
                  <img
                    key={imgName}
                    src={`/clues/${clue}/supp/${imgName}`}
                    alt={`${clue} image ${imgName}`}
                    className="rounded shadow"
                    loading="lazy"
                  />
                ))
              ) : (
                <p>No images found for {String(clue)}.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}