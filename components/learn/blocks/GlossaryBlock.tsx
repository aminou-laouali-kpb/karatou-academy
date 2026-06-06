"use client";

import { BookMarked } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { GlossaryTooltip } from "@/components/glossary/GlossaryTooltip";
import { localizedString } from "@/lib/content";
import type { GlossaryTerm, Language } from "@/lib/supabase/types";

export function GlossaryBlock({ terms }: { terms: GlossaryTerm[] }) {
  const locale = useLocale() as Language;
  const t = useTranslations("learn");

  return (
    <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-blue-600">
        <BookMarked className="h-5 w-5" /> {t("glossary_terms")}
      </div>
      <div className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <GlossaryTooltip
            key={term.id}
            term={localizedString(term, "term", locale)}
            definition={localizedString(term, "definition", locale)}
          />
        ))}
      </div>
    </div>
  );
}
