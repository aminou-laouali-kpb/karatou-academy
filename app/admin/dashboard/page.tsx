import Link from "next/link";
import { LibraryBig, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllModules, isSupabaseConfigured } from "@/lib/data";

export default async function AdminDashboardPage() {
  const modules = await getAllModules();
  const published = modules.filter((m) => m.is_published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-black text-gray-900">
          Tableau de bord
        </h1>
        <Link href="/admin/modules/new">
          <Button>
            <Plus className="h-5 w-5" /> Nouveau module
          </Button>
        </Link>
      </div>

      {!isSupabaseConfigured() && (
        <p className="rounded-md bg-gold-50 p-3 text-sm text-gold-600">
          Mode démo : configurez Supabase pour activer la persistance du CMS.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Modules" value={modules.length} icon={<LibraryBig className="h-5 w-5 text-blue-500" />} />
        <Stat label="Publiés" value={published} />
        <Stat label="Brouillons" value={modules.length - published} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-heading text-2xl font-black text-gray-900">
            {value}
          </p>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}
