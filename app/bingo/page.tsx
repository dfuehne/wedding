"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar/navbar";

export default function BingoPage() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [guestName, setGuestName] = useState("");
	const [nameInput, setNameInput] = useState("");
	const [nameLoaded, setNameLoaded] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [message, setMessage] = useState(
		"Take a photo for the bingo board and send it to Firebase."
	);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

	useEffect(() => {
		const savedName = window.sessionStorage.getItem("bingo-guest-name");
		if (savedName) {
			setGuestName(savedName);
			setMessage(`Welcome back, ${savedName}.`);
		}
		setNameLoaded(true);
	}, []);

	const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const trimmedName = nameInput.trim();

		if (!trimmedName) {
			setMessage("Please enter your name to continue.");
			return;
		}

		window.sessionStorage.setItem("bingo-guest-name", trimmedName);
		setGuestName(trimmedName);
		setNameInput("");
		setMessage(`Welcome, ${trimmedName}. You can start uploading photos.`);
	};

	const clearName = () => {
		window.sessionStorage.removeItem("bingo-guest-name");
		setGuestName("");
		setMessage("Session name cleared. Please log in again.");
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
			formData.append("name", guestName);

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

					{!nameLoaded ? null : !guestName ? (
						<form onSubmit={handleNameSubmit} className="mt-8 space-y-4">
							<label className="block text-sm font-medium text-slate-700" htmlFor="guest-name">
								Enter your name to start
							</label>
							<div className="flex flex-col gap-3 sm:flex-row">
								<input
									id="guest-name"
									type="text"
									value={nameInput}
									onChange={(event) => setNameInput(event.target.value)}
									placeholder="Your name"
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
					) : (
						<div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
							<span>
								Logged in as <strong>{guestName}</strong>
							</span>
							<button
								type="button"
								onClick={clearName}
								className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-rose-100"
							>
								Change name
							</button>
						</div>
					)}

					<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
						<button
							type="button"
							onClick={openCamera}
							disabled={uploading || !guestName}
							className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{uploading ? "Uploading..." : "Upload Photo"}
						</button>
						<p className="text-sm text-slate-500">
							{guestName
								? "Camera will open on phones when available."
								: "Log in with your name before uploading."}
						</p>
					</div>

					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						capture="environment"
						onChange={guestName ? handleFileChange : undefined}
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
