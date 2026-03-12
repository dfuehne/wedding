'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Navbar from "@/components/Navbar/navbar";
import Link from "next/link";

type Person = {
  first: string;
  last: string;
  attending: number;
  rsvpId: string;
};

type Party = {
  id: string;
  partyName: string;
  people: Person[];
  securityQuestion: string;
  securityQuestionAnswer: string;
};

type PartyResponseItem = {
  id: string;
  partyName: string;
  people?: Person[];
  securityQuestion?: string;
  securityQuestionAnswer?: string;
};

export default function RSVP() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [party, setParty] = useState<Party | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  //const [answer, setAnswer] = useState('');
  //const [verified, setVerified] = useState(false);
  //const [answerError, setAnswerError] = useState('');

  // Search for a specific party
  const handleSearch = async () => {
    //setVerified(false);
    setSubmitted(false);
    setError('');
    setParty(null);
    try {
      const res = await fetch('/api/searchRSVP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (!res.ok) {
        setError('No party found');
        return;
      }

      const data = (await res.json()) as PartyResponseItem;
      const partyWithId: Party = {
          id: data.id,
          partyName: data.partyName,
          people: data.people || [],
          securityQuestion: data.securityQuestion  || '',
          securityQuestionAnswer: data.securityQuestionAnswer  || '',
        };

      setParty(partyWithId);
    } catch (err) {
      console.error(err);
      setError('Error fetching party');
    }
  };

  // Update local attendance when selecting radio
  const handleSelectChange = (rsvpId: string, value: number) => {
    if (!party) return;
    const updatedPeople = party.people.map(p =>
      p.rsvpId === rsvpId ? { ...p, attending: value } : p
    );
    setParty({ ...party, people: updatedPeople });
  };

  // Submit the form to Firestore
  const handleSubmit = async () => {
    if (!party?.id) return;
    setLoading(true);
    try {
      const partyRef = doc(db, 'rsvp', party.id);
      await updateDoc(partyRef, { people: party.people });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Error submitting RSVP');
    } finally {
      setLoading(false);
    }
  };

//   const verifyAnswer = async (inputAnswer: string, actualAnswer: string ) => {

//   if (inputAnswer.trim().toLowerCase() === actualAnswer.trim().toLowerCase()) {
//     setVerified(true);
//     setAnswerError('');
//   } else {
//     setAnswerError('Wrong answer. Try again.');
//   }
//     setAnswer('');
//     return;
// };

  return (
    <div>
      <Navbar/>
      <main className="pt-14 p-6">
        <div className="mx-auto place-self-center">
            {/* Logo */}
            <img
              src="logo.png"
              alt="Wedding Logo"
              className="mx-auto mb-6 w-32 h-auto"
            />
        </div>
<div className="text-center">
  <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl xl:text-4xl">
    RSVP Form
  </h1>

  <p className="mt-2 text-xl font-medium">
    Please enter the first and last name of one member of your party to rsvp for the whole group!
  </p>

  <div className="mt-6 flex flex-col items-center gap-4">
    <input
      className="border border-[var(--primary-color)] px-3 py-2 w-64"
      placeholder="First Name"
      value={firstName}
      onChange={e => setFirstName(e.target.value)}
    />

    <input
      className="border border-[var(--primary-color)] px-3 py-2 w-64"
      placeholder="Last Name"
      value={lastName}
      onChange={e => setLastName(e.target.value)}
    />

    <button
      onClick={handleSearch}
      className="rounded bg-[var(--primary-color)] px-6 py-2 font-semibold text-[var(--background-color)] hover:opacity-90"
    >
      Search
    </button>
  </div>


          {error && <p style={{ color: 'red' }}>{error}</p>}

          {party && (
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl xl:text-4xl">
                {party.partyName}
              </h1>

              {/* {party && !verified && (
                <div>
                  <p className="mt-2 text-xl font-medium"> 
                    Security Question:
                  </p>
                  <p className="mt-2 text-xl font-medium"> 
                    {party.securityQuestion}
                  </p>
                  <input
                    className="border border-[var(--primary-color)] px-3 py-2 pr-10"
                    placeholder="Your answer"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                  <button
                      className="rounded bg-[var(--primary-color)] ml-2 px-4 py-2 font-semibold text-[var(--background-color)] hover:opacity-90"
                      onClick={() =>
                        verifyAnswer(answer, party.securityQuestionAnswer)
                      }
                    >
                      Continue
                    </button>
                </div>
              )} */}

              {/* {answerError && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>
                  {answerError}
                </p>
              )} */}

              {!submitted && (
                <div>
                  <p className="mt-2 text-xl font-medium"/> 
                <form
                  onSubmit={e => {
                  e.preventDefault();
                  handleSubmit();
                }}
                >
                  {party.people.map(member => (
                    <div key={member.rsvpId} style={{ marginBottom: '0.5rem' }}>
                       <span>
                          {member.first} {member.last !== "Plus 1" && member.last}
                        </span>
                      <label style={{ marginLeft: '0.5rem' }}>
                        <input
                          type="radio"
                          name={member.rsvpId}
                          value={0}
                          checked={member.attending === 0}
                          onChange={() => handleSelectChange(member.rsvpId, 0)}
                        /> Not Attending
                      </label>

                      <label style={{ marginLeft: '0.5rem' }}>
                        <input
                          type="radio"
                          name={member.rsvpId}
                          value={1}
                          checked={member.attending === 1}
                          onChange={() => handleSelectChange(member.rsvpId, 1)}
                        /> Attending
                      </label>
                    </div>
                  ))}

                  <button className="rounded bg-[var(--primary-color)] ml-2 px-4 py-2 font-semibold text-[var(--background-color)] hover:opacity-90" 
                          type="submit" 
                          disabled={loading} 
                          style={{ marginTop: '1rem' }}>
                    {loading ? 'Submitting...' : 'Submit RSVP'}
                  </button>
                </form>
              </div>
            )}
            {submitted && (
              <div className="mt-4 text-center text-xl font-medium">
                Thanks for submitting your RSVP! Check out our{" "}
                <Link
                  href="/registry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Registry
                </Link>
                !
              </div>
            )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
