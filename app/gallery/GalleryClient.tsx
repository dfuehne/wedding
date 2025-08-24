// app/gallery/GalleryClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import type { FeatureCollection } from 'geojson';

interface GalleryClientProps {
  initialStatesWithImages: string[];
  initialItalyGeo: FeatureCollection | null;
  initialBelizeGeo: FeatureCollection | null;
}

const geoUSUrl = '/usa.json';
const geoCanadaUrl = '/canada.topojson';
const provinces = [
  "Quebec", "Prince Edward Island", "British Columbia", "Nunavut",
  "Northwest Territories", "New Brunswick", "Nova Scotia", "Saskatchewan",
  "Alberta", "Newfoundland and Labrador", "Yukon", "Manitoba", "Ontario",
];
const italySlug = 'italy';
const belizeSlug = 'belize';

export default function GalleryClient({
  initialStatesWithImages,
  initialItalyGeo,
  initialBelizeGeo,
}: GalleryClientProps) {
  const statesWithImages = initialStatesWithImages;
  const italyGeo = initialItalyGeo;
  const belizeGeo = initialBelizeGeo;

  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const router = useRouter();

  const goToState = (stateName: string) => {
    const slug = stateName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/states/${slug}`);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPos({ x: event.clientX + 10, y: event.clientY + 10 });
  };

  const italyHasImages = statesWithImages.includes(italySlug);
  const belizeHasImages = statesWithImages.includes(belizeSlug);

  return (
    <>
      <ComposableMap
        projection="geoAlbersUsa"
        width={800}
        height={500}
        style={{ maxWidth: '100%', height: 'auto' }}
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
                      fill: hasImages ? 'var(--primary-color)' : '#DDD',
                      stroke: '#FFF',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: hasImages ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: hasImages ? 'var(--darker-primary-color)' : '#CCC',
                      stroke: '#FFF',
                      strokeWidth: 1,
                      outline: 'none',
                    },
                    pressed: {
                      fill: hasImages ? 'var(--primary-color)' : '#BBB',
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
                      fill: hasImages ? 'var(--primary-color)' : '#DDD',
                      stroke: '#FFF',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: hasImages ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: hasImages ? 'var(--darker-primary-color)' : '#CCC',
                      stroke: '#FFF',
                      strokeWidth: 1,
                      outline: 'none',
                    },
                    pressed: {
                      fill: hasImages ? 'var(--primary-color)' : '#BBB',
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
                            fill: italyHasImages ? 'var(--primary-color)' : '#DDD',
                            stroke: '#FFF',
                            strokeWidth: 0.5,
                            outline: 'none',
                            cursor: italyHasImages ? 'pointer' : 'default',
                        },
                        hover: {
                            fill: italyHasImages ? 'var(--darker-primary-color)' : '#CCC',
                            stroke: '#FFF',
                            strokeWidth: 1,
                            outline: 'none',
                        },
                        pressed: {
                            fill: italyHasImages ? 'var(--primary-color)' : '#BBB',
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
                            fill: belizeHasImages ? 'var(--primary-color)' : '#DDD',
                            stroke: '#FFF',
                            strokeWidth: 0.5,
                            outline: 'none',
                            cursor: belizeHasImages ? 'pointer' : 'default',
                        },
                        hover: {
                            fill: belizeHasImages ? 'var(--darker-primary-color)' : '#CCC',
                            stroke: '#FFF',
                            strokeWidth: 1,
                            outline: 'none',
                        },
                        pressed: {
                            fill: belizeHasImages ? 'var(--primary-color)' : '#BBB',
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
    </>
  );
}