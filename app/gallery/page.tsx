'use client';

import { useEffect, useState } from 'react';
import { Button } from 'components/Button/Button';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { transformGeoJson } from '@/lib/utilsClient';
import type { FeatureCollection } from 'geojson';


const geoUSUrl = 'usa.json';
const geoCanadaUrl = 'canada.topojson';

const provinces = [
  "Quebec",
  "Prince Edward Island",
  "British Columbia",
  "Nunavut",
  "Northwest Territories",
  "New Brunswick",
  "Nova Scotia",
  "Saskatchewan",
  "Alberta",
  "Newfoundland and Labrador",
  "Yukon",
  "Manitoba",
  "Ontario",
];

const italySlug = 'italy';
const belizeSlug = 'belize';

export default function GalleryPage() {
  const [statesWithImages, setStatesWithImages] = useState<string[]>([]);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPos({ x: event.clientX + 10, y: event.clientY + 10 });
  };

  const italyHasImages = statesWithImages.includes(italySlug);
  const belizeHasImages = statesWithImages.includes(belizeSlug);

  const [italyGeo, setItalyGeo] = useState<FeatureCollection | null>(null);
  const [belizeGeo, setBelizeGeo] = useState<FeatureCollection | null>(null);

    useEffect(() => {
    fetch('italy.geo.json')
        .then((res) => res.json())
        .then((data) => {
          const geoData = data as FeatureCollection;
          const transformed = transformGeoJson(geoData, -140.0, 8.0, 0.6);
          setItalyGeo(transformed);
        });
    }, []);

    useEffect(() => {
    fetch('belize.geo.json')
        .then((res) => res.json())
        .then((data) => {
          const geoData = data as FeatureCollection;
          const transformed = transformGeoJson(geoData, 0.5, 11.5, 1.0);
          setBelizeGeo(transformed);
});
    }, []);


  return (
    <div style={{ position: 'relative' }}>
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
        {/* US States */}
        <Geographies geography={geoUSUrl}>
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
                  onMouseEnter={(evt) => {
                    setTooltipContent(stateName);
                    handleMouseMove(evt);
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setTooltipContent(null)}
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

        {/* Canada Provinces */}
        <Geographies geography={geoCanadaUrl}>
          {({ geographies }) =>
            geographies.map((geo, i) => {
              const provName = provinces[i];
              if (!provName) return null;
              const slug = provName.toLowerCase().replace(/\s+/g, '-');
              const hasImages = statesWithImages.includes(slug);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => hasImages && goToState(provName)}
                  onMouseEnter={(evt) => {
                    setTooltipContent(provName);
                    handleMouseMove(evt);
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setTooltipContent(null)}
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
    {italyGeo && (
        <Geographies geography={italyGeo}>
            {({ geographies }) =>
            geographies.map((geo) => {
                console.log('Italy GeoJSON:', italyGeo); // ✅ This will now run
                return (
                <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => italyHasImages && goToState(italySlug)}
                    onMouseEnter={(evt) => {
                    setTooltipContent("Italy");
                    handleMouseMove(evt);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setTooltipContent(null)}
                    style={{
                    default: {
                        fill: italyHasImages ? '#a8e6a3' : '#DDD',
                        stroke: '#FFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: italyHasImages ? 'pointer' : 'default',
                    },
                    hover: {
                        fill: italyHasImages ? '#82ca9d' : '#CCC',
                        stroke: '#FFF',
                        strokeWidth: 1,
                        outline: 'none',
                    },
                    pressed: {
                        fill: italyHasImages ? '#69c0a8' : '#BBB',
                        outline: 'none',
                    },
                    }}
                    tabIndex={italyHasImages ? 0 : -1}
                />
                );
            })
            }
        </Geographies>
    
    )}
    {belizeGeo && (
        <Geographies geography={belizeGeo}>
            {({ geographies }) =>
            geographies.map((geo) => {
                return (
                <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => belizeHasImages && goToState(belizeSlug)}
                    onMouseEnter={(evt) => {
                    setTooltipContent("Belize");
                    handleMouseMove(evt);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setTooltipContent(null)}
                    style={{
                    default: {
                        fill: belizeHasImages ? '#a8e6a3' : '#DDD',
                        stroke: '#FFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: belizeHasImages ? 'pointer' : 'default',
                    },
                    hover: {
                        fill: belizeHasImages ? '#82ca9d' : '#CCC',
                        stroke: '#FFF',
                        strokeWidth: 1,
                        outline: 'none',
                    },
                    pressed: {
                        fill: belizeHasImages ? '#69c0a8' : '#BBB',
                        outline: 'none',
                    },
                    }}
                    tabIndex={belizeHasImages ? 0 : -1}
                />
                );
            })
            }
        </Geographies>
    
    )}

      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPos.y,
            left: tooltipPos.x,
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 4,
            pointerEvents: 'none',
            fontSize: 12,
            whiteSpace: 'nowrap',
            zIndex: 9999,
            userSelect: 'none',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}