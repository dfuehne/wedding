import { Button } from 'components/Button/Button';

export default async function ProposalPage() {
  const clueNums: number[] = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div>
      <div className="mb-6">
        <Button href="/" className="mr-3">
          ← Back
        </Button>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <ul className="space-y-4 text-center text-lg font-medium">
          {clueNums.map((clueNum) => (
            <li key={clueNum}>
              <Button href={`/proposalClues/clue-${clueNum}`} className="mr-3">
                Clue {clueNum}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
