import { getLocale, getTranslations } from "next-intl/server";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { getPublishedModules } from "@/lib/data";
import type { Language } from "@/lib/supabase/types";

export default async function ModulesPage() {
  const locale = (await getLocale()) as Language;
  const t = await getTranslations();
  const modules = await getPublishedModules();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-black text-gray-900">
          {t("modules.title")}
        </h1>
        <p className="text-sm text-gray-500">{t("modules.subtitle")}</p>
      </div>

      {modules.length === 0 ? (
        <p className="text-gray-500">{t("modules.empty")}</p>
      ) : (
        <div className="space-y-3">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
