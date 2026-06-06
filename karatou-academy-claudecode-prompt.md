# Prompt Claude Code — Karatou Academy
## Initialisation complète du projet · Sprint 1

---

## CONTEXTE PRODUIT

Tu vas construire **Karatou Academy** — la plateforme de référence pour les compétences IA en Afrique francophone. C'est le Coursera africain : formation en ligne, certifications numériques renouvelables 12 mois, trilingue (FR/EN/Haoussa), mobile-first, PWA offline.

**Modèle business :**
- Audit gratuit (accès leçons sans certificat)
- Certificat unitaire payant : 7 500 FCFA (~12$)
- Abonnement Plus : 12 000 FCFA/mois ou 90 000 FCFA/an
- Enterprise : portail organisation + bourses (achat de sièges)

**Utilisateurs :**
1. Apprenant individuel (étudiant, professionnel, entrepreneur)
2. Organisation (ONG, entreprise, gouvernement, université)
3. Administrateur contenu (CMS sans code)

---

## STACK TECHNIQUE

```
Framework     : Next.js 14 (App Router, TypeScript strict)
Base de données : Supabase (PostgreSQL + Auth + Storage + Realtime)
Hosting       : Vercel
UI Components : shadcn/ui + Tailwind CSS
Icônes        : Lucide React
Fonts         : Playfair Display + DM Sans + DM Mono (Google Fonts)
Paiements     : Stripe + CinetPay (Mobile Money)
PWA           : next-pwa
Certificats   : @react-pdf/renderer
Email         : Resend
i18n          : next-intl (FR / EN / HA)
State         : Zustand
Forms         : React Hook Form + Zod
```

---

## CE QUE TU DOIS CONSTRUIRE EN SPRINT 1

**Scope strict du Sprint 1 :**

1. Setup complet du projet (Next.js 14 + Supabase + Tailwind + shadcn/ui)
2. Design system complet (tokens CSS, composants de base)
3. Auth complète (email, téléphone OTP, mode invité)
4. Onboarding trilingue (4 étapes)
5. Layout principal app (navigation 4 onglets)
6. Page Dashboard apprenant
7. Page liste des modules
8. Page détail module (liste des leçons)
9. Lecteur de leçon complet (boucle 8 étapes)
10. Système de progression (sauvegarde Supabase)
11. Glossaire trilingue avec infobulles
12. PWA manifest + Service Worker basique
13. Interface admin CMS (gestion modules + leçons)

---

## DESIGN SYSTEM — TOKENS EXACTS

Implémente ces tokens CSS dans `app/globals.css` et le fichier `tailwind.config.ts` :

```css
:root {
  /* Blues */
  --blue-900: #0A1628;
  --blue-800: #0D2245;
  --blue-700: #1035A0;
  --blue-600: #1A52CC;
  --blue-500: #1A73E8;   /* ← Primaire CTA */
  --blue-400: #4A9EF5;
  --blue-300: #8EC5FF;
  --blue-100: #E8F2FF;
  --blue-50:  #F0F7FF;

  /* Golds */
  --gold-600: #C47D0A;
  --gold-500: #E8960C;
  --gold-400: #F5A623;   /* ← Secondaire accent */
  --gold-300: #FAC55A;
  --gold-100: #FEF3D8;
  --gold-50:  #FFFBF0;

  /* Grays */
  --gray-900: #111827;
  --gray-700: #374151;
  --gray-500: #6B7280;
  --gray-300: #D1D5DB;
  --gray-100: #F3F4F6;
  --gray-50:  #F9FAFB;

  /* States */
  --success: #16A34A;
  --error:   #DC2626;
  --warning: #D97706;
  --info:    #0284C7;

  /* Radius */
  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-xl:   32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:   0 1px 3px rgba(26,115,232,.08), 0 1px 2px rgba(0,0,0,.04);
  --shadow-md:   0 4px 16px rgba(26,115,232,.12), 0 2px 8px rgba(0,0,0,.06);
  --shadow-lg:   0 12px 40px rgba(26,115,232,.16), 0 4px 16px rgba(0,0,0,.08);
  --shadow-gold: 0 4px 20px rgba(245,166,35,.30);
}
```

