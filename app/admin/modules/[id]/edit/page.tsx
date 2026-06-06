import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { ModuleForm } from "@/components/admin/ModuleForm";
import { updateModule } from "@/lib/admin/actions";
import { getModuleById } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditModulePage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getModuleById(params.id);
  if (!data) notFound();

  const { module, courses } = data;
  const action = updateModule.bind(null, module.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-black text-gray-900">
          Modifier le module
        </h1>
        <p className="font-mono-data text-xs text-gray-500">{module.slug}</p>
      </div>

      <ModuleForm action={action} module={module} submitLabel="Enregistrer" />

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-gray-900">Leçons</h2>
        {courses.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune leçon.</p>
        ) : (
          <div className="space-y-2">
            {courses.map((course, index) => (
              <Card key={course.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-mono-data text-sm text-blue-700">
                    {index + 1}
                  </span>
                  <span className="flex-1 font-medium text-gray-900">
                    {course.title_fr}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration_minutes} min
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
