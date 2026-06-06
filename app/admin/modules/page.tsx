import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllModules } from "@/lib/data";

export default async function AdminModulesPage() {
  const modules = await getAllModules();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-black text-gray-900">Modules</h1>
        <Link href="/admin/modules/new">
          <Button>
            <Plus className="h-5 w-5" /> Nouveau module
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {modules.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-gray-900">
                    {m.title_fr}
                  </h3>
                  <Badge variant={m.is_published ? "success" : "neutral"}>
                    {m.is_published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <p className="font-mono-data text-xs text-gray-500">{m.slug}</p>
              </div>
              <Link href={`/admin/modules/${m.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" /> Éditer
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
