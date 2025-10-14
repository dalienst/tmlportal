"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-6 px-4">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
        <Image
          className="mx-auto mb-6"
          src="/logo.png"
          alt="Tamarind Logo"
          width={100}
          height={100}
        />
        <svg
          className="mx-auto mb-4 text-accent w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-semibold text-black mb-4">Thank You!</h1>
        <p className="text-muted-foreground mb-6">
          Your feedback has been successfully submitted. We appreciate your time
          and input.
        </p>
        <Link
          href="https://www.tamarind.co.ke"
          target="_blank"
          className="inline-block bg-accent text-accent-foreground px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Visit Tamarind Website
        </Link>
      </div>
    </div>
  );
}

export default SuccessPage;