**Typographie :**
- Titres H1–H3 : `Playfair Display`, weights 700 et 900
- Corps + UI : `DM Sans`, weights 300/400/500/600
- IDs, codes, données techniques : `DM Mono`, weights 400/500

**Règles de design (NON négociables) :**
- Aucun coin droit — tous les composants sont arrondis
- Fond principal : blanc (`#FFFFFF`)
- Sections alternées : `#F9FAFB`
- Header/Footer/Certificats : `#0A1628` (blue-900)
- Jamais de texte blanc sur fond doré
- Contraste minimum 4.5:1 (WCAG AA)
- Ombres bleues légères (jamais noires lourdes)

---

## SCHÉMA BASE DE DONNÉES SUPABASE

Crée ces migrations Supabase dans `/supabase/migrations/` :

```sql
-- ══════════════════════════════════════════
-- 001_profiles.sql
-- ══════════════════════════════════════════
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT DEFAULT 'NE',
  city TEXT,
  gender TEXT CHECK (gender IN ('male','female','other','prefer_not_to_say')),
  age_range TEXT,
  preferred_language TEXT DEFAULT 'fr' CHECK (preferred_language IN ('fr','en','ha')),
  role TEXT DEFAULT 'student' CHECK (role IN ('student','admin','org_admin')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);


-- ══════════════════════════════════════════
-- 002_organizations.sql
-- ══════════════════════════════════════════
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  contact_email TEXT NOT NULL,
  country TEXT DEFAULT 'NE',
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free','starter','professional','enterprise')),
  subscription_expires_at TIMESTAMPTZ,
  seats_total INTEGER DEFAULT 0,
  seats_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE org_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'learner' CHECK (role IN ('admin','learner')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════
-- 003_content.sql
-- ══════════════════════════════════════════
CREATE TABLE modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  title_ha TEXT,
  description_fr TEXT,
  description_en TEXT,
  description_ha TEXT,
  thumbnail_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  title_ha TEXT,
  duration_minutes INTEGER DEFAULT 10,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

CREATE TYPE block_type AS ENUM (
  'objective','video','text','example',
  'practice','quiz','reflection','glossary_highlight'
);

CREATE TABLE content_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  block_type block_type NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  content_fr JSONB,
  content_en JSONB,
  content_ha JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  language TEXT CHECK (language IN ('fr','en','ha')),
  provider TEXT DEFAULT 'youtube' CHECK (provider IN ('youtube','bunny','upload')),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  UNIQUE(course_id, language)
);

CREATE TABLE quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  question_fr TEXT NOT NULL,
  question_en TEXT,
  question_ha TEXT,
  options_fr JSONB NOT NULL,
  options_en JSONB,
  options_ha JSONB,
  correct_index INTEGER NOT NULL,
  explanation_fr TEXT,
  explanation_en TEXT,
  explanation_ha TEXT,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE glossary_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  term_fr TEXT NOT NULL,
  term_en TEXT,
  term_ha TEXT,
  definition_fr TEXT NOT NULL,
  definition_en TEXT,
  definition_ha TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Anyone can view published modules" ON modules FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Anyone can view content blocks" ON content_blocks FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view videos" ON course_videos FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view glossary" ON glossary_terms FOR SELECT USING (TRUE);


-- ══════════════════════════════════════════
-- 004_progress.sql
-- ══════════════════════════════════════════
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  last_block_index INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE user_quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, block_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own answers" ON user_quiz_answers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own reflections" ON user_reflections FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════════
-- 005_certificates.sql
-- ══════════════════════════════════════════
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  certificate_uid TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','expired','revoked')),
  pdf_url TEXT,
  qr_code_url TEXT,
  granted_by_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  UNIQUE(user_id, module_id)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
-- Public read for verification page (by certificate_uid)
CREATE POLICY "Anyone can verify certificate" ON certificates FOR SELECT USING (TRUE);


-- ══════════════════════════════════════════
-- 006_payments.sql
-- ══════════════════════════════════════════
CREATE TABLE scholarships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  email_sent_to TEXT,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','claimed','expired')),
  expires_at TIMESTAMPTZ,
  claimed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('certificate','plus_monthly','plus_annual','enterprise')),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'XOF' CHECK (currency IN ('XOF','USD','EUR')),
  provider TEXT CHECK (provider IN ('stripe','cinetpay')),
  provider_order_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('plus_monthly','plus_annual')),
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','cancelled','past_due')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
```

