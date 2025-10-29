"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-[var(--primary-color)] text-[var(--background-color)] flex items-center px-4 shadow z-50">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col justify-between w-6 h-5 focus:outline-none"
        >
          <span className="block w-full h-0.5 bg-[var(--background-color)]"></span>
          <span className="block w-full h-0.5 bg-[var(--background-color)]"></span>
          <span className="block w-full h-0.5 bg-[var(--background-color)]"></span>
        </button>

        {/* Logo / Title */}
        <h1 className="ml-4 text-lg font-bold">Z & D</h1>
      </nav>

      {/* Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[rbga(0,0,0,0)] z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--primary-color)] text-[var(--background-color)] z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--background-color)] text-2xl leading-none focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Nav Links */}
        <ul className="p-4 space-y-2">
          <li>
            <Link href="/" className="block px-2 py-1 hover:bg-[var(--darker-primary-color)] rounded">
              Home
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="block px-2 py-1 hover:bg-[var(--darker-primary-color)] rounded">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/proposal" className="block px-2 py-1 hover:bg-[var(--darker-primary-color)] rounded">
              Proposal
            </Link>
          </li>
          <li>
            <Link href="/venue" className="block px-2 py-1 hover:bg-[var(--darker-primary-color)] rounded">
              Venue
            </Link>
          </li>
          <li>
            <Link href="/travel" className="block px-2 py-1 hover:bg-[var(--darker-primary-color)] rounded">
              Travel & Accommodations
            </Link>
          </li>
          <li>
            <Link href="/story" className="block px-2 py-1 hover:bg-[var(--darker-primary-color)] rounded">
              Our Story
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
