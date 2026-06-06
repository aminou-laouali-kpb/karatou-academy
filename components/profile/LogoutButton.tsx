"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const SUPABASE_READY = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export function LogoutButton() {
  const t = useTranslations("common");
  const router = useRouter();

  async function logout() {
    if (SUPABASE_READY) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" className="w-full" onClick={logout}>
      <LogOut className="h-5 w-5" /> {t("logout")}
    </Button>
  );
}
