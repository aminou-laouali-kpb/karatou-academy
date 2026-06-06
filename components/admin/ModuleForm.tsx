"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ModuleFormState } from "@/lib/admin/actions";
import type { Module } from "@/lib/supabase/types";

type Action = (
  prev: ModuleFormState,
  formData: FormData,
) => Promise<ModuleFormState>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "…" : label}
    </Button>
  );
}

export function ModuleForm({
  action,
  module,
  submitLabel,
}: {
  action: Action;
  module?: Module;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Field name="title_fr" label="Titre (FR)" defaultValue={module?.title_fr} required />
        <Field name="title_en" label="Title (EN)" defaultValue={module?.title_en ?? ""} />
        <Field name="title_ha" label="Suna (HA)" defaultValue={module?.title_ha ?? ""} />
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="description_fr">Description (FR)</Label>
          <Textarea
            id="description_fr"
            name="description_fr"
            defaultValue={module?.description_fr ?? ""}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="description_en">Description (EN)</Label>
            <Textarea
              id="description_en"
              name="description_en"
              defaultValue={module?.description_en ?? ""}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description_ha">Bayani (HA)</Label>
            <Textarea
              id="description_ha"
              name="description_ha"
              defaultValue={module?.description_ha ?? ""}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={module?.is_published}
            className="h-4 w-4 rounded"
          />
          Publié
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="is_free_preview"
            defaultChecked={module?.is_free_preview}
            className="h-4 w-4 rounded"
          />
          Aperçu gratuit
        </label>
      </div>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.ok && <p className="text-sm text-success">Enregistré ✓</p>}

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
      />
    </div>
  );
}
