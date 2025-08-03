import { Button } from "components/Button/Button"
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
        <Button href="/party" className="mr-3">
          ← Back
        </Button>
      </div>
      <div className="p-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <img
            src="../logo.png"
            alt="Wedding Logo"
            className="mx-auto mb-6 w-32 h-auto"
          />
          <h1 className="mb-4 max-w-2xl mx-auto text-2xl leading-none font-extrabold tracking-tight md:text-3xl xl:text-4xl">
            {formatPersonName(groomsmanName)}!
          </h1>
        </div>

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