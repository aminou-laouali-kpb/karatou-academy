-- Seed data for local development (supabase db reset runs this automatically).
-- One published, free-preview module with a full 8-step lesson.

INSERT INTO modules (id, slug, title_fr, title_en, title_ha, description_fr, description_en, order_index, is_published, is_free_preview)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'introduction-ia',
  'Introduction à l''Intelligence Artificielle',
  'Introduction to Artificial Intelligence',
  'Gabatarwa ga Basira ta Roba',
  'Comprendre ce qu''est l''IA, son histoire et son impact au quotidien en Afrique.',
  'Understand what AI is, its history and its everyday impact in Africa.',
  0, TRUE, TRUE
);

INSERT INTO courses (id, module_id, slug, order_index, title_fr, title_en, duration_minutes, is_published)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'quest-ce-que-lia', 0,
  'Qu''est-ce que l''IA ?', 'What is AI?', 10, TRUE
);

INSERT INTO content_blocks (course_id, block_type, order_index, content_fr, content_en) VALUES
  ('22222222-2222-2222-2222-222222222222', 'objective', 0,
   '{"text": "À la fin de cette leçon, vous saurez définir l''IA avec vos propres mots."}',
   '{"text": "By the end of this lesson, you''ll define AI in your own words."}'),
  ('22222222-2222-2222-2222-222222222222', 'video', 1,
   '{"url": "https://www.youtube.com/watch?v=ad79nYk2keg", "title": "L''IA expliquée simplement"}',
   '{"url": "https://www.youtube.com/watch?v=ad79nYk2keg", "title": "AI explained simply"}'),
  ('22222222-2222-2222-2222-222222222222', 'text', 2,
   '{"cards": [{"heading": "Une définition simple", "body": "L''IA est la capacité d''une machine à imiter des fonctions humaines."}]}',
   '{"cards": [{"heading": "A simple definition", "body": "AI is a machine''s ability to imitate human functions."}]}'),
  ('22222222-2222-2222-2222-222222222222', 'example', 3,
   '{"heading": "Exemple local", "body": "Aïcha tient une boutique à Niamey. Une IA l''aide à prévoir son stock.", "amount": 15000}',
   '{"heading": "Local example", "body": "Aïcha runs a shop in Niamey. An AI helps her forecast stock."}'),
  ('22222222-2222-2222-2222-222222222222', 'practice', 4,
   '{"prompt": "Citez une tâche qu''une IA pourrait vous aider à accomplir.", "placeholder": "Par exemple…"}',
   '{"prompt": "Name a task an AI could help you with.", "placeholder": "For example…"}'),
  ('22222222-2222-2222-2222-222222222222', 'reflection', 6,
   '{"prompt": "Comment l''IA pourrait-elle changer votre activité ?"}',
   '{"prompt": "How could AI change your work?"}');

-- Quiz block + its questions
WITH quiz_block AS (
  INSERT INTO content_blocks (course_id, block_type, order_index, content_fr, content_en)
  VALUES ('22222222-2222-2222-2222-222222222222', 'quiz', 5,
          '{"title": "Vérifions vos acquis"}', '{"title": "Check your understanding"}')
  RETURNING id
)
INSERT INTO quiz_questions (block_id, question_fr, question_en, options_fr, options_en, correct_index, explanation_fr, order_index)
SELECT id, 'Que signifie « IA » ?', 'What does "AI" mean?',
       '["Intelligence Artificielle","Information Automatique","Interface Avancée"]'::jsonb,
       '["Artificial Intelligence","Automatic Information","Advanced Interface"]'::jsonb,
       0, 'IA signifie Intelligence Artificielle.', 0
FROM quiz_block;

-- Glossary highlight block
INSERT INTO content_blocks (course_id, block_type, order_index, content_fr, content_en)
VALUES ('22222222-2222-2222-2222-222222222222', 'glossary_highlight', 7, '{}', '{}');

INSERT INTO glossary_terms (module_id, term_fr, term_en, definition_fr, definition_en) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Intelligence Artificielle', 'Artificial Intelligence',
   'Domaine de l''informatique visant à créer des machines capables de tâches intelligentes.',
   'A field of computing aiming to build machines capable of intelligent tasks.'),
  ('11111111-1111-1111-1111-111111111111', 'Apprentissage automatique', 'Machine Learning',
   'Méthode permettant à une machine d''apprendre à partir d''exemples.',
   'A method allowing a machine to learn from examples.');
