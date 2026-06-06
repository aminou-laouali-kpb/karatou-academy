import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const LOCALES = ["fr", "en", "ha"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "ka_lang";

function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/**
 * Resolves the active locale without URL-prefixed routing:
 * 1. `ka_lang` cookie  2. Accept-Language header  3. default (fr).
 * Connected users' `profiles.preferred_language` is synced into the cookie.
 */
export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  let locale: Locale = DEFAULT_LOCALE;
  if (isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const accept = headers().get("accept-language") ?? "";
    const preferred = accept.split(",")[0]?.split("-")[0]?.trim();
    if (isLocale(preferred)) locale = preferred;
  }

  return {
    locale,
    messages: (await import(`../lib/i18n/messages/${locale}.json`)).default,
  };
});
