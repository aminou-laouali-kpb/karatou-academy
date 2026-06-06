"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Briefcase, GraduationCap, Mail, Phone, Sparkles, UserRound } from "lucide-react";
import { setLocale } from "@/lib/i18n/actions";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/i18n/request";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

const SUPABASE_READY = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const LANGS: { value: Locale; label: string; native: string }[] = [
  { value: "fr", label: "Français", native: "Français" },
  { value: "en", label: "English", native: "English" },
  { value: "ha", label: "Hausa", native: "Harshen Hausa" },
];

export default function OnboardingPage() {
  const t = useTranslations();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const totalSteps = 4;

  function pickLanguage(locale: Locale) {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
      setStep(1);
    });
  }

  async function guest() {
    if (SUPABASE_READY) {
      const supabase = createClient();
      const { error } = await supabase.auth.signInAnonymously();
      router.push(error ? "/modules" : "/dashboard");
    } else {
      router.push("/modules");
    }
  }

  const goals = [
    { id: "job", label: t("onboarding.diagnostic_job"), icon: Briefcase },
    { id: "business", label: t("onboarding.diagnostic_business"), icon: Sparkles },
    { id: "skills", label: t("onboarding.diagnostic_skills"), icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      <Progress value={((step + 1) / totalSteps) * 100} />

      {step === 0 && (
        <section className="space-y-4">
          <h1 className="font-heading text-2xl font-black text-gray-900">
            {t("onboarding.language_title")}
          </h1>
          <p className="text-sm text-gray-500">
            {t("onboarding.language_subtitle")}
          </p>
          <div className="space-y-3">
            {LANGS.map((l) => (
              <button
                key={l.value}
                onClick={() => pickLanguage(l.value)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-5 py-4 text-left transition-colors hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="font-medium text-gray-900">{l.label}</span>
                <span className="text-sm text-gray-500">{l.native}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
            <Sparkles className="h-8 w-8 text-gold-500" />
          </div>
          <h1 className="font-heading text-2xl font-black text-gray-900">
            {t("onboarding.promise_title")}
          </h1>
          <p className="text-gray-700">{t("onboarding.promise_body")}</p>
          <Button className="w-full" onClick={() => setStep(2)}>
            {t("common.continue")}
          </Button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h1 className="font-heading text-2xl font-black text-gray-900">
            {t("onboarding.diagnostic_title")}
          </h1>
          <p className="text-sm text-gray-500">
            {t("onboarding.diagnostic_subtitle")}
          </p>
          <div className="space-y-3">
            {goals.map((g) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border px-5 py-4 text-left transition-colors",
                    goal === g.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-blue-400",
                  )}
                >
                  <Icon className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-gray-900">{g.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setStep(3)}>
              {t("common.skip")}
            </Button>
            <Button className="flex-1" onClick={() => setStep(3)}>
              {t("common.continue")}
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <h1 className="font-heading text-2xl font-black text-gray-900">
            {t("onboarding.signup_title")}
          </h1>
          <p className="text-sm text-gray-500">
            {t("onboarding.signup_subtitle")}
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => router.push("/register")}>
              <Mail className="h-5 w-5" /> {t("onboarding.signup_email")}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
              <Phone className="h-5 w-5" /> {t("onboarding.signup_phone")}
            </Button>
            <Button variant="ghost" className="w-full" onClick={guest}>
              <UserRound className="h-5 w-5" /> {t("onboarding.signup_guest")}
            </Button>
          </div>
          <p className="rounded-md bg-blue-50 p-3 text-center text-xs text-blue-700">
            {t("onboarding.guest_note")}
          </p>
        </section>
      )}
    </div>
  );
}
