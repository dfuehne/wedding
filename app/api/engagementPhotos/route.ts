import { list } from '@vercel/blob';

export async function GET() {
  try {
    const blobs = await list({
      token: "vercel_blob_rw_YzSrK1blZL8DuWgY_Dc0Lw47GWOj8OhxsMALAOKACEGtdXi",
    });
    return Response.json(blobs.blobs);
  } catch (err) {
    console.error("Error fetching blobs:", err);
    return new Response(JSON.stringify({ error: 'Failed to fetch blobs' }), { status: 500 });
  }
}