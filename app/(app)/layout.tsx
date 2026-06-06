import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
