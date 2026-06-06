import Link from "next/link";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-heading text-xl font-black text-blue-900"
        >
          Karatou
        </Link>
        <LanguageSwitcher compact />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
