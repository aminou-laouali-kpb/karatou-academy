"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

interface TextCard {
  heading?: string;
  body?: string;
}

export function TextBlock({
  content,
}: {
  content: Record<string, unknown> | null;
}) {
  const locale = useLocale();
  const cards = (content?.cards as TextCard[]) ?? [];
  const [speaking, setSpeaking] = useState(false);

  function toggleSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = cards
      .map((c) => `${c.heading ?? ""}. ${c.body ?? ""}`)
      .join(". ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === "en" ? "en-US" : "fr-FR";
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleSpeech}
          aria-label="Écouter"
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-blue-50"
        >
          {speaking ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          Audio
        </button>
      </div>
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="space-y-2 p-5">
            {card.heading && (
              <h3 className="font-heading text-lg font-bold text-gray-900">
                {card.heading}
              </h3>
            )}
            {card.body && <p className="text-gray-700">{card.body}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
