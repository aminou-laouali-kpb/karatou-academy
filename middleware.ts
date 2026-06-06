import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/dashboard", "/certificates", "/profile", "/admin"];
const LOCALES = ["fr", "en", "ha"];
const LOCALE_COOKIE = "ka_lang";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only run the Supabase session refresh when env is configured, so the app
  // still boots locally before credentials are added.
  if (url && anon) {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isProtected = PROTECTED_PREFIXES.some(
      (p) => path === p || path.startsWith(`${p}/`),
    );

    if (isProtected && !user) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/login";
      redirect.searchParams.set("redirect", path);
      return NextResponse.redirect(redirect);
    }
  }

  // Ensure a language cookie exists (detected from Accept-Language).
  if (!request.cookies.get(LOCALE_COOKIE)) {
    const accept = request.headers.get("accept-language") ?? "";
    const preferred = accept.split(",")[0]?.split("-")[0]?.trim() ?? "";
    const locale = LOCALES.includes(preferred) ? preferred : "fr";
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-|icons/|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
