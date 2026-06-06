"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const SUPABASE_READY = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!SUPABASE_READY) {
      router.push("/modules");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push(redirect);
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!SUPABASE_READY) {
      setOtpSent(true);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) setError(error.message);
    else setOtpSent(true);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!SUPABASE_READY) {
      router.push("/modules");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setLoading(false);
    if (error) setError(error.message);
    else router.push(redirect);
  }

  async function continueAsGuest() {
    setError(null);
    if (SUPABASE_READY) {
      const supabase = createClient();
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        router.push("/modules");
        return;
      }
      router.push(redirect);
    } else {
      router.push("/modules");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("auth.login_title")}</CardTitle>
        <CardDescription>{t("app.tagline")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-md bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode("email")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium",
              mode === "email" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500",
            )}
          >
            <Mail className="h-4 w-4" /> {t("auth.email")}
          </button>
          <button
            type="button"
            onClick={() => setMode("phone")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium",
              mode === "phone" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500",
            )}
          >
            <Phone className="h-4 w-4" /> {t("auth.phone")}
          </button>
        </div>

        {mode === "email" ? (
          <form onSubmit={handleEmail} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("common.loading") : t("common.login")}
            </Button>
          </form>
        ) : (
          <form onSubmit={otpSent ? verifyOtp : sendOtp} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="phone">{t("auth.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+227…"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {otpSent && (
              <div className="space-y-1">
                <Label htmlFor="otp">{t("auth.otp")}</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {otpSent ? t("auth.verify_otp") : t("auth.send_otp")}
            </Button>
          </form>
        )}

        {error && <p className="text-sm text-error">{error}</p>}

        <Button variant="outline" className="w-full" onClick={continueAsGuest}>
          {t("auth.continue_as_guest")}
        </Button>

        <p className="text-center text-sm text-gray-500">
          {t("auth.no_account")}{" "}
          <Link href="/register" className="font-medium text-blue-500">
            {t("common.register")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
