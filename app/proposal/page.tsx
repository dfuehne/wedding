import React, { Suspense } from 'react';
import ProposalClient from './proposalClient';
import Navbar from "@/components/Navbar/navbar";
import { Button } from 'components/Button/Button';

export default function ProposalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-screen">
            <Navbar />
            <main className="pt-14 p-6">
              <div className="mt-4 flex justify-start items-center">
                <Button href="/engagementPhotos" className="ml-3">
                  Just Show Me The Engagement Pictures
                </Button>
              </div>
              <ProposalClient />
            </main>
          </div>
    </Suspense>
  );
}