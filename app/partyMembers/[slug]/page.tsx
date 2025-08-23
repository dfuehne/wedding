import { Button } from "components/Button/Button"
import { getImageList } from '@/lib/utilsServer'
import { WeddingPartyMember } from '@/lib/weddingPartyMember'
import { getWeddingPartyWithInfo } from '@/lib/weddingPartyWithInfo';

export async function generateStaticParams() {
  const members = getWeddingPartyWithInfo();
  return members.map((m) => ({ slug: m.slug }));
}

// ✅ Keep it inline-typed — no extra interface
export default async function GroomsmenPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Note: Promise here
}) {
  const resolvedParams = await params;
  const personNameFromSlug = resolvedParams.slug;

  const data = getWeddingPartyWithInfo();

  const member = data.find((m: WeddingPartyMember) => m.slug === personNameFromSlug);

  if (!member) {
  return <div>Party member not found</div>;
  }
  const imageList: string[] = await getImageList(`weddingParty/${personNameFromSlug}/`);


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
            {member.name}!
          </h1>
          <p className="max-w-2xl mx-auto font-extrabold text-lg md:text-xl ">
            {member.role}, {member.relationship}, {member.age} Years Old
          </p>
          <p className="max-w-2xl mx-auto text-lg md:text-xl">
            {member.info}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
          {imageList.length > 0 ? (
            imageList.map((imgName) => (
              <img
                key={imgName}
                src={`/weddingParty/${personNameFromSlug}/${imgName}`}
                alt={`${personNameFromSlug} image ${imgName}`}
                className="rounded shadow"
                loading="lazy"
              />
            ))
          ) : (
            <p>No images found for {member.name}.</p>
          )}
        </div>
      </div>
    </div>
  );
}