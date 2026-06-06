"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { pickLocalized, localizedString } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ObjectiveBlock } from "@/components/learn/blocks/ObjectiveBlock";
import { VideoBlock } from "@/components/learn/blocks/VideoBlock";
import { TextBlock } from "@/components/learn/blocks/TextBlock";
import { ExampleBlock } from "@/components/learn/blocks/ExampleBlock";
import { PracticeBlock } from "@/components/learn/blocks/PracticeBlock";
import { QuizBlock } from "@/components/learn/blocks/QuizBlock";
import { ReflectionBlock } from "@/components/learn/blocks/ReflectionBlock";
import { GlossaryBlock } from "@/components/learn/blocks/GlossaryBlock";
import { LessonComplete } from "@/components/learn/LessonComplete";
import type {
  ContentBlock,
  Course,
  GlossaryTerm,
  Language,
  QuizQuestion,
} from "@/lib/supabase/types";

const SUPABASE_READY = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

interface LessonPlayerProps {
  course: Course;
  moduleSlug: string;
  blocks: ContentBlock[];
  quizByBlock: Record<string, QuizQuestion[]>;
  glossary: GlossaryTerm[];
  nextCourseId: string | null;
  initialIndex: number;
}

export function LessonPlayer({
  course,
  moduleSlug,
  blocks,
  quizByBlock,
  glossary,
  nextCourseId,
  initialIndex,
}: LessonPlayerProps) {
  const locale = useLocale() as Language;
  const t = useTranslations();
  const [index, setIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, blocks.length - 1)),
  );
  const [completed, setCompleted] = useState(false);

  const saveProgress = useCallback(
    async (blockIndex: number, status: "in_progress" | "completed") => {
      if (!SUPABASE_READY) return;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          course_id: course.id,
          last_block_index: blockIndex,
          status,
          completed_at: status === "completed" ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,course_id" },
      );
    },
    [course.id],
  );

  // Persist position whenever it advances.
  useEffect(() => {
    if (!completed) void saveProgress(index, "in_progress");
  }, [index, completed, saveProgress]);

  if (blocks.length === 0) {
    return <p className="text-gray-500">{t("modules.empty")}</p>;
  }

  if (completed) {
    return (
      <LessonComplete moduleSlug={moduleSlug} nextCourseId={nextCourseId} />
    );
  }

  const block = blocks[index];
  const isLast = index === blocks.length - 1;
  const localizedContent = pickLocalized<Record<string, unknown>>(
    block,
    "content",
    locale,
  );
  const content = localizedContent.value;

  function renderBlock() {
    switch (block.block_type) {
      case "objective":
        return <ObjectiveBlock content={content} />;
      case "video":
        return <VideoBlock content={content} />;
      case "text":
        return <TextBlock content={content} />;
      case "example":
        return <ExampleBlock content={content} />;
      case "practice":
        return <PracticeBlock content={content} />;
      case "quiz":
        return <QuizBlock questions={quizByBlock[block.id] ?? []} />;
      case "reflection":
        return <ReflectionBlock blockId={block.id} content={content} />;
      case "glossary_highlight": {
        const ids = (content?.term_ids as string[] | undefined) ?? [];
        const terms = ids.length
          ? glossary.filter((g) => ids.includes(g.id))
          : glossary;
        return <GlossaryBlock terms={terms} />;
      }
      default:
        return null;
    }
  }

  function goNext() {
    if (isLast) {
      void saveProgress(index, "completed");
      setCompleted(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href={`/modules/${moduleSlug}`}
          aria-label={t("learn.back_to_module")}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-base font-bold text-gray-900">
            {localizedString(course, "title", locale)}
          </p>
        </div>
        <span className="font-mono-data text-sm text-gray-500">
          {index + 1}/{blocks.length}
        </span>
      </div>

      <Progress value={((index + 1) / blocks.length) * 100} />

      {localizedContent.isFallback && (
        <div className="flex items-center gap-2 rounded-md bg-gold-50 p-3 text-sm text-gold-600">
          <Info className="h-4 w-4 shrink-0" />
          {t("learn.not_available_lang")}
        </div>
      )}

      <div className="min-h-[200px]">{renderBlock()}</div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="ghost"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <ArrowLeft className="h-5 w-5" /> {t("learn.previous_step")}
        </Button>
        <Button onClick={goNext}>
          {isLast ? t("common.continue") : t("learn.next_step")}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