---

## STRUCTURE DU PROJET NEXT.JS

```
karatou-academy/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    ← Landing page
│   │   ├── pricing/page.tsx            ← Tarifs
│   │   └── about/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── onboarding/page.tsx         ← 4 étapes : langue → promesse → diagnostic → compte
│   ├── (app)/
│   │   ├── layout.tsx                  ← Nav 4 onglets (Accueil/Modules/Glossaire/Profil)
│   │   ├── dashboard/page.tsx          ← Tableau de bord apprenant
│   │   ├── modules/
│   │   │   ├── page.tsx                ← Liste des modules
│   │   │   └── [slug]/page.tsx         ← Détail module + liste leçons
│   │   ├── learn/
│   │   │   └── [courseId]/page.tsx     ← Lecteur leçon (boucle 8 étapes)
│   │   ├── certificates/page.tsx       ← Mes certifications
│   │   ├── glossary/page.tsx           ← Glossaire trilingue
│   │   └── profile/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── modules/
│   │   │   ├── page.tsx                ← Liste modules (CMS)
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx      ← Éditeur module + leçons + blocs
│   │   └── analytics/page.tsx
│   ├── verify/
│   │   └── [uid]/page.tsx              ← Page publique vérification certificat (NO AUTH)
│   ├── api/
│   │   ├── auth/callback/route.ts
│   │   ├── certificates/generate/route.ts
│   │   ├── payments/stripe/webhook/route.ts
│   │   └── payments/cinetpay/webhook/route.ts
│   ├── layout.tsx                      ← Root layout + fonts + providers
│   └── globals.css                     ← CSS variables + Tailwind
├── components/
│   ├── ui/                             ← shadcn/ui components (Button, Card, Badge...)
│   ├── layout/
│   │   ├── BottomNav.tsx               ← Navigation mobile 4 onglets
│   │   ├── TopBar.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── learn/
│   │   ├── LessonPlayer.tsx            ← Orchestrateur boucle 8 étapes
│   │   ├── blocks/
│   │   │   ├── ObjectiveBlock.tsx      ← Étape 1 : objectif
│   │   │   ├── VideoBlock.tsx          ← Étape 2 : vidéo YouTube embed
│   │   │   ├── TextBlock.tsx           ← Étape 3 : cartes de texte + audio
│   │   │   ├── ExampleBlock.tsx        ← Étape 4 : exemple local
│   │   │   ├── PracticeBlock.tsx       ← Étape 5 : pratique guidée
│   │   │   ├── QuizBlock.tsx           ← Étape 6 : quiz 3-5 questions
│   │   │   ├── ReflectionBlock.tsx     ← Étape 7 : introspection + journal
│   │   │   └── GlossaryBlock.tsx       ← Étape 8 : termes cliquables
│   │   ├── ProgressBar.tsx
│   │   └── LessonComplete.tsx          ← Écran de fin de leçon
│   ├── modules/
│   │   ├── ModuleCard.tsx
│   │   └── CourseList.tsx
│   ├── certificates/
│   │   ├── CertificateCard.tsx
│   │   ├── CertificatePreview.tsx
│   │   └── PDFTemplate.tsx             ← Template React-PDF
│   ├── glossary/
│   │   ├── GlossarySearch.tsx
│   │   └── GlossaryTooltip.tsx         ← Infobulle inline dans les leçons
│   └── admin/
│       ├── CMSEditor.tsx
│       ├── BlockBuilder.tsx
│       └── AnalyticsDashboard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   ← Browser client
│   │   ├── server.ts                   ← Server client (cookies)
│   │   └── types.ts                    ← Types générés (supabase gen types)
│   ├── i18n/
│   │   ├── messages/fr.json
│   │   ├── messages/en.json
│   │   └── messages/ha.json
│   ├── pdf/
│   │   └── generateCertificate.ts
│   └── utils/
│       ├── cn.ts                       ← clsx + tailwind-merge
│       └── formatCurrency.ts           ← FCFA / USD / EUR
├── public/
│   ├── manifest.json                   ← PWA manifest
│   └── sw.js                           ← Service Worker
├── supabase/
│   └── migrations/                     ← Les 6 fichiers SQL ci-dessus
├── next.config.js                      ← next-pwa config
├── tailwind.config.ts                  ← Tokens de design + shadcn
└── middleware.ts                       ← Auth guard + lang detection
```

