// Hand-written Supabase types for Karatou Academy.
// Mirrors supabase/migrations. Regenerate with:
//   npx supabase gen types typescript --local > lib/supabase/types.ts
// once a local or linked Supabase project is available.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Language = "fr" | "en" | "ha";
export type UserRole = "student" | "admin" | "org_admin";
export type BlockType =
  | "objective"
  | "video"
  | "text"
  | "example"
  | "practice"
  | "quiz"
  | "reflection"
  | "glossary_highlight";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type CertificateStatus = "active" | "expired" | "revoked";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  country: string;
  city: string | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
  age_range: string | null;
  preferred_language: Language;
  role: UserRole;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export type Module = {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string | null;
  title_ha: string | null;
  description_fr: string | null;
  description_en: string | null;
  description_ha: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_published: boolean;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
}

export type Course = {
  id: string;
  module_id: string;
  slug: string;
  order_index: number;
  title_fr: string;
  title_en: string | null;
  title_ha: string | null;
  duration_minutes: number;
  is_published: boolean;
  created_at: string;
}

export type ContentBlock = {
  id: string;
  course_id: string;
  block_type: BlockType;
  order_index: number;
  content_fr: Json | null;
  content_en: Json | null;
  content_ha: Json | null;
  created_at: string;
}

export type CourseVideo = {
  id: string;
  course_id: string;
  language: Language;
  provider: "youtube" | "bunny" | "upload";
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number | null;
}

export type QuizQuestion = {
  id: string;
  block_id: string;
  question_fr: string;
  question_en: string | null;
  question_ha: string | null;
  options_fr: string[];
  options_en: string[] | null;
  options_ha: string[] | null;
  correct_index: number;
  explanation_fr: string | null;
  explanation_en: string | null;
  explanation_ha: string | null;
  order_index: number;
}

export type GlossaryTerm = {
  id: string;
  module_id: string | null;
  term_fr: string;
  term_en: string | null;
  term_ha: string | null;
  definition_fr: string;
  definition_en: string | null;
  definition_ha: string | null;
  created_at: string;
}

export type UserProgress = {
  id: string;
  user_id: string;
  course_id: string;
  status: ProgressStatus;
  last_block_index: number;
  completed_at: string | null;
  updated_at: string;
}

export type UserReflection = {
  id: string;
  user_id: string;
  block_id: string;
  content: string;
  updated_at: string;
}

export type UserQuizAnswer = {
  id: string;
  user_id: string;
  question_id: string;
  selected_index: number;
  is_correct: boolean;
  answered_at: string;
}

export type Certificate = {
  id: string;
  user_id: string;
  module_id: string;
  certificate_uid: string;
  issued_at: string;
  expires_at: string;
  status: CertificateStatus;
  pdf_url: string | null;
  qr_code_url: string | null;
  granted_by_org_id: string | null;
}

type TableShape<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableShape<Profile>;
      modules: TableShape<Module>;
      courses: TableShape<Course>;
      content_blocks: TableShape<ContentBlock>;
      course_videos: TableShape<CourseVideo>;
      quiz_questions: TableShape<QuizQuestion>;
      glossary_terms: TableShape<GlossaryTerm>;
      user_progress: TableShape<UserProgress>;
      user_reflections: TableShape<UserReflection>;
      user_quiz_answers: TableShape<UserQuizAnswer>;
      certificates: TableShape<Certificate>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      block_type: BlockType;
    };
    CompositeTypes: Record<string, never>;
  };
}
