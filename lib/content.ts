import type { BlockType, Language } from "@/lib/supabase/types";

/** Strict ordering of the 8-step lesson loop. */
export const STEP_ORDER: BlockType[] = [
  "objective",
  "video",
  "text",
  "example",
  "practice",
  "quiz",
  "reflection",
  "glossary_highlight",
];

export const BLOCK_LABEL: Record<BlockType, { fr: string; en: string; ha: string }> = {
  objective: { fr: "Objectif", en: "Objective", ha: "Manufa" },
  video: { fr: "Vidéo", en: "Video", ha: "Bidiyo" },
  text: { fr: "Cours", en: "Lesson", ha: "Darasi" },
  example: { fr: "Exemple", en: "Example", ha: "Misali" },
  practice: { fr: "Pratique", en: "Practice", ha: "Aiki" },
  quiz: { fr: "Quiz", en: "Quiz", ha: "Tambayoyi" },
  reflection: { fr: "Réflexion", en: "Reflection", ha: "Tunani" },
  glossary_highlight: { fr: "Glossaire", en: "Glossary", ha: "Ƙamus" },
};

/**
 * Pick a localized field (e.g. `title`) from a record carrying `_fr/_en/_ha`
 * suffixed columns. Falls back to French when the requested language is empty,
 * and reports whether a fallback occurred so the UI can show a banner.
 */
export function pickLocalized<T = string>(
  record: object,
  base: string,
  locale: Language,
): { value: T | null; isFallback: boolean } {
  const rec = record as Record<string, unknown>;
  const primary = rec[`${base}_${locale}`];
  if (primary !== null && primary !== undefined && primary !== "") {
    return { value: primary as T, isFallback: false };
  }
  const fr = rec[`${base}_fr`];
  return {
    value: (fr ?? null) as T | null,
    isFallback: locale !== "fr" && fr !== null && fr !== undefined,
  };
}

/** Convenience for required string fields where French is always present. */
export function localizedString(
  record: object,
  base: string,
  locale: Language,
): string {
  return (pickLocalized<string>(record, base, locale).value ?? "") as string;
}

/** Extract a YouTube video id from common URL shapes. */
export function youTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return /^[\w-]{11}$/.test(url) ? url : null;
}
