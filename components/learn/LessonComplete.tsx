"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function LessonComplete({
  moduleSlug,
  nextCourseId,
}: {
  moduleSlug: string;
  nextCourseId: string | null;
}) {
  const t = useTranslations("learn");

  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <div className="flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 className="h-14 w-14 text-success" />
      </div>
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-black text-gray-900">
          {t("lesson_complete")}
        </h2>
        <p className="text-gray-500">{t("lesson_complete_body")}</p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        {nextCourseId ? (
          <Link href={`/learn/${nextCourseId}`}>
            <Button className="w-full">{t("next_lesson")}</Button>
          </Link>
        ) : null}
        <Link href={`/modules/${moduleSlug}`}>
          <Button variant="outline" className="w-full">
            {t("back_to_module")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
