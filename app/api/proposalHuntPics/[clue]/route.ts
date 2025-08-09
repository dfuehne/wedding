 import { NextResponse } from 'next/server';
 import { getImageList } from '@/lib/utilsServer';
 
 export const runtime = 'nodejs';
 
 export async function GET(req: Request, ctx: { params: Promise<{ clue: string }> }) {
   try {
     const { clue } = await ctx.params; // ✅ await params first
     const files = await getImageList(`clues/${clue}/pics`);
     return NextResponse.json({ files });
   } catch (err) {
     const msg = err instanceof Error ? err.message : String(err);
     return NextResponse.json({ error: msg }, { status: 500 });
   }
 }