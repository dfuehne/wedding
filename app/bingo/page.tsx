"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar/navbar";

type SessionMode = "existing" | "new";

type Challenge = {
	challengeID: string;
	displayName: string;
	title: string;
	description: string;
};

type SessionRecord = {
	name: string;
	seed: string;
};

function parseCsv(text: string) {
	const rows: string[][] = [];
	let row: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const character = text[index];
		const nextCharacter = text[index + 1];

		if (inQuotes) {
			if (character === '"' && nextCharacter === '"') {
				current += '"';
				index += 1;
			} else if (character === '"') {
				inQuotes = false;
			} else {
				current += character;
			}
			continue;
		}

		if (character === '"') {
			inQuotes = true;
			continue;
		}

		if (character === ",") {
			row.push(current);
			current = "";
			continue;
		}

		if (character === "\n") {
			row.push(current);
			if (row.some((value) => value.trim().length > 0)) {
				rows.push(row);
			}
			row = [];
			current = "";
			continue;
		}

		if (character !== "\r") {
			current += character;
		}
	}

	if (current.length > 0 || row.length > 0) {
		row.push(current);
		if (row.some((value) => value.trim().length > 0)) {
			rows.push(row);
		}
	}

	return rows;
}

function hashString(value: string) {
	let hash = 0;

	for (let index = 0; index < value.length; index += 1) {
		hash = Math.imul(31, hash) + value.charCodeAt(index);
		hash |= 0;
	}

	return hash >>> 0;
}

function createSeededRandom(seed: string) {
	let state = hashString(seed) || 1;

	return () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		return (state >>> 0) / 4294967296;
	};
}

function shuffleWithSeed<T>(items: T[], seed: string) {
	const random = createSeededRandom(seed);
	const shuffled = [...items];

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1));
		const current = shuffled[index]!;
		shuffled[index] = shuffled[swapIndex]!;
		shuffled[swapIndex] = current;
	}

	return shuffled;
}

function buildBoard(challenges: Challenge[], seed: string) {
	if (challenges.length !== 25) {
		throw new Error(`Expected 25 bingo challenges, received ${challenges.length}.`);
	}

	const centerChallenge = challenges[0];
	const sideChallenges = shuffleWithSeed(challenges.slice(1), `zd-wedding-bingo-board-v1:${seed}`);
	const board = new Array<Challenge>(25);
	const centerIndex = 12;

	board[centerIndex] = centerChallenge!;

	let challengeIndex = 0;
	for (let boardIndex = 0; boardIndex < board.length; boardIndex += 1) {
		if (boardIndex === centerIndex) {
			continue;
		}

		board[boardIndex] = sideChallenges[challengeIndex]!;
		challengeIndex += 1;
	}

	return board;
}

function parseChallenges(csvText: string) {
	return parseCsv(csvText)
		.map(([challengeID, displayName, title, description]) => ({
			challengeID: challengeID?.trim() ?? "",
			displayName: displayName?.trim() ?? "",
			title: title?.trim() ?? "",
			description: description?.trim() ?? "",
		}))
		.filter((challenge) => challenge.challengeID && challenge.displayName && challenge.title && challenge.description);
}

