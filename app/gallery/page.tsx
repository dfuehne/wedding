'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'components/Button/Button';


export default function Contact() {
    const router = useRouter();
    return (


        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="self-start mb-6">
                <Button onClick={() => router.back()}>
                    ← Back
                </Button>
            </div>
        </div>
    );
}