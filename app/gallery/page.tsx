'use client';

import { useEffect, useState } from 'react';
import { Button } from 'components/Button/Button';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export default function GalleryPage() {
  const [statesWithImages, setStatesWithImages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/statesWithImages')
      .then((res) => res.json())
      .then((data: unknown) => {
        if (
          Array.isArray(data) &&
          data.every((item) => typeof item === 'string')
        ) {
          setStatesWithImages(data);
        } else {
          console.error('Invalid data format for statesWithImages:', data);
        }
      })
      .catch((err) => console.error('Error loading states:', err));
  }, []);

  const goToState = (stateName: string) => {
    const slug = stateName.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/states/${slug}`;
  };

  return (
    <div>
      <div className="mb-6">
        <Button href="/" className="mr-3">
          ← Back
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Gallery: Click on a Green State!</h1>

      <ComposableMap
        projection="geoAlbersUsa"
        width={800}
        height={500}
        style={{ maxWidth: '50%', height: 'auto' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const slug = stateName.toLowerCase().replace(/\s+/g, '-');
              const hasImages = statesWithImages.includes(slug);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => hasImages && goToState(stateName)}
                  style={{
                    default: {
                      fill: hasImages ? '#a8e6a3' : '#DDD',
                      stroke: '#FFF',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: hasImages ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: hasImages ? '#82ca9d' : '#CCC',
                      stroke: '#FFF',
                      strokeWidth: 1,
                      outline: 'none',
                    },
                    pressed: {
                      fill: hasImages ? '#69c0a8' : '#BBB',
                      outline: 'none',
                    },
                  }}
                  tabIndex={hasImages ? 0 : -1}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}