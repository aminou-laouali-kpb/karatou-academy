"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data";

export interface ModuleFormState {
  error?: string;
  ok?: boolean;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createModule(
  _prev: ModuleFormState,
  formData: FormData,
): Promise<ModuleFormState> {
  const title_fr = String(formData.get("title_fr") ?? "").trim();
  if (!title_fr) return { error: "Le titre français est requis." };

  if (!isSupabaseConfigured()) {
    // Demo mode: nothing to persist.
    return { ok: true };
  }

  const supabase = createClient();
  const { error } = await supabase.from("modules").insert({
    slug: slugify(title_fr),
    title_fr,
    title_en: String(formData.get("title_en") ?? "") || null,
    title_ha: String(formData.get("title_ha") ?? "") || null,
    description_fr: String(formData.get("description_fr") ?? "") || null,
    description_en: String(formData.get("description_en") ?? "") || null,
    description_ha: String(formData.get("description_ha") ?? "") || null,
    is_published: formData.get("is_published") === "on",
    is_free_preview: formData.get("is_free_preview") === "on",
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/modules");
  redirect("/admin/modules");
}

export async function updateModule(
  id: string,
  _prev: ModuleFormState,
  formData: FormData,
): Promise<ModuleFormState> {
  const title_fr = String(formData.get("title_fr") ?? "").trim();
  if (!title_fr) return { error: "Le titre français est requis." };

  if (!isSupabaseConfigured()) {
    return { ok: true };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("modules")
    .update({
      title_fr,
      title_en: String(formData.get("title_en") ?? "") || null,
      title_ha: String(formData.get("title_ha") ?? "") || null,
      description_fr: String(formData.get("description_fr") ?? "") || null,
      description_en: String(formData.get("description_en") ?? "") || null,
      description_ha: String(formData.get("description_ha") ?? "") || null,
      is_published: formData.get("is_published") === "on",
      is_free_preview: formData.get("is_free_preview") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/modules");
  revalidatePath(`/admin/modules/${id}/edit`);
  return { ok: true };
}
