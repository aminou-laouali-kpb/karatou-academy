"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { pickLocalized } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import type { Language, QuizQuestion } from "@/lib/supabase/types";

const SUPABASE_READY = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export function QuizBlock({ questions }: { questions: QuizQuestion[] }) {
  const locale = useLocale() as Language;
  const t = useTranslations("learn");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  async function answer(question: QuizQuestion, index: number) {
    if (answers[question.id] !== undefined) return; // lock after first answer
    setAnswers((prev) => ({ ...prev, [question.id]: index }));

    if (SUPABASE_READY) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_quiz_answers").insert({
          user_id: user.id,
          question_id: question.id,
          selected_index: index,
          is_correct: index === question.correct_index,
        });
      }
    }
  }

  return (
    <div className="space-y-5">
      {questions.map((question) => {
        const q = pickLocalized<string>(question, "question", locale).value ?? "";
        const options =
          pickLocalized<string[]>(question, "options", locale).value ?? [];
        const explanation =
          pickLocalized<string>(question, "explanation", locale).value ?? "";
        const selected = answers[question.id];
        const answered = selected !== undefined;
        const isCorrect = selected === question.correct_index;

        return (
          <div
            key={question.id}
            className="space-y-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="font-medium text-gray-900">{q}</p>
            <div className="space-y-2">
              {options.map((option, index) => {
                const isAnswer = index === question.correct_index;
                const isPicked = index === selected;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => answer(question, index)}
                    disabled={answered}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md border px-4 py-3 text-left text-sm transition-colors",
                      !answered && "border-gray-300 hover:border-blue-400 hover:bg-blue-50",
                      answered && isAnswer && "border-success bg-green-50",
                      answered && isPicked && !isAnswer && "border-error bg-red-50",
                      answered && !isAnswer && !isPicked && "border-gray-300 opacity-60",
                    )}
                  >
                    <span className="text-gray-900">{option}</span>
                    {answered && isAnswer && (
                      <Check className="h-4 w-4 text-success" />
                    )}
                    {answered && isPicked && !isAnswer && (
                      <X className="h-4 w-4 text-error" />
                    )}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div
                className={cn(
                  "rounded-md p-3 text-sm",
                  isCorrect ? "bg-green-50 text-success" : "bg-red-50 text-error",
                )}
              >
                <p className="font-medium">
                  {isCorrect ? t("quiz_correct") : t("quiz_wrong")}
                </p>
                {explanation && (
                  <p className="mt-1 text-gray-700">{explanation}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
