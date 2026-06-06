import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { localizedString } from "@/lib/content";
import type { Language, Module } from "@/lib/supabase/types";

export async function ModuleCard({
  module,
  locale,
}: {
  module: Module;
  locale: Language;
}) {
  const t = await getTranslations();
  const title = localizedString(module, "title", locale);
  const description = localizedString(module, "description", locale);

  return (
    <Link href={`/modules/${module.slug}`} className="block">
      <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-blue-50">
          <BookOpen className="h-7 w-7 text-blue-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-bold text-gray-900">
              {title}
            </h3>
            {module.is_free_preview && (
              <Badge variant="gold">{t("modules.free_preview")}</Badge>
            )}
          </div>
          {description && (
            <p className="line-clamp-2 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
      </Card>
    </Link>
  );
}
