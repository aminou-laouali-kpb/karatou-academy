# Karatou Academy

La plateforme de référence pour les compétences IA en Afrique francophone — trilingue (FR / EN / Hausa), mobile-first, PWA offline.

## Stack
- **Next.js 14** (App Router, TypeScript strict)
- **Supabase** (PostgreSQL + Auth + Storage)
- **Tailwind CSS** + composants maison (style shadcn/ui)
- **next-intl** (i18n sans préfixe d'URL)
- **next-pwa** (manifest + service worker)
- **@react-pdf/renderer**, Stripe / CinetPay, Resend (échafaudés)

## Démarrage
```bash
npm install
cp .env.example .env.local   # puis renseigner les clés Supabase
npm run dev
```
> Sans clés Supabase, l'app tourne en **mode démo** : un module d'exemple complet
> (leçon en 8 étapes, quiz, glossaire, certificat) est servi depuis `lib/sample-data.ts`,
> et l'authentification bascule en accès invité.

## Scripts
- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run lint` — ESLint

## Base de données
Migrations SQL dans `supabase/migrations/` (6 fichiers) + `supabase/seed.sql`.
```bash
npx supabase init
npx supabase link --project-ref <YOUR_PROJECT_REF>
npx supabase db push
npx supabase gen types typescript --linked > lib/supabase/types.ts
```

## Architecture
- `app/` — routes : `(auth)` (login/register/onboarding), `(app)` (dashboard, modules,
  learn, glossary, profile, certificates), `admin` (CMS), `verify/[uid]` (public).
- `components/` — `ui/` (primitives), `layout/`, `learn/` (LessonPlayer + 8 blocs),
  `modules/`, `glossary/`, `certificates/`, `admin/`.
- `lib/` — `supabase/`, `i18n/`, `data.ts` (accès données + fallback démo),
  `content.ts` (STEP_ORDER + localisation), `utils/`.

## Boucle d'apprentissage (8 étapes)
`objective → video → text → example → practice → quiz → reflection → glossary_highlight`
orchestrée par `components/learn/LessonPlayer.tsx`. La progression est enregistrée dans
`user_progress.last_block_index`, les réflexions sont sauvegardées automatiquement, et le
quiz donne une correction immédiate non bloquante.

## Sprint 1 — périmètre
Setup, design system, auth (email / téléphone OTP / invité), onboarding trilingue,
navigation 4 onglets, dashboard, modules, lecteur de leçon, glossaire, vérification
publique de certificat, CMS admin et PWA de base. Les paiements et la génération PDF
des certificats sont échafaudés mais hors périmètre Sprint 1.
