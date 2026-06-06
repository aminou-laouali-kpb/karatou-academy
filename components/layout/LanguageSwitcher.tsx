"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/i18n/request";
import { cn } from "@/lib/utils/cn";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "fr", label: "FR" },
  { value: "en", label: "EN" },
  { value: "ha", label: "HA" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const active = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function change(locale: Locale) {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white p-1"
      aria-label="Language switcher"
    >
      {!compact && <Globe className="ml-1 h-4 w-4 text-gray-500" aria-hidden />}
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={isPending}
          onClick={() => change(opt.value)}
          aria-pressed={active === opt.value}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            active === opt.value
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-gray-100",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
