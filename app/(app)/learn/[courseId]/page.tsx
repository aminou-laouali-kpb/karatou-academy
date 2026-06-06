import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { getCourseBundle, getNextCourse, isSupabaseConfigured } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function LearnPage({
  params,
}: {
  params: { courseId: string };
}) {
  const bundle = await getCourseBundle(params.courseId);
  if (!bundle) notFound();

  const next = await getNextCourse(
    bundle.module.id,
    bundle.course.order_index,
  );

  let initialIndex = 0;
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("user_progress")
        .select("last_block_index")
        .eq("user_id", user.id)
        .eq("course_id", params.courseId)
        .maybeSingle();
      const row = data as { last_block_index: number } | null;
      initialIndex = row?.last_block_index ?? 0;
    }
  }

  return (
    <LessonPlayer
      course={bundle.course}
      moduleSlug={bundle.module.slug}
      blocks={bundle.blocks}
      quizByBlock={bundle.quizByBlock}
      glossary={bundle.glossary}
      nextCourseId={next?.id ?? null}
      initialIndex={initialIndex}
    />
  );
}
