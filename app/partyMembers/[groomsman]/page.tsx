import Link from 'next/link';
import { formatPersonName } from '@/lib/utilsClient'
import { getImageList } from '@/lib/utilsServer'

// This function runs on the server during build or request time
export async function generateStaticParams() {
  return [];
}

// ✅ Keep it inline-typed — no extra interface
export default async function GroomsmenPage({
  params,
}: {
  params: Promise<{ groomsman: string }>;
}) {
  const resolvedParams = await params;  // <-- await here!
  const groomsmanName = resolvedParams.groomsman;

  const imageList: string[] = await getImageList(`weddingParty/${groomsmanName}/`);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/party"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          ← Back
        </Link>
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          {formatPersonName(groomsmanName)}!
        </h1>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageList.length > 0 ? (
            imageList.map((imgName) => (
              <img
                key={imgName}
                src={`/weddingParty/${groomsmanName}/${imgName}`}
                alt={`${groomsmanName} image ${imgName}`}
                className="rounded shadow"
                loading="lazy"
              />
            ))
          ) : (
            <p>No images found for {groomsmanName}.</p>
          )}
        </div>
      </div>
    </div>
  );
}