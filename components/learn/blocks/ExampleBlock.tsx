"use client";

import { Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function ExampleBlock({
  content,
}: {
  content: Record<string, unknown> | null;
}) {
  const heading = (content?.heading as string) ?? "";
  const body = (content?.body as string) ?? "";
  const amount = content?.amount as number | undefined;

  return (
    <div className="rounded-lg border-l-4 border-gold-400 bg-gold-50 p-5">
      <div className="mb-2 flex items-center gap-2 text-gold-600">
        <Lightbulb className="h-5 w-5" />
        {heading && <span className="font-semibold">{heading}</span>}
      </div>
      <p className="text-gray-700">{body}</p>
      {typeof amount === "number" && (
        <p className="mt-3 font-mono-data text-lg font-medium text-gold-600">
          {formatCurrency(amount, "XOF")}
        </p>
      )}
    </div>
  );
}
