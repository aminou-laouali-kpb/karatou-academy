import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, PlayCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getModuleBySlug } from "@/lib/data";
import { localizedString } from "@/lib/content";
import type { Language } from "@/lib/supabase/types";

export default async function ModuleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const locale = (await getLocale()) as Language;
  const t = await getTranslations();
  const data = await getModuleBySlug(params.slug);
  if (!data) notFound();

  const { module, courses } = data;
  const title = localizedString(module, "title", locale);
  const description = localizedString(module, "description", locale);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {module.is_free_preview && (
            <Badge variant="gold">{t("modules.free_preview")}</Badge>
          )}
          <Badge variant="neutral">
            {courses.length} {t("modules.lessons")}
          </Badge>
        </div>
        <h1 className="font-heading text-2xl font-black text-gray-900">{title}</h1>
        {description && <p className="text-gray-700">{description}</p>}
      </div>

      <ol className="space-y-3">
        {courses.map((course, index) => (
          <li key={course.id}>
            <Link href={`/learn/${course.id}`} className="block">
              <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-mono-data text-sm font-medium text-blue-700">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900">
                    {localizedString(course, "title", locale)}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration_minutes} {t("common.minutes")}
                  </p>
                </div>
                <PlayCircle className="h-6 w-6 shrink-0 text-blue-500" />
              </Card>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
