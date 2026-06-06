import type {
  Certificate,
  ContentBlock,
  Course,
  GlossaryTerm,
  Module,
  QuizQuestion,
} from "@/lib/supabase/types";

// Demo content used when Supabase env vars are not configured, so the app is
// fully navigable locally without a backend.

const now = new Date().toISOString();

export const sampleModules: Module[] = [
  {
    id: "mod-ai-intro",
    slug: "introduction-ia",
    title_fr: "Introduction à l'Intelligence Artificielle",
    title_en: "Introduction to Artificial Intelligence",
    title_ha: "Gabatarwa ga Basira ta Roba",
    description_fr:
      "Comprendre ce qu'est l'IA, son histoire et son impact au quotidien en Afrique.",
    description_en:
      "Understand what AI is, its history and its everyday impact in Africa.",
    description_ha: null,
    thumbnail_url: null,
    order_index: 0,
    is_published: true,
    is_free_preview: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mod-prompting",
    slug: "prompting-efficace",
    title_fr: "Rédiger des prompts efficaces",
    title_en: "Writing effective prompts",
    title_ha: null,
    description_fr:
      "Apprendre à dialoguer avec les assistants IA pour obtenir de meilleurs résultats.",
    description_en: "Learn to talk to AI assistants for better results.",
    description_ha: null,
    thumbnail_url: null,
    order_index: 1,
    is_published: true,
    is_free_preview: false,
    created_at: now,
    updated_at: now,
  },
];

export const sampleCourses: Course[] = [
  {
    id: "course-1",
    module_id: "mod-ai-intro",
    slug: "quest-ce-que-lia",
    order_index: 0,
    title_fr: "Qu'est-ce que l'IA ?",
    title_en: "What is AI?",
    title_ha: "Menene AI?",
    duration_minutes: 10,
    is_published: true,
    created_at: now,
  },
  {
    id: "course-2",
    module_id: "mod-ai-intro",
    slug: "lia-au-quotidien",
    order_index: 1,
    title_fr: "L'IA au quotidien",
    title_en: "AI in everyday life",
    title_ha: null,
    duration_minutes: 8,
    is_published: true,
    created_at: now,
  },
];

export const sampleBlocks: ContentBlock[] = [
  {
    id: "b1",
    course_id: "course-1",
    block_type: "objective",
    order_index: 0,
    content_fr: { text: "À la fin de cette leçon, vous saurez définir l'IA avec vos propres mots." },
    content_en: { text: "By the end of this lesson, you'll define AI in your own words." },
    content_ha: { text: "A ƙarshen wannan darasi, za ka iya bayyana AI da kalmominka." },
    created_at: now,
  },
  {
    id: "b2",
    course_id: "course-1",
    block_type: "video",
    order_index: 1,
    content_fr: {
      url: "https://www.youtube.com/watch?v=ad79nYk2keg",
      title: "L'IA expliquée simplement",
    },
    content_en: {
      url: "https://www.youtube.com/watch?v=ad79nYk2keg",
      title: "AI explained simply",
    },
    content_ha: null,
    created_at: now,
  },
  {
    id: "b3",
    course_id: "course-1",
    block_type: "text",
    order_index: 2,
    content_fr: {
      cards: [
        {
          heading: "Une définition simple",
          body: "L'intelligence artificielle est la capacité d'une machine à imiter des fonctions humaines comme apprendre, raisonner et décider.",
        },
        {
          heading: "Pourquoi maintenant ?",
          body: "Grâce à plus de données et de puissance de calcul, l'IA est devenue accessible sur un simple téléphone.",
        },
      ],
    },
    content_en: {
      cards: [
        {
          heading: "A simple definition",
          body: "Artificial intelligence is a machine's ability to imitate human functions such as learning, reasoning and deciding.",
        },
      ],
    },
    content_ha: null,
    created_at: now,
  },
  {
    id: "b4",
    course_id: "course-1",
    block_type: "example",
    order_index: 3,
    content_fr: {
      heading: "Exemple local",
      body: "Aïcha tient une boutique à Niamey. Une IA l'aide à prévoir son stock et lui fait économiser 15 000 FCFA par mois.",
      amount: 15000,
    },
    content_en: {
      heading: "Local example",
      body: "Aïcha runs a shop in Niamey. An AI helps her forecast stock and saves her 15,000 FCFA per month.",
    },
    content_ha: null,
    created_at: now,
  },
  {
    id: "b5",
    course_id: "course-1",
    block_type: "practice",
    order_index: 4,
    content_fr: {
      prompt: "Citez une tâche de votre quotidien qu'une IA pourrait vous aider à accomplir.",
      placeholder: "Par exemple : traduire un message…",
    },
    content_en: {
      prompt: "Name a daily task an AI could help you with.",
      placeholder: "For example: translate a message…",
    },
    content_ha: null,
    created_at: now,
  },
  {
    id: "b6",
    course_id: "course-1",
    block_type: "quiz",
    order_index: 5,
    content_fr: { title: "Vérifions vos acquis" },
    content_en: { title: "Let's check your understanding" },
    content_ha: null,
    created_at: now,
  },
  {
    id: "b7",
    course_id: "course-1",
    block_type: "reflection",
    order_index: 6,
    content_fr: {
      prompt: "Comment l'IA pourrait-elle changer votre activité ou vos études ?",
    },
    content_en: {
      prompt: "How could AI change your work or your studies?",
    },
    content_ha: null,
    created_at: now,
  },
  {
    id: "b8",
    course_id: "course-1",
    block_type: "glossary_highlight",
    order_index: 7,
    content_fr: { term_ids: ["g1", "g2", "g3"] },
    content_en: { term_ids: ["g1", "g2", "g3"] },
    content_ha: { term_ids: ["g1", "g2", "g3"] },
    created_at: now,
  },
];

