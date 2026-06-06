import { createClient } from "@/lib/supabase/server";
import {
  sampleBlocks,
  sampleCertificates,
  sampleCourses,
  sampleGlossary,
  sampleModules,
  sampleQuiz,
} from "@/lib/sample-data";
import type {
  Certificate,
  ContentBlock,
  Course,
  GlossaryTerm,
  Module,
  QuizQuestion,
} from "@/lib/supabase/types";

export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export interface CourseBundle {
  course: Course;
  module: Module;
  blocks: ContentBlock[];
  quizByBlock: Record<string, QuizQuestion[]>;
  glossary: GlossaryTerm[];
}

export interface ModuleWithCourses {
  module: Module;
  courses: Course[];
}

export interface CertificateView {
  certificate: Certificate;
  holderName: string | null;
  moduleTitle: string | null;
  organizationName: string | null;
}

export async function getPublishedModules(): Promise<Module[]> {
  if (!isSupabaseConfigured()) {
    return [...sampleModules].sort((a, b) => a.order_index - b.order_index);
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("modules")
    .select("*")
    .eq("is_published", true)
    .order("order_index");
  return data ?? [];
}

export async function getModuleBySlug(
  slug: string,
): Promise<ModuleWithCourses | null> {
  if (!isSupabaseConfigured()) {
    const mod = sampleModules.find((m) => m.slug === slug);
    if (!mod) return null;
    const courses = sampleCourses
      .filter((c) => c.module_id === mod.id)
      .sort((a, b) => a.order_index - b.order_index);
    return { module: mod, courses };
  }
  const supabase = createClient();
  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!module) return null;
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("module_id", module.id)
    .eq("is_published", true)
    .order("order_index");
  return { module, courses: courses ?? [] };
}

export async function getCourseBundle(
  courseId: string,
): Promise<CourseBundle | null> {
  if (!isSupabaseConfigured()) {
    const course = sampleCourses.find((c) => c.id === courseId);
    if (!course) return null;
    const mod = sampleModules.find((m) => m.id === course.module_id)!;
    const blocks = sampleBlocks
      .filter((b) => b.course_id === courseId)
      .sort((a, b) => a.order_index - b.order_index);
    const quizByBlock: Record<string, QuizQuestion[]> = {};
    for (const q of sampleQuiz) {
      (quizByBlock[q.block_id] ??= []).push(q);
    }
    const glossary = sampleGlossary.filter((g) => g.module_id === mod.id);
    return { course, module: mod, blocks, quizByBlock, glossary };
  }

  const supabase = createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();
  if (!course) return null;
  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("id", course.module_id)
    .single();
  if (!module) return null;
  const { data: blocks } = await supabase
    .from("content_blocks")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index");

  const quizByBlock: Record<string, QuizQuestion[]> = {};
  const quizBlockIds = (blocks ?? [])
    .filter((b) => b.block_type === "quiz")
    .map((b) => b.id);
  if (quizBlockIds.length) {
    const { data: questions } = await supabase
      .from("quiz_questions")
      .select("*")
      .in("block_id", quizBlockIds)
      .order("order_index");
    for (const q of questions ?? []) {
      (quizByBlock[q.block_id] ??= []).push(q);
    }
  }

  const { data: glossary } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("module_id", module.id);

  return {
    course,
    module,
    blocks: blocks ?? [],
    quizByBlock,
    glossary: glossary ?? [],
  };
}

export async function getNextCourse(
  moduleId: string,
  currentOrderIndex: number,
): Promise<Course | null> {
  if (!isSupabaseConfigured()) {
    return (
      sampleCourses
        .filter((c) => c.module_id === moduleId && c.order_index > currentOrderIndex)
        .sort((a, b) => a.order_index - b.order_index)[0] ?? null
    );
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .gt("order_index", currentOrderIndex)
    .order("order_index")
    .limit(1);
  return data?.[0] ?? null;
}

export async function getAllModules(): Promise<Module[]> {
  if (!isSupabaseConfigured()) {
    return [...sampleModules].sort((a, b) => a.order_index - b.order_index);
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("modules")
    .select("*")
    .order("order_index");
  return data ?? [];
}

export async function getModuleById(
  id: string,
): Promise<{ module: Module; courses: Course[] } | null> {
  if (!isSupabaseConfigured()) {
    const mod = sampleModules.find((m) => m.id === id);
    if (!mod) return null;
    const courses = sampleCourses
      .filter((c) => c.module_id === id)
      .sort((a, b) => a.order_index - b.order_index);
    return { module: mod, courses };
  }
  const supabase = createClient();
  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("id", id)
    .single();
  if (!module) return null;
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("module_id", id)
    .order("order_index");
  return { module, courses: courses ?? [] };
}

export async function getGlossary(): Promise<GlossaryTerm[]> {
  if (!isSupabaseConfigured()) {
    return [...sampleGlossary].sort((a, b) => a.term_fr.localeCompare(b.term_fr));
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("glossary_terms")
    .select("*")
    .order("term_fr");
  return data ?? [];
}

export async function getCertificateByUid(
  uid: string,
): Promise<CertificateView | null> {
  if (!isSupabaseConfigured()) {
    const certificate = sampleCertificates.find((c) => c.certificate_uid === uid);
    if (!certificate) return null;
    const mod = sampleModules.find((m) => m.id === certificate.module_id);
    return {
      certificate,
      holderName: "Aïcha Ibrahim",
      moduleTitle: mod?.title_fr ?? null,
      organizationName: null,
    };
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*, profiles(full_name), modules(title_fr), organizations(name)")
    .eq("certificate_uid", uid)
    .single();
  if (!data) return null;
  const row = data as unknown as Certificate & {
    profiles: { full_name: string | null } | null;
    modules: { title_fr: string | null } | null;
    organizations: { name: string | null } | null;
  };
  return {
    certificate: row,
    holderName: row.profiles?.full_name ?? null,
    moduleTitle: row.modules?.title_fr ?? null,
    organizationName: row.organizations?.name ?? null,
  };
}
