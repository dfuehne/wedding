import { NextResponse } from 'next/server';
import { getWeddingPartyWithInfo } from '@/lib/weddingPartyWithInfo';

export async function GET() {
  const people = getWeddingPartyWithInfo();
  return NextResponse.json(people);
}