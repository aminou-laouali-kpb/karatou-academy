"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function GlossaryTooltip({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-medium text-blue-600 underline decoration-dotted underline-offset-2"
      >
        {term}
      </button>
      {open && (
        <span
          role="tooltip"
          className={cn(
            "absolute left-0 top-full z-20 mt-1 block w-64 rounded-md border border-gray-100 bg-white p-3 text-sm font-normal text-gray-700 shadow-md",
          )}
        >
          {definition}
        </span>
      )}
    </span>
  );
}
