import { NextResponse } from 'next/server';
import { getPhotosForState } from '@/lib/photos';

export async function GET(
  request: Request,
  context: { params: { state: string } }
) {
  const { state } = context.params;
  if (!state) {
    return NextResponse.json({ error: 'state is required' }, { status: 400 });
  }

  const photos = getPhotosForState(state);

  return NextResponse.json(photos);
}