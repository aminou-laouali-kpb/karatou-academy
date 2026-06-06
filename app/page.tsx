import Link from "next/link";
import { Award, BookOpen, Globe2, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default async function LandingPage() {
  const t = await getTranslations();

  const features = [
    { icon: BookOpen, title: t("modules.title"), body: t("modules.subtitle") },
    {
      icon: Award,
      title: t("certificate.my_certificates"),
      body: t("certificate.verify_title"),
    },
    { icon: Globe2, title: t("profile.language"), body: "FR · EN · Hausa" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-4">
        <span className="font-heading text-xl font-black text-blue-900">
          Karatou Academy
        </span>
        <LanguageSwitcher compact />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
          <Sparkles className="h-8 w-8 text-gold-500" />
        </div>
        <div className="max-w-xl space-y-4">
          <h1 className="text-balance font-heading text-4xl font-black leading-tight text-gray-900">
            {t("app.tagline")}
          </h1>
          <p className="text-lg text-gray-500">{t("onboarding.promise_body")}</p>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <Link href="/onboarding">
            <Button size="lg" className="w-full">
              {t("common.start")}
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full">
              {t("common.login")}
            </Button>
          </Link>
        </div>

        <div className="grid w-full max-w-2xl gap-4 pt-6 sm:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-lg border border-gray-100 bg-gray-50 p-5 text-left"
              >
                <Icon className="mb-2 h-6 w-6 text-blue-500" />
                <h3 className="font-heading text-base font-bold text-gray-900">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500">{f.body}</p>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-blue-900 px-4 py-6 text-center text-sm text-blue-100">
        Karatou Academy · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