---

## LOGIQUE MÉTIER CRITIQUE — BOUCLE 8 ÉTAPES

Le `LessonPlayer.tsx` est le cœur du produit. Il orchestre les 8 étapes dans l'ordre strict suivant :

```typescript
const STEP_ORDER: BlockType[] = [
  'objective',          // 1. Bandeau objectif
  'video',              // 2. Vidéo YouTube (embed, switch langue)
  'text',               // 3. Cartes texte + bouton audio TTS
  'example',            // 4. Encadré exemple local (montants en FCFA)
  'practice',           // 5. Zone interactive
  'quiz',               // 6. Quiz 3-5 questions avec correction immédiate
  'reflection',         // 7. Question ouverte → sauvegardée dans user_reflections
  'glossary_highlight', // 8. Termes techniques soulignés et cliquables
];
```

**Règles de progression :**
- L'apprenant avance étape par étape (pas de saut possible)
- La position est sauvegardée dans `user_progress.last_block_index` à chaque étape
- Le quiz : correction immédiate avec explication, pas de blocage (on peut continuer même si faux)
- La réflexion : sauvegarde en temps réel dans Supabase (pas de bouton "Envoyer")
- À la 8ème étape : afficher `LessonComplete` avec animation + bouton "Leçon suivante"

---

## ONBOARDING — 4 ÉTAPES

```typescript
// Étape 1 : Choix de la langue
{ screen: 'language', options: ['fr', 'en', 'ha'] }

// Étape 2 : Promesse
{ screen: 'promise', content: "La plateforme de référence pour maîtriser l'IA en Afrique" }

// Étape 3 : Diagnostic d'intention (optionnel)
{ screen: 'diagnostic', options: [
  { id: 'job', label_fr: 'Trouver un emploi' },
  { id: 'business', label_fr: 'Créer une activité' },
  { id: 'skills', label_fr: 'Maîtriser l\'IA' }
]}

// Étape 4 : Création de compte légère
{ screen: 'signup', options: ['email', 'phone', 'guest'] }
// Note : le mode invité permet d'accéder aux 2 premières leçons sans compte
```

---

## NAVIGATION MOBILE (BottomNav)

```typescript
const NAV_ITEMS = [
  { href: '/dashboard',   icon: 'Home',        label_fr: 'Accueil' },
  { href: '/modules',     icon: 'BookOpen',     label_fr: 'Modules' },
  { href: '/glossary',    icon: 'Search',       label_fr: 'Glossaire' },
  { href: '/profile',     icon: 'User',         label_fr: 'Profil' },
];
// Zones tactiles minimum : 48x48px
// Icônes : Lucide React, taille 22px
// Toujours accompagnées du libellé texte
```

---

## PAGE PUBLIQUE DE VÉRIFICATION — `/verify/[uid]`

Cette page est accessible SANS authentification. Elle affiche :
- Statut du certificat (Actif ✅ / Expiré ❌ / Révoqué)
- Nom du titulaire
- Module certifié
- Date d'émission + date d'expiration
- Nom de l'organisation (si bourse)
- QR Code de la page elle-même

```typescript
// Query Supabase (pas de RLS requis — lecture publique)
const { data } = await supabase
  .from('certificates')
  .select(`*, profiles(full_name), modules(title_fr)`)
  .eq('certificate_uid', params.uid)
  .single();
```

---

## INTERNATIONALISATION

Utilise `next-intl`. La langue est stockée dans :
1. `profiles.preferred_language` (utilisateurs connectés)
2. Cookie `ka_lang` (utilisateurs non connectés)
3. Détection automatique depuis `Accept-Language` header au 1er lancement

