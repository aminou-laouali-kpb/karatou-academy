import { getTranslations } from "next-intl/server";
import { GlossarySearch } from "@/components/glossary/GlossarySearch";
import { getGlossary } from "@/lib/data";

export default async function GlossaryPage() {
  const t = await getTranslations("glossary");
  const terms = await getGlossary();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-black text-gray-900">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>
      <GlossarySearch terms={terms} />
    </div>
  );
}
