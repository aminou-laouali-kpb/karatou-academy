import Link from "next/link";
import { Award, Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { isSupabaseConfigured } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const t = await getTranslations();

  let displayName = "Invité";
  let email: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      email = user.email ?? null;
      displayName =
        (user.user_metadata?.full_name as string | undefined) ??
        user.email ??
        "Invité";
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-black text-gray-900">
        {t("profile.title")}
      </h1>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 font-heading text-xl font-bold text-blue-700">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">{displayName}</p>
            {email && <p className="truncate text-sm text-gray-500">{email}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <span className="flex items-center gap-2 text-gray-700">
            <Globe className="h-5 w-5 text-gray-500" /> {t("profile.language")}
          </span>
          <LanguageSwitcher compact />
        </CardContent>
      </Card>

      <Link href="/certificates" className="block">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Award className="h-5 w-5 text-gold-500" />
            <span className="font-medium text-gray-900">
              {t("certificate.my_certificates")}
            </span>
          </CardContent>
        </Card>
      </Link>

      <LogoutButton />
    </div>
  );
}
