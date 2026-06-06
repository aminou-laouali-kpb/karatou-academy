"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";

export function PracticeBlock({
  content,
}: {
  content: Record<string, unknown> | null;
}) {
  const t = useTranslations("learn");
  const prompt = (content?.prompt as string) ?? "";
  const placeholder = (content?.placeholder as string) ?? "";
  const [value, setValue] = useState("");

  return (
    <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-blue-600">
        <Pencil className="h-5 w-5" />
        <span className="font-semibold">{t("practice")}</span>
      </div>
      <p className="text-gray-700">{prompt}</p>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
