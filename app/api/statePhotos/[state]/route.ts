import { NextResponse } from 'next/server';
import { getPhotosForState } from '@/lib/photos';

export async function GET(request: Request): Promise<Response> {
  // Parse the URL to extract the `[state]` segment
  const url = new URL(request.url);
  const parts = url.pathname.split('/'); // e.g. ["", "api", "statePhotos", "california"]
  const state = parts[parts.length - 1]; // last segment is [state]

  if (!state) {
    return NextResponse.json({ error: 'state is required' }, { status: 400 });
  }

  const photos = getPhotosForState(state);
  return NextResponse.json(photos);
}