**Structure des messages :**
```json
// fr.json
{
  "nav": { "home": "Accueil", "modules": "Modules", "glossary": "Glossaire", "profile": "Profil" },
  "onboarding": { "language_title": "Choisissez votre langue", ... },
  "learn": { "next_lesson": "Leçon suivante", "complete": "Leçon terminée !", ... },
  "certificate": { "issued": "Délivré le", "expires": "Valide jusqu'au", "active": "Actif", "expired": "Expiré" }
}
```

---

## VARIABLES D'ENVIRONNEMENT (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# CinetPay (Mobile Money)
CINETPAY_API_KEY=
CINETPAY_SITE_ID=

# Resend (emails transactionnels)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Karatou Academy
```

---

## COMMANDES DE DÉMARRAGE

```bash
# 1. Initialiser le projet
npx create-next-app@latest karatou-academy \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd karatou-academy

# 2. Installer les dépendances
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install next-intl
npm install next-pwa
npm install @react-pdf/renderer
npm install react-hook-form zod @hookform/resolvers
npm install zustand
npm install resend
npm install lucide-react
npm install clsx tailwind-merge
npm install class-variance-authority

# 3. Initialiser shadcn/ui
npx shadcn-ui@latest init
# → Style: Default, Base color: Slate, CSS variables: yes

# 4. Ajouter les composants shadcn nécessaires
npx shadcn-ui@latest add button card badge input label
npx shadcn-ui@latest add dialog sheet tabs progress
npx shadcn-ui@latest add toast alert separator avatar

# 5. Supabase CLI
npm install -D supabase
npx supabase init
npx supabase link --project-ref [YOUR_PROJECT_REF]
npx supabase db push
npx supabase gen types typescript --local > lib/supabase/types.ts
```

---

## ORDRE D'IMPLÉMENTATION RECOMMANDÉ

Construis dans cet ordre précis pour avoir quelque chose de fonctionnel le plus vite possible :

1. `globals.css` + `tailwind.config.ts` (tokens de design)
2. `lib/supabase/client.ts` + `lib/supabase/server.ts`
3. Migrations Supabase (6 fichiers SQL)
4. `lib/supabase/types.ts` (généré)
5. `middleware.ts` (auth guard + lang)
6. Root `layout.tsx` (fonts + providers + i18n)
7. Auth : `/login` + `/register`
8. Onboarding : `/onboarding` (4 étapes)
9. Layout app `(app)/layout.tsx` + `BottomNav.tsx`
10. `/dashboard` (bouton Reprendre + progression)
11. `/modules` + `/modules/[slug]`
12. `/learn/[courseId]` (LessonPlayer + 8 blocks)
13. `/glossary`
14. `/verify/[uid]` (page publique)
15. `(admin)` layout + CMS modules/leçons
16. PWA manifest + next-pwa config

---

## NOTES IMPORTANTES

- **Mobile-first** : tout doit être utilisable à une main sur un écran de 375px. Les breakpoints desktop sont des bonus.
- **Performance** : cible Lighthouse ≥ 85 sur mobile 3G simulé. Images lazy-loaded, fonts avec `display: swap`.
- **Offline** : le Service Worker met en cache les pages des leçons téléchargées. Utilise `next-pwa` avec Workbox.
- **Accessibilité** : zones tactiles ≥ 48dp, contraste ≥ 4.5:1, toutes les icônes ont un `aria-label`.
- **Sécurité** : RLS Supabase activé sur toutes les tables. Jamais de `service_role_key` côté client.
- **i18n contenu** : le contenu des leçons est dans `content_fr/content_en/content_ha` (JSONB). Si `content_en` est null, afficher `content_fr` avec un bandeau "Non disponible en anglais".
- **Certificat UID** : format `KA-[ANNÉE]-[MODULE_CODE]-[SEQUENCE_5CHIFFRES]` ex: `KA-2026-AI-00001`

---

*Karatou Academy · Sprint 1 · Juin 2026*
*Stack : Next.js 14 + Supabase + Vercel · Build : Claude Code + Codex*
