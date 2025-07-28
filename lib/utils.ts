import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

type Coordinates = number[] | Coordinates[];

function transformCoordinates(
  coords: Coordinates,
  translateX: number,
  translateY: number,
  scale: number
): Coordinates {
  if (Array.isArray(coords) && typeof coords[0] === 'number') {
    const [x, y] = coords as number[];
    if (typeof x === 'number' && typeof y === 'number') {
      return [(x + translateX) * scale, (y + translateY) * scale];
    } else {
      throw new Error('Invalid coordinate pair');
    }
  } else {
    return (coords as Coordinates[]).map((c) =>
      transformCoordinates(c, translateX, translateY, scale)
    );
  }
}

export function transformGeoJson(
  geoJson: FeatureCollection<Geometry, GeoJsonProperties>,
  translateX: number,
  translateY: number,
  scale = 1
): FeatureCollection<Geometry, GeoJsonProperties> {
  const transformed = JSON.parse(JSON.stringify(geoJson)) as FeatureCollection<Geometry, GeoJsonProperties>;

  for (const feature of transformed.features) {
    const geometry = feature.geometry;

    // Skip GeometryCollection since it does not have `coordinates`
    if (geometry.type !== 'GeometryCollection') {
      // @ts-expect-error: We know the type isn't GeometryCollection so coordinates will exist
      geometry.coordinates = transformCoordinates(
        geometry.coordinates,
        translateX,
        translateY,
        scale
      );
    }
  }

  return transformed;
}


export function formatStateName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatPersonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatClueName(name: string): string {
  return formatStateName(name);
}


