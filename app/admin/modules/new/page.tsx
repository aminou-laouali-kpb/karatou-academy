import { ModuleForm } from "@/components/admin/ModuleForm";
import { createModule } from "@/lib/admin/actions";

export default function NewModulePage() {
  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-black text-gray-900">
        Nouveau module
      </h1>
      <ModuleForm action={createModule} submitLabel="Créer le module" />
    </div>
  );
}
