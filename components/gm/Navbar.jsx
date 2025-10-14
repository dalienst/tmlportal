"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

function GMNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <nav className="bg-sidebar text-sidebar-foreground shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold text-primary">
          TML | General Manager
        </span>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <Link href="/gm" className="hover:text-accent transition-colors">
              Dashboard
            </Link>
            <Link
              href="/gm/centers"
              className="hover:text-accent transition-colors"
            >
              Centers
            </Link>
            {/* Placeholder for future links */}
          </div>
          <button
            onClick={handleLogout}
            className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-opacity-90 transition-colors md:px-6 md:py-2"
          >
            Logout
          </button>
          <button
            className="md:hidden text-black focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-sidebar p-4">
          <div className="flex flex-col space-y-2">
            <Link
              href="/gm"
              className="hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/gm/centers"
              className="hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Centers
            </Link>
            {/* Placeholder for future links */}
          </div>
        </div>
      )}
    </nav>
  );
}

export default GMNavbar;
