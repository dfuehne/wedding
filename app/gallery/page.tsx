import { Button } from 'components/Button/Button';
import { transformGeoJson } from '@/lib/utilsClient';
import type { FeatureCollection } from 'geojson';
import GalleryClient from './GalleryClient'; 

async function fetchData(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default async function GalleryPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Fetch all the data the client will need
  const statesWithImages = await fetchData(`${baseUrl}/api/statesWithImages`);
  const italyGeoRaw: FeatureCollection = await fetchData(`${baseUrl}/italy.geo.json`);
  const belizeGeoRaw: FeatureCollection = await fetchData(`${baseUrl}/belize.geo.json`);
  
  // Perform the transformation on the server
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
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Wedding Logo"
          className="mx-auto mb-6 w-32 h-auto"
        />
        <h1 className="mb-4 max-w-2xl mx-auto text-2xl leading-none font-extrabold tracking-tight md:text-3xl xl:text-4xl">
          Gallery: Click on a Highlighted State!
        </h1>
      </div>

      {/* Render the Client Component, passing all the data it needs.
        The Client Component looks almost identical to your original file.
      */}
      <GalleryClient
        initialStatesWithImages={statesWithImages}
        initialItalyGeo={italyGeo}
        initialBelizeGeo={belizeGeo}
      />
    </div>
  );
}