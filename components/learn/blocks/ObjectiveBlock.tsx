"use client";

import { Target } from "lucide-react";
import { useTranslations } from "next-intl";

export function ObjectiveBlock({
  content,
}: {
  content: Record<string, unknown> | null;
}) {
  const t = useTranslations("learn");
  const text = (content?.text as string) ?? "";

  return (
    <div className="rounded-lg bg-blue-900 p-6 text-white shadow-lg">
      <div className="mb-3 flex items-center gap-2 text-gold-400">
        <Target className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">
          {t("objective")}
        </span>
      </div>
      <p className="font-heading text-xl font-bold leading-snug">{text}</p>
    </div>
  );
}
