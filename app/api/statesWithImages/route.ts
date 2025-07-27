import { NextResponse } from 'next/server';
import { getStatesWithImages } from '@/lib/statesWithImages';

export async function GET() {
  const states = getStatesWithImages();
  return NextResponse.json(states);
}