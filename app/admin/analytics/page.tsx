import { Card, CardContent } from "@/components/ui/card";
import { getAllModules, isSupabaseConfigured } from "@/lib/data";

export default async function AnalyticsPage() {
  const modules = await getAllModules();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-black text-gray-900">
        Statistiques
      </h1>

      {!isSupabaseConfigured() && (
        <p className="rounded-md bg-gold-50 p-3 text-sm text-gold-600">
          Mode démo : les statistiques détaillées seront disponibles une fois
          Supabase connecté.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Modules</p>
            <p className="font-heading text-3xl font-black text-blue-700">
              {modules.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Apprenants</p>
            <p className="font-heading text-3xl font-black text-blue-700">—</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Certificats émis</p>
            <p className="font-heading text-3xl font-black text-blue-700">—</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Taux de complétion</p>
            <p className="font-heading text-3xl font-black text-blue-700">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
