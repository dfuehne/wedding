import React, { Suspense } from 'react';
import ProposalClient from './proposalClient';

export default function ProposalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProposalClient />
    </Suspense>
  );
}