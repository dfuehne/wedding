'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "components/Button/Button"
import { formatClueName } from '@/lib/utilsClient'

type ApiResponse = { files: string[] } | { error: string };
type View = 'clue' | 'supp' | 'pics';

export default function CluePage(){
  const { clue } = useParams<{ clue: string }>();
  const [suppList, setSupp] = useState<string[]>([]);
  const [picList, setPics] = useState<string[]>([]);
  const [suppError, setSuppError] = useState<string | null>(null);
  const [picsError, setPicsError] = useState<string | null>(null);
  const [suppLoading, setSuppLoading] = useState(true);
  const [picsLoading, setPicsLoading] = useState(true);
  const [view, setView] = useState<View>('clue'); // 👈 default to PDF

  useEffect(() => {
    let cancelled = false;
    async function loadSupp() {
      setSuppLoading(true);
      try {
        const resSupp = await fetch(`/api/proposalClues/${clue}`, {
          cache: 'no-store', // or 'force-cache' if these won’t change
        });
        if (!resSupp.ok) throw new Error(`HTTP ${resSupp.status}`);
        const dataSupp = (await resSupp.json()) as ApiResponse;
        if ('error' in dataSupp) throw new Error(dataSupp.error);
        if (!cancelled) setSupp(dataSupp.files);

      } catch (e) {
        if (!cancelled) setSuppError((e as Error).message);
      } finally {
        if (!cancelled) setSuppLoading(false);
      }
    }
    loadSupp();
    return () => {
      cancelled = true;
    };
  }, [clue]);

  useEffect(() => {
    let cancelled = false;
    async function loadPics() {
      setPicsLoading(true);
      try {
        const resPics = await fetch(`/api/proposalHuntPics/${clue}`, {
          cache: 'no-store', // or 'force-cache' if these won’t change
        });
        if (!resPics.ok) throw new Error(`HTTP ${resPics.status}`);
        const dataPics = (await resPics.json()) as ApiResponse;
        if ('error' in dataPics) throw new Error(dataPics.error);
        if (!cancelled) setPics(dataPics.files);

      } catch (e) {
        if (!cancelled) setPicsError((e as Error).message);
      } finally {
        if (!cancelled) setPicsLoading(false);
      }
    }
    loadPics();
    return () => {
      cancelled = true;
    };
  }, [clue]);

  const tabBtn = (active: boolean) =>
    `px-4 py-2 rounded-md text-sm font-medium border transition
     ${active ? 'bg-[rgb(122,82,85)] text-[rgb(247,242,237)]' : 'text-[rgb(122,82,85)] border-[rgb(122,82,85)] hover:bg-gray-100'}`;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button href={`/proposal?focusedClue=${clue}`} className="mr-3">
          ← Back
        </Button>

        <div role="tablist" aria-label="Clue content" className="space-x-2">
          <button
            role="tab"
            aria-selected={view === 'clue'}
            className={tabBtn(view === 'clue')}
            onClick={() => setView('clue')}
          >
            Clue
          </button>
          
          {suppList.length > 0 && (
            <button
              role="tab"
              aria-selected={view === 'supp'}
              className={tabBtn(view === 'supp')}
              onClick={() => setView('supp')}
            >
              Supplemental Material
            </button>
          )}

          {picList.length > 0 && (
            <button
              role="tab"
              aria-selected={view === 'pics'}
              className={tabBtn(view === 'pics')}
              onClick={() => setView('pics')}
            >
              Action Pics!
            </button>
          )}


        </div>
      </div>
              <div className="mx-auto max-w-3xl text-center">
                {/* Logo */}
                <img
                  src="../logo.png"
                  alt="Wedding Logo"
                  className="mx-auto mb-6 w-32 h-auto"
                  />
                <h1 className="mb-4 max-w-2xl mx-auto text-2xl leading-none font-extrabold tracking-tight md:text-3xl xl:text-4xl">
                  {formatClueName(String(clue))}:
                </h1>
              </div>

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
          {suppLoading && <p>Loading images…</p>}
          {suppError && <p className="text-red-600">Error: {suppError}</p>}
          {!suppLoading && !suppError && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-4">
              {suppList.length > 0 ? (
                suppList.map((imgName) => (
                  <img
                    key={imgName}
                    src={`/clues/${clue}/supp/${imgName}`}
                    alt={`${clue} image ${imgName}`}
                    className="rounded shadow"
                    style={{ width: '100%', height: 'auto'}}
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

      {/* ==== ACTUAL IMAGES ==== */}
      {view === 'pics' && (
        <div className="p-6">
          {picsLoading && <p>Loading images…</p>}
          {picsError && <p className="text-red-600">Error: {picsError}</p>}
          {!picsLoading && !picsError && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-4">
              {picList.length > 0 ? (
                picList.map((imgName) => (
                  <img
                    key={imgName}
                    src={`/clues/${clue}/pics/${imgName}`}
                    alt={`${clue} image ${imgName}`}
                    className="rounded shadow"
                    style={{ width: '100%', height: 'auto'}}
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