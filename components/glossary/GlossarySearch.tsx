"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { localizedString } from "@/lib/content";
import type { GlossaryTerm, Language } from "@/lib/supabase/types";

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const locale = useLocale() as Language;
  const t = useTranslations("glossary");
  const [query, setQuery] = useState("");

  const localized = useMemo(
    () =>
      terms.map((term) => ({
        id: term.id,
        term: localizedString(term, "term", locale),
        definition: localizedString(term, "definition", locale),
      })),
    [terms, locale],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localized;
    return localized.filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q),
    );
  }, [localized, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          className="pl-10"
          aria-label={t("search_placeholder")}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">{t("no_results")}</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <Card className="p-4">
                <h3 className="font-heading text-base font-bold text-blue-700">
                  {item.term}
                </h3>
                <p className="mt-1 text-sm text-gray-700">{item.definition}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
