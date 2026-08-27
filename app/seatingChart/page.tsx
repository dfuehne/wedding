"use client";

import Navbar from "@/components/Navbar/navbar";
import { findTableByGuestName, parseSeatingChartCsv, rankGuestMatches, type SeatingTable } from "@/lib/seatingChart";
import { useEffect, useMemo, useState } from "react";

export default function SeatingChartPage() {
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGuestName, setSelectedGuestName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSeatingChart() {
      try {
        const response = await fetch("/seatingChart.csv");

        if (!response.ok) {
          throw new Error("Could not load seating chart");
        }

        const csvText = await response.text();
        const parsedTables = parseSeatingChartCsv(csvText);

        if (isMounted) {
          setTables(parsedTables);
          setError("");
        }
      } catch (loadError) {
        console.error(loadError);
        if (isMounted) {
          setError("We could not load the seating chart right now. Please refresh and try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadSeatingChart();

    return () => {
      isMounted = false;
    };
  }, []);

  const matches = useMemo(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    return rankGuestMatches(trimmedQuery, tables).slice(0, 8);
  }, [query, tables]);

  const selectedTable = useMemo(() => {
    if (!selectedGuestName) {
      return null;
    }

    return findTableByGuestName(selectedGuestName, tables);
  }, [selectedGuestName, tables]);

  const handleGuestSelect = (guestName: string) => {
    setQuery(guestName);
    setSelectedGuestName(guestName);
  };

  const handleReturnToSearch = () => {
    setSelectedGuestName("");
    setQuery("");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(246,238,226,0.98)_40%,_rgba(238,228,211,1))] px-4 pb-12 pt-24 text-stone-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-[2rem] border border-white/70 bg-white/80 px-5 py-6 shadow-[0_18px_60px_rgba(94,68,34,0.12)] backdrop-blur sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Guest lookup</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Find your seating chart</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700 sm:text-base">
              Search for your name to quickly find your table and see who else is sitting there.
            </p>
          </section>

          {!selectedGuestName ? (
            <section className="mt-6 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_rgba(94,68,34,0.08)] sm:p-8">
              <label htmlFor="guest-search" className="block text-sm font-medium text-stone-700">
                Search your name
              </label>
              <input
                id="guest-search"
                type="text"
                value={query}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setQuery(nextValue);

                  if (!nextValue.trim()) {
                    setSelectedGuestName("");
                  }
                }}
                placeholder="Type a guest name..."
                className="mt-3 w-full rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
              />

              {loading ? (
                <p className="mt-4 text-sm text-stone-500">Loading seating chart...</p>
              ) : error ? (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>
              ) : null}

              {query.trim() && matches.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Matching names</p>
                  <div className="grid gap-2">
                    {matches.map((match) => (
                      <button
                        key={`${match.name}-${match.tableNumber}`}
                        type="button"
                        onClick={() => handleGuestSelect(match.name)}
                        className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:border-amber-300 hover:bg-amber-50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{match.name}</span>
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone-700">
                            Table {match.tableNumber}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {query.trim() && !loading && matches.length === 0 && !error ? (
                <p className="mt-4 text-sm text-stone-500">No names match that search yet.</p>
              ) : null}
            </section>
          ) : null}

          {selectedTable ? (
            <section className="mt-6 rounded-[2rem] border border-amber-200 bg-amber-50/80 p-5 shadow-[0_18px_60px_rgba(94,68,34,0.08)] sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Selected guest</p>
                  <h2 className="mt-2 text-2xl font-bold text-stone-900">{selectedGuestName}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-900">
                    Table {selectedTable.tableNumber}
                  </div>
                  <button
                    type="button"
                    onClick={handleReturnToSearch}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-100"
                  >
                    Return to search
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-100 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">People at this table</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {selectedTable.guests.map((guest) => {
                    const parts = guest.trim().split(/\s+/);
                    const firstName = parts[0] ?? guest;
                    const lastName = parts.at(-1)?.toLowerCase() ?? "";
                    const displayName = (firstName !== "Mystery" && (lastName === "plus" || lastName === "1" || guest.toLowerCase().includes("plus 1"))) ? firstName : guest;

                    return (
                      <li
                        key={guest}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium ${guest === selectedGuestName ? "border-emerald-300 bg-emerald-50 text-emerald-950" : "border-stone-200 bg-stone-50 text-stone-800"}`}
                      >
                        {displayName}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