export const sampleQuiz: QuizQuestion[] = [
  {
    id: "q1",
    block_id: "b6",
    question_fr: "Que signifie « IA » ?",
    question_en: "What does \"AI\" stand for?",
    question_ha: null,
    options_fr: ["Intelligence Artificielle", "Information Automatique", "Interface Avancée"],
    options_en: ["Artificial Intelligence", "Automatic Information", "Advanced Interface"],
    options_ha: null,
    correct_index: 0,
    explanation_fr: "IA signifie Intelligence Artificielle.",
    explanation_en: "AI stands for Artificial Intelligence.",
    explanation_ha: null,
    order_index: 0,
  },
  {
    id: "q2",
    block_id: "b6",
    question_fr: "Une IA peut-elle apprendre à partir de données ?",
    question_en: "Can an AI learn from data?",
    question_ha: null,
    options_fr: ["Oui", "Non"],
    options_en: ["Yes", "No"],
    options_ha: null,
    correct_index: 0,
    explanation_fr: "Oui, c'est le principe de l'apprentissage automatique.",
    explanation_en: "Yes, that's the principle of machine learning.",
    explanation_ha: null,
    order_index: 1,
  },
];

export const sampleGlossary: GlossaryTerm[] = [
  {
    id: "g1",
    module_id: "mod-ai-intro",
    term_fr: "Intelligence Artificielle",
    term_en: "Artificial Intelligence",
    term_ha: "Basira ta Roba",
    definition_fr:
      "Domaine de l'informatique visant à créer des machines capables de tâches qui demandent de l'intelligence humaine.",
    definition_en:
      "A field of computing aiming to build machines capable of tasks requiring human intelligence.",
    definition_ha: null,
    created_at: now,
  },
  {
    id: "g2",
    module_id: "mod-ai-intro",
    term_fr: "Apprentissage automatique",
    term_en: "Machine Learning",
    term_ha: null,
    definition_fr:
      "Méthode qui permet à une machine d'apprendre à partir d'exemples plutôt que de règles écrites à la main.",
    definition_en:
      "A method allowing a machine to learn from examples rather than hand-written rules.",
    definition_ha: null,
    created_at: now,
  },
  {
    id: "g3",
    module_id: "mod-ai-intro",
    term_fr: "Algorithme",
    term_en: "Algorithm",
    term_ha: null,
    definition_fr: "Suite d'instructions précises pour résoudre un problème.",
    definition_en: "A precise sequence of instructions to solve a problem.",
    definition_ha: null,
    created_at: now,
  },
];

export const sampleCertificates: Certificate[] = [
  {
    id: "cert-1",
    user_id: "demo-user",
    module_id: "mod-ai-intro",
    certificate_uid: "KA-2026-AI-00001",
    issued_at: now,
    expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    status: "active",
    pdf_url: null,
    qr_code_url: null,
    granted_by_org_id: null,
  },
];
