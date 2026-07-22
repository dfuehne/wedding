"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar/navbar";

type SessionMode = "existing" | "new";

export default function BingoPage() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [sessionMode, setSessionMode] = useState<SessionMode | null>(null);
	const [sessionName, setSessionName] = useState("");
	const [selectedSession, setSelectedSession] = useState("");
	const [newSessionName, setNewSessionName] = useState("");
	const [existingSessions, setExistingSessions] = useState<string[]>([]);
	const [sessionsLoaded, setSessionsLoaded] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [message, setMessage] = useState(
		"Take a photo for the bingo board and send it to Firebase."
	);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

	useEffect(() => {
		const savedMode = window.sessionStorage.getItem("bingo-session-mode") as SessionMode | null;
		const savedSession = window.sessionStorage.getItem("bingo-session-name");

		if (savedMode && savedSession) {
			setSessionMode(savedMode);
			setSessionName(savedSession);
			setSelectedSession(savedSession);
			setMessage(`Welcome back to ${savedSession}.`);
		}

		async function loadSessions() {
			try {
				const response = await fetch("/api/bingoUpload");
				if (!response.ok) {
					throw new Error("Failed to load sessions");
				}

				const data = (await response.json()) as { sessions?: string[] };
				const sessions = data.sessions ?? [];
				setExistingSessions(sessions);
				if (!savedSession && sessions.length > 0) {
					const firstSession = sessions[0];
					if (firstSession) {
						setSelectedSession(firstSession);
					}
				}
			} catch (error) {
				console.error(error);
				setMessage("Could not load existing sessions.");
			} finally {
				setSessionsLoaded(true);
			}
		}

		loadSessions();
	}, []);

	const startExistingSession = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!selectedSession) {
			setMessage("Choose a session from the list.");
			return;
		}

		window.sessionStorage.setItem("bingo-session-mode", "existing");
		window.sessionStorage.setItem("bingo-session-name", selectedSession);
		setSessionMode("existing");
		setSessionName(selectedSession);
		setMessage(`Using existing session ${selectedSession}.`);
	};

	const startNewSession = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const trimmedName = newSessionName.trim();

		if (!trimmedName) {
			setMessage("Please enter a session name to continue.");
			return;
		}

		window.sessionStorage.setItem("bingo-session-mode", "new");
		window.sessionStorage.setItem("bingo-session-name", trimmedName);
		setSessionMode("new");
		setSessionName(trimmedName);
		setNewSessionName("");
		setMessage(`Started a new session: ${trimmedName}.`);
	};

	const clearSession = () => {
		window.sessionStorage.removeItem("bingo-session-mode");
		window.sessionStorage.removeItem("bingo-session-name");
		setSessionMode(null);
		setSessionName("");
		setSelectedSession("");
		setNewSessionName("");
		setUploadedUrl(null);
		setMessage("Session cleared. Choose an option to begin.");
	};

	const openCamera = () => {
		inputRef.current?.click();
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}

		setUploading(true);
		setMessage("Uploading photo...");
		setUploadedUrl(null);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("name", sessionName);

			const response = await fetch("/api/bingoUpload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload request failed");
			}

			const data = (await response.json()) as { url?: string };
			const url = data.url;

			if (!url) {
				throw new Error("Upload response did not include a file URL");
			}

			setUploadedUrl(url);
			setMessage("Photo uploaded successfully.");
		} catch (error) {
			console.error(error);
			setMessage("Upload failed. Please try again.");
		} finally {
			setUploading(false);
			event.target.value = "";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 text-slate-900">
			<Navbar />
			<main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-24">
				<section className="w-full rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
					<p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-700">
						Wedding Bingo
					</p>
					<h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
						Capture a moment and upload it.
					</h1>
					<p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
						Use your device camera to take a photo, then send it straight to Firebase Storage.
					</p>

					{!sessionsLoaded ? null : !sessionMode ? (
						<div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
							<p className="text-sm font-medium text-slate-700">
								Do you want to continue an existing session or start a new one?
							</p>
							<div className="flex flex-col gap-3 sm:flex-row">
								<button
									type="button"
									onClick={() => setSessionMode("existing")}
									className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
								>
									Select existing session
								</button>
								<button
									type="button"
									onClick={() => setSessionMode("new")}
									className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
								>
									Start new session
								</button>
							</div>
						</div>
					) : null}

					{sessionMode === "existing" ? (
						<form onSubmit={startExistingSession} className="mt-8 space-y-4">
							<label className="block text-sm font-medium text-slate-700" htmlFor="existing-session">
								Choose an existing session
							</label>
							<div className="flex flex-col gap-3 sm:flex-row">
								<select
									id="existing-session"
									value={selectedSession}
									onChange={(event) => setSelectedSession(event.target.value)}
									className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-slate-400"
								>
									{existingSessions.length > 0 ? null : (
										<option value="">No existing sessions found</option>
									)}
									{existingSessions.map((session) => (
										<option key={session} value={session}>
											{session}
										</option>
									))}
								</select>
								<button
									type="submit"
									className="inline-flex items-center justify-center rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-600"
								>
									Use session
								</button>
							</div>
						</form>
					) : null}

					{sessionMode === "new" ? (
						<form onSubmit={startNewSession} className="mt-8 space-y-4">
							<label className="block text-sm font-medium text-slate-700" htmlFor="new-session">
								Name the new session
							</label>
							<div className="flex flex-col gap-3 sm:flex-row">
								<input
									id="new-session"
									type="text"
									value={newSessionName}
									onChange={(event) => setNewSessionName(event.target.value)}
									placeholder="New session name"
									className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-400"
								/>
								<button
									type="submit"
									className="inline-flex items-center justify-center rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-600"
								>
									Start session
								</button>
							</div>
						</form>
					) : null}

					{sessionName ? (
						<div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
							<span>
								Using session <strong>{sessionName}</strong>
							</span>
							<button
								type="button"
								onClick={clearSession}
								className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-rose-100"
							>
								Change session
							</button>
						</div>
					) : null}

					<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
						<button
							type="button"
							onClick={openCamera}
							disabled={uploading || !sessionName}
							className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{uploading ? "Uploading..." : "Upload Photo"}
						</button>
						<p className="text-sm text-slate-500">
							{sessionName
								? "Camera will open on phones when available."
								: "Choose or create a session before uploading."}
						</p>
					</div>

					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						capture="environment"
						onChange={sessionName ? handleFileChange : undefined}
						className="hidden"
					/>

					<div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
						{message}
					</div>

					{uploadedUrl ? (
						<div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
							<img
								src={uploadedUrl}
								alt="Uploaded bingo photo"
								className="h-auto w-full object-cover"
							/>
							<div className="border-t border-emerald-200 p-4 text-sm text-emerald-900">
								Uploaded to Firebase Storage.
							</div>
						</div>
					) : null}
				</section>
			</main>
		</div>
	);
}
