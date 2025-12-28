import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

type SearchRequest = {
  firstName: string;
  lastName: string;
};

type PartyDoc = {
  partyName: string;
  people?: {
    first: string;
    last: string;
    attending: number;
    rsvpId: string;
  }[];
  securityQuestion: string;
  securityQuestionAnswer: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SearchRequest;
    const { firstName, lastName } = body;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    if (firstName.toLowerCase() === "plus" && lastName.toLowerCase() === "one") {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (firstName.toLowerCase() === "plus 1" || lastName.toLowerCase() === "plus 1") {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const snapshot = await adminDb.collection('rsvp').get();

    for (const doc of snapshot.docs) {
      const data = doc.data() as PartyDoc;
      const party = {
        id: doc.id,
        ...data,
      };

      const person = party.people?.find(
        (p) =>
          p.first.toLowerCase() === firstName.toLowerCase() &&
          p.last.toLowerCase() === lastName.toLowerCase()
      );

      if (person) {
        return NextResponse.json({
          id: party.id,
          partyName: party.partyName,
          people: party.people,
          securityQuestion: party.securityQuestion,
          securityQuestionAnswer: party.securityQuestionAnswer,
        });
      }
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    console.error('RSVP API ERROR:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
