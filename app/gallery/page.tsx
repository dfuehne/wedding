import { Button } from 'components/Button/Button';
import { transformGeoJson } from '@/lib/utilsClient';
import type { FeatureCollection } from 'geojson';
import GalleryClient from './GalleryClient'; 
import { getStatesWithImages } from '@/lib/statesWithImages';
import italyGeoRawJson from '@/public/italy.geo.json';
import belizeGeoRawJson from '@/public/belize.geo.json';

export default async function GalleryPage() {
  // Get the data directly — no fetch needed
  const statesWithImages = getStatesWithImages(); // await if async

  // Transform the geo data on the server
  const italyGeoRaw = italyGeoRawJson as FeatureCollection;
  const belizeGeoRaw = belizeGeoRawJson as FeatureCollection;
  const italyGeo = transformGeoJson(italyGeoRaw, -140.0, 8.0, 0.6);
  const belizeGeo = transformGeoJson(belizeGeoRaw, 0.5, 11.5, 1.0);

  return (
    <div style={{ position: 'relative' }}>
      <div className="mb-6">
        <Button href="/" className="mr-3">
          ← Back
        </Button>
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <img
          src="/logo.png"
          alt="Wedding Logo"
          className="mx-auto mb-6 w-32 h-auto"
        />
        <h1 className="mb-4 max-w-2xl mx-auto text-2xl leading-none font-extrabold tracking-tight md:text-3xl xl:text-4xl">
          Gallery: Click on a Highlighted State!
        </h1>
      </div>

      <GalleryClient
        initialStatesWithImages={statesWithImages}
        initialItalyGeo={italyGeo}
        initialBelizeGeo={belizeGeo}
      />
    </div>
  );
}
