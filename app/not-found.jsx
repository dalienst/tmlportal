"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="mb-4 rounded-full bg-white p-6 shadow-sm">
        <FileQuestion className="h-12 w-12 text-primary" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mb-8 max-w-[500px] text-gray-500">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved, deleted, or doesn't exist.
      </p>
      <Button asChild>
        <Link href="/" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
