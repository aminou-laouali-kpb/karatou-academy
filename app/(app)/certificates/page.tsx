import { getLocale, getTranslations } from "next-intl/server";
import { CertificateCard } from "@/components/certificates/CertificateCard";
import { isSupabaseConfigured } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { sampleCertificates, sampleModules } from "@/lib/sample-data";
import { localizedString } from "@/lib/content";
import type { Certificate, Language } from "@/lib/supabase/types";

export default async function CertificatesPage() {
  const locale = (await getLocale()) as Language;
  const t = await getTranslations("certificate");

  let rows: { certificate: Certificate; moduleTitle: string | null }[] = [];

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("certificates")
        .select("*, modules(title_fr, title_en, title_ha)")
        .eq("user_id", user.id);
      rows = (data ?? []).map((row) => {
        const r = row as unknown as Certificate & {
          modules: Record<string, unknown> | null;
        };
        return {
          certificate: r,
          moduleTitle: r.modules
            ? localizedString(r.modules, "title", locale)
            : null,
        };
      });
    }
  } else {
    rows = sampleCertificates.map((certificate) => {
      const mod = sampleModules.find((m) => m.id === certificate.module_id);
      return {
        certificate,
        moduleTitle: mod ? localizedString(mod, "title", locale) : null,
      };
    });
  }

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-black text-gray-900">
        {t("my_certificates")}
      </h1>
      {rows.length === 0 ? (
        <p className="text-gray-500">{t("no_certificates")}</p>
      ) : (
        <div className="space-y-3">
          {rows.map(({ certificate, moduleTitle }) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              moduleTitle={moduleTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
