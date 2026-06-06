import Link from "next/link";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function TopBar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        {title ? (
          <h1 className="font-heading text-lg font-bold text-gray-900">{title}</h1>
        ) : (
          <Link href="/dashboard" className="font-heading text-lg font-black text-blue-900">
            Karatou
          </Link>
        )}
        <LanguageSwitcher compact />
      </div>
    </header>
  );
}