export default function BingoPage() {
	const challengeUploadRef = useRef<HTMLInputElement | null>(null);
	const [sessionMode, setSessionMode] = useState<SessionMode | null>(null);
	const [sessionReady, setSessionReady] = useState(false);
	const [sessionName, setSessionName] = useState("");
	const [sessionSeed, setSessionSeed] = useState("");
	const [selectedSession, setSelectedSession] = useState("");
	const [sessionSearch, setSessionSearch] = useState("");
	const [newSessionName, setNewSessionName] = useState("");
	const [existingSessions, setExistingSessions] = useState<SessionRecord[]>([]);
	const [sessionsLoaded, setSessionsLoaded] = useState(false);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
	const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([]);
	const [completedChallengePhotos, setCompletedChallengePhotos] = useState<Record<string, string>>({});
	const [uploadingChallengeId, setUploadingChallengeId] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState("");
	const [message, setMessage] = useState("Choose a session to view the bingo board.");

	useEffect(() => {
		if (!errorMessage) {
			return;
		}

		const timeout = window.setTimeout(() => {
			setErrorMessage("");
		}, 4500);

		return () => window.clearTimeout(timeout);
	}, [errorMessage]);

	const loadSessions = async () => {
		try {
			const response = await fetch("/api/bingoUpload");
			if (!response.ok) {
				throw new Error("Failed to load sessions");
			}

			const data = (await response.json()) as { sessions?: SessionRecord[] };
			const sessions = (data.sessions ?? []).filter((session) => Boolean(session.name) && Boolean(session.seed));
			setExistingSessions(sessions);
			return sessions;
		} catch (error) {
			console.error(error);
			setMessage("Could not load existing sessions.");
			return [] as SessionRecord[];
		} finally {
			setSessionsLoaded(true);
		}
	};

	const loadCompletedChallenges = async (activeSessionName: string) => {
		try {
			const response = await fetch(`/api/bingoUpload?session=${encodeURIComponent(activeSessionName)}`);

			if (!response.ok) {
				throw new Error("Failed to load completed challenges");
			}

			const data = (await response.json()) as {
				completedChallengeIds?: string[];
				completedChallengePhotos?: Array<{ challengeID: string; url: string }>;
			};
			setCompletedChallengeIds(data.completedChallengeIds ?? []);
			setCompletedChallengePhotos(
				Object.fromEntries((data.completedChallengePhotos ?? []).map(({ challengeID, url }) => [challengeID, url]))
			);
		} catch (error) {
			console.error(error);
			setCompletedChallengeIds([]);
			setCompletedChallengePhotos({});
		}
	};

	useEffect(() => {
		const savedMode = window.sessionStorage.getItem("bingo-session-mode") as SessionMode | null;
		const savedSession = window.sessionStorage.getItem("bingo-session-name");

		if (savedMode && savedSession) {
			setSessionMode(savedMode);
			setSessionName(savedSession);
			setSelectedSession(savedSession);
			setSessionSearch(savedSession);
		}

		void (async () => {
			const sessions = await loadSessions();
			if (savedSession) {
				const savedRecord = sessions.find((session) => session.name === savedSession);
				if (savedRecord) {
					setSessionSeed(savedRecord.seed);
					setSessionReady(true);
					setMessage(`Hello ${savedSession}!`);
				}
			} else if (sessions.length > 0) {
				const firstSession = sessions[0];
				if (firstSession) {
					setSelectedSession(firstSession.name);
					setSessionSearch(firstSession.name);
				}
			}
		})();
	}, []);

	useEffect(() => {
		if (!sessionReady || !sessionName) {
			setCompletedChallengeIds([]);
			setCompletedChallengePhotos({});
			return;
		}

		void loadCompletedChallenges(sessionName);
	}, [sessionName, sessionReady]);

	const startExistingSession = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!selectedSession) {
			setMessage("Choose a session from the list.");
			return;
		}

		const selectedRecord = existingSessions.find((session) => session.name === selectedSession);

		if (!selectedRecord) {
			setMessage("That session could not be found. Refresh and try again.");
			return;
		}

		window.sessionStorage.setItem("bingo-session-mode", "existing");
		window.sessionStorage.setItem("bingo-session-name", selectedSession);
		setSessionMode("existing");
		setSessionName(selectedSession);
		setSessionSeed(selectedRecord.seed);
		setSessionReady(true);
		setMessage(`Hello ${selectedSession}!`);
	};

	const startNewSession = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const trimmedName = newSessionName.trim();
		const normalizedName = trimmedName.toLowerCase();
		const existingNameMatches = existingSessions.some((session) => session.name.toLowerCase() === normalizedName);

		if (!trimmedName) {
			setMessage("Please enter a session name to continue.");
			return;
		}

		if (existingNameMatches) {
			setErrorMessage("That session already exists. Pick a different name or use the existing session.");
			return;
		}

		setMessage("Creating session folder...");

		void (async () => {
			try {
				const formData = new FormData();
				formData.append("action", "create-folder");
				formData.append("name", trimmedName);

				const response = await fetch("/api/bingoUpload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					if (response.status === 409) {
						setErrorMessage("That session already exists. Pick a different name or use the existing session.");
						return;
					}

					throw new Error("Folder creation failed");
				}

				const data = (await response.json()) as { seed?: string };
				const createdSeed = data.seed ?? "";

				window.sessionStorage.setItem("bingo-session-mode", "new");
				window.sessionStorage.setItem("bingo-session-name", trimmedName);
				setSessionMode("new");
				setSessionName(trimmedName);
				setSessionSeed(createdSeed);
				setSessionReady(Boolean(createdSeed));
				setErrorMessage("");
				setNewSessionName("");
				setSessionSearch(trimmedName);
				setMessage(`Hello ${trimmedName}!`);
				void loadSessions();
			} catch (error) {
				console.error(error);
				setMessage("Could not create the session folder. Please try again.");
			}
		})();
	};

	const clearSession = () => {
		window.sessionStorage.removeItem("bingo-session-mode");
		window.sessionStorage.removeItem("bingo-session-name");
		setSessionMode(null);
		setSessionReady(false);
		setSessionName("");
		setSessionSeed("");
		setSelectedSession("");
		setSessionSearch("");
		setNewSessionName("");
		setChallenges([]);
		setSelectedChallenge(null);
		setCompletedChallengeIds([]);
		setCompletedChallengePhotos({});
		setUploadingChallengeId("");
		setErrorMessage("");
		setMessage("Session cleared. Choose an option to begin.");
	};

	const goBackToSessionChooser = () => {
		setSessionMode(null);
		setSessionReady(false);
		setSessionName("");
		setSessionSeed("");
		setSelectedSession("");
		setSessionSearch("");
		setNewSessionName("");
		setChallenges([]);
		setSelectedChallenge(null);
		setCompletedChallengeIds([]);
		setCompletedChallengePhotos({});
		setUploadingChallengeId("");
		setErrorMessage("");
		setMessage("Choose a session to view the bingo board.");
	};

	const matchingSessions = useMemo(() => {
		const query = sessionSearch.trim().toLowerCase();

		if (!query) {
			return existingSessions.slice(0, 3);
		}

		return existingSessions.filter((session) => session.name.toLowerCase().includes(query)).slice(0, 3);
	}, [existingSessions, sessionSearch]);

	useEffect(() => {
		if (!sessionReady) {
			setChallenges([]);
			return;
		}

		async function loadChallenges() {
			const response = await fetch("/bingoChallenges.csv");
			const csvText = await response.text();

			setChallenges(parseChallenges(csvText));
		}

		void loadChallenges();
	}, [sessionReady]);

	const board = useMemo(() => {
		if (!sessionReady || challenges.length !== 25 || !sessionSeed) {
			return [];
		}

		return buildBoard(challenges, sessionSeed);
	}, [challenges, sessionReady, sessionSeed]);

	const completedChallengeSet = useMemo(() => new Set(completedChallengeIds), [completedChallengeIds]);

	const openChallengeUpload = () => {
		if (!selectedChallenge || uploadingChallengeId) {
			return;
		}

		challengeUploadRef.current?.click();
	};

	const handleChallengePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file || !selectedChallenge || !sessionName) {
			event.target.value = "";
			return;
		}

		setUploadingChallengeId(selectedChallenge.challengeID);
		setMessage(`Uploading photo for ${selectedChallenge.displayName}...`);

		try {
			const formData = new FormData();
			formData.append("action", "upload-challenge-photo");
			formData.append("name", sessionName);
			formData.append("challengeID", selectedChallenge.challengeID);
			formData.append("file", file);

			const response = await fetch("/api/bingoUpload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Challenge photo upload failed");
			}

			await loadCompletedChallenges(sessionName);
			setMessage(`Uploaded photo for ${selectedChallenge.displayName}.`);
		} catch (error) {
			console.error(error);
			setMessage("Upload failed. Please try again.");
		} finally {
			setUploadingChallengeId("");
			event.target.value = "";
		}
	};

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setSelectedChallenge(null);
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(246,238,226,0.98)_40%,_rgba(238,228,211,1))] px-4 pb-12 pt-20 text-stone-900 sm:px-6 lg:px-8">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
					<section className="rounded-[2rem] border border-white/70 bg-white/75 px-5 py-6 shadow-[0_18px_60px_rgba(94,68,34,0.12)] backdrop-blur sm:px-8">
						<h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Z&D Wedding Bingo</h1>
						<p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 sm:text-base">{message}</p>
					</section>

					{!sessionsLoaded ? null : !sessionReady ? (
						<>
							{sessionMode === null ? (
								<div className="space-y-4 rounded-[2rem] border border-white/70 bg-white/80 px-5 py-6 shadow-[0_18px_60px_rgba(94,68,34,0.08)] sm:px-8">
									<p className="text-sm font-medium text-stone-700">Do you want to continue an existing session or start a new one?</p>
									<div className="flex flex-col gap-3 sm:flex-row">
										<button type="button" onClick={() => setSessionMode("existing")} className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700">
											Select existing session
										</button>
										<button type="button" onClick={() => setSessionMode("new")} className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100">
											Start new session
										</button>
									</div>
								</div>
							) : null}

							{sessionMode === "existing" ? (
								<form onSubmit={startExistingSession} className="space-y-4 rounded-[2rem] border border-white/70 bg-white/80 px-5 py-6 shadow-[0_18px_60px_rgba(94,68,34,0.08)] sm:px-8">
									<label className="block text-sm font-medium text-stone-700" htmlFor="existing-session">Search existing sessions</label>
									<div className="space-y-3">
										<input
											id="existing-session"
											type="text"
											value={sessionSearch}
											onChange={(event) => {
												const nextValue = event.target.value;
												setSessionSearch(nextValue);
												setSelectedSession(existingSessions.find((session) => session.name.toLowerCase() === nextValue.trim().toLowerCase())?.name ?? "");
											}}
											placeholder="Search for a session"
											className="w-full rounded-full border border-stone-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-stone-400"
										/>
										<div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
											<p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Top matches</p>
											<div className="grid gap-2">
												{matchingSessions.length > 0 ? (
													matchingSessions.map((session) => (
														<button
															key={session.name}
															type="button"
															onClick={() => {
																setSelectedSession(session.name);
																setSessionSearch(session.name);
															}}
															className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${selectedSession === session.name ? "border-emerald-400 bg-emerald-50 text-emerald-950 shadow-sm" : "border-stone-200 bg-white text-stone-800 hover:border-emerald-300 hover:bg-emerald-50"}`}
														>
															<div className="flex items-center justify-between gap-3">
																<span>{session.name}</span>
																{selectedSession === session.name ? (
																	<span className="rounded-full bg-emerald-200 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-emerald-950">Selected</span>
																) : null}
															</div>
														</button>
													))
												) : (
													<p className="px-1 py-2 text-sm text-stone-500">No matching sessions found.</p>
												)}
											</div>
										</div>
										<div className="flex flex-col gap-3 sm:flex-row">
											<button type="submit" className="inline-flex items-center justify-center rounded-full bg-amber-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-600">Use session</button>
											<button type="button" onClick={goBackToSessionChooser} className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100">Back</button>
										</div>
									</div>
								</form>
							) : null}

							{sessionMode === "new" ? (
								<form onSubmit={startNewSession} className="space-y-4 rounded-[2rem] border border-white/70 bg-white/80 px-5 py-6 shadow-[0_18px_60px_rgba(94,68,34,0.08)] sm:px-8">
									<label className="block text-sm font-medium text-stone-700" htmlFor="new-session">Name the new session</label>
									<div className="flex flex-col gap-3 sm:flex-row">
										<input id="new-session" type="text" value={newSessionName} onChange={(event) => setNewSessionName(event.target.value)} placeholder="New session name" className="w-full rounded-full border border-stone-200 bg-white px-5 py-3 text-sm outline-none ring-0 transition placeholder:text-stone-400 focus:border-stone-400" />
										<button type="submit" className="inline-flex items-center justify-center rounded-full bg-amber-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-600">Start session</button>
										<button type="button" onClick={goBackToSessionChooser} className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100">Back</button>
									</div>
									{errorMessage ? (
										<p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert" aria-live="assertive">
											{errorMessage}
										</p>
									) : null}
								</form>
							) : null}
						</>
					) : null}

					{sessionReady ? (
						<>
							<section className="rounded-[2rem] border border-white/70 bg-white/75 px-5 py-6 shadow-[0_18px_60px_rgba(94,68,34,0.12)] backdrop-blur sm:px-8">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Bingo Board For {sessionName}</p>
										<p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 sm:text-base">Find your square, click for the challenge details.</p>
									</div>
									<button type="button" onClick={clearSession} className="rounded-full border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100">Change session</button>
								</div>
							</section>

							<section className="grid gap-3 sm:grid-cols-5">
								{board.length === 25 ? (
									board.map((challenge, index) => {
										const isCenter = index === 12;
										const isCompleted = completedChallengeSet.has(challenge.challengeID);
										return (
											<button
												key={`${challenge.challengeID}-${index}`}
												type="button"
												onClick={() => setSelectedChallenge(challenge)}
												className={`group flex min-h-28 flex-col justify-between rounded-3xl border px-4 py-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${isCompleted ? "border-emerald-400 bg-emerald-100 text-emerald-950" : isCenter ? "border-amber-500 bg-amber-100 text-amber-950" : "border-stone-200 bg-white/90 text-stone-900"}`}
												aria-label={`Open challenge details for ${challenge.displayName}`}
											>
												<span className="mt-3 text-lg font-semibold leading-snug sm:text-xl">{challenge.displayName}</span>
												<span className={`mt-4 text-xs font-medium uppercase tracking-[0.25em] ${isCompleted ? "text-emerald-700" : "text-stone-400"}`}>{isCompleted ? "Completed" : "Tap for details"}</span>
											</button>
										);
									})
								) : (
									<div className="col-span-5 rounded-3xl border border-dashed border-stone-300 bg-white/70 px-6 py-10 text-center text-stone-600">Loading bingo challenges...</div>
								)}
							</section>
						</>
					) : null}
				</div>

				{selectedChallenge ? (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm" role="presentation" onClick={() => setSelectedChallenge(null)}>
						<div className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-[2rem] border border-white/60 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="bingo-challenge-title" aria-describedby="bingo-challenge-description" onClick={(event) => event.stopPropagation()}>
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Challenge</p>
									<h2 id="bingo-challenge-title" className="mt-2 text-2xl font-bold text-stone-900">{selectedChallenge.title}</h2>
									{completedChallengeSet.has(selectedChallenge.challengeID) ? (
										<p className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-800">
											Completed
										</p>
									) : null}
								</div>
								<button type="button" onClick={() => setSelectedChallenge(null)} className="rounded-full border border-stone-200 px-3 py-1 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900">Close</button>
							</div>

							<p id="bingo-challenge-description" className="mt-5 text-base leading-7 text-stone-700">{selectedChallenge.description}</p>

							<div className="mt-6 flex flex-col gap-3">
								{completedChallengePhotos[selectedChallenge.challengeID] ? (
									<div className="flex justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
										<img
											src={completedChallengePhotos[selectedChallenge.challengeID]}
											alt={`${selectedChallenge.displayName} upload`}
											className="max-h-[34vh] w-auto max-w-full object-contain sm:max-h-[38vh]"
										/>
									</div>
								) : null}
								<button
									type="button"
									onClick={openChallengeUpload}
									disabled={Boolean(uploadingChallengeId)}
									className="inline-flex items-center justify-center rounded-full bg-amber-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{uploadingChallengeId === selectedChallenge.challengeID ? "Uploading..." : completedChallengeSet.has(selectedChallenge.challengeID) ? "Replace photo" : "Upload photo"}
								</button>
							</div>

							<input ref={challengeUploadRef} type="file" accept="image/*" capture="environment" onChange={handleChallengePhotoChange} className="hidden" />
						</div>
					</div>
				) : null}
			</main>
		</>
	);
}