import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { getModuleBySlug, getPublishedModules } from "@/lib/data";
import { localizedString } from "@/lib/content";
import type { Language } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const locale = (await getLocale()) as Language;
  const t = await getTranslations();
  const modules = await getPublishedModules();

  const firstModule = modules[0];
  const firstBundle = firstModule
    ? await getModuleBySlug(firstModule.slug)
    : null;
  const resumeCourse = firstBundle?.courses[0] ?? null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">{t("dashboard.welcome")} 👋</p>
        <h1 className="font-heading text-2xl font-black text-gray-900">
          {t("app.name")}
        </h1>
      </div>

      {resumeCourse ? (
        <Card className="overflow-hidden border-0 bg-blue-900 text-white shadow-lg">
          <CardContent className="p-5">
            <p className="mb-1 text-sm text-blue-300">
              {t("dashboard.continue_learning")}
            </p>
            <h2 className="font-heading text-xl font-bold">
              {localizedString(resumeCourse, "title", locale)}
            </h2>
            <div className="mt-4">
              <Progress value={0} indicatorClassName="bg-gold-400" />
            </div>
            <Link href={`/learn/${resumeCourse.id}`} className="mt-4 inline-block">
              <Button variant="gold">
                <PlayCircle className="h-5 w-5" /> {t("dashboard.resume")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-3 p-5 text-center">
            <p className="text-gray-500">{t("dashboard.no_progress")}</p>
            <Link href="/modules">
              <Button>{t("dashboard.browse_modules")}</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-gray-900">
            {t("modules.title")}
          </h2>
          <Link
            href="/modules"
            className="flex items-center gap-1 text-sm font-medium text-blue-500"
          >
            {t("modules.title")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {modules.slice(0, 3).map((m) => (
            <ModuleCard key={m.id} module={m} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
