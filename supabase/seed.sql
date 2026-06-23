-- ============================================================
-- Seed data for FreelancerDesk
-- 
-- HOW TO USE:
-- 1. Sign up in your app first to create your auth.users row
-- 2. Go to Supabase dashboard → SQL Editor
-- 3. Run this query to get your user ID:
--    SELECT id FROM auth.users LIMIT 1;
-- 4. Replace ALL occurrences of the placeholder below with your actual ID
-- 5. Run this entire file in the SQL Editor
--
-- YOUR USER ID GOES HERE ↓ (replace this placeholder everywhere)
-- Placeholder: af9d5c39-8753-402f-9521-763953b7e425
-- ============================================================

DO $$
DECLARE
  uid UUID := 'af9d5c39-8753-402f-9521-763953b7e425'; -- ← replace this

  -- client IDs
  client1 UUID := gen_random_uuid();
  client2 UUID := gen_random_uuid();
  client3 UUID := gen_random_uuid();
  client4 UUID := gen_random_uuid();

  -- project IDs
  project1 UUID := gen_random_uuid();
  project2 UUID := gen_random_uuid();
  project3 UUID := gen_random_uuid();
  project4 UUID := gen_random_uuid();
  project5 UUID := gen_random_uuid();

BEGIN

-- ── CLIENTS ──────────────────────────────────────────────────
INSERT INTO clients (id, user_id, name, email, phone, address, notes) VALUES
  (
    client1, uid,
    'Felix Dalung',
    'felix@dalungcreatives.com',
    '+234 802 345 6789',
    'Abuja, FCT',
    'Long-term client. Prefers communication via WhatsApp. Usually pays within 3 days of invoice.'
  ),
  (
    client2, uid,
    'Chinaza Okonkwo',
    'chinaza@okonkwomedia.ng',
    '+234 803 456 7890',
    'Lagos, Lagos State',
    'Runs a digital marketing agency. Frequently needs landing pages and brand assets.'
  ),
  (
    client3, uid,
    'Blast Media Ltd',
    'hello@blastmedia.ng',
    '+234 901 234 5678',
    'Port Harcourt, Rivers State',
    'Corporate client. Purchase orders required before work begins. Net-30 payment terms.'
  ),
  (
    client4, uid,
    'Amaka Eze',
    'amaka@ezeconsult.com',
    '+234 805 678 9012',
    'Enugu, Enugu State',
    'Consultant. Referred by Felix. Very detail-oriented — always send progress updates.'
  );

-- ── PROJECTS ─────────────────────────────────────────────────
INSERT INTO projects (id, user_id, client_id, name, details, start_date, due_date, status) VALUES
  (
    project1, uid, client1,
    'Brand Identity Redesign',
    'Full rebrand including logo, color palette, typography system, and brand guidelines document.',
    CURRENT_DATE - INTERVAL '20 days',
    CURRENT_DATE + INTERVAL '5 days',
    'active'
  ),
  (
    project2, uid, client2,
    'E-commerce Landing Page',
    'High-converting product landing page with animations, mobile-first design, and Paystack integration.',
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '12 days',
    'active'
  ),
  (
    project3, uid, client3,
    'Annual Report Design',
    '40-page annual report layout in InDesign. Client provides copy and photos.',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE - INTERVAL '2 days',
    'completed'
  ),
  (
    project4, uid, client4,
    'Pitch Deck — Series A',
    '18-slide investor pitch deck. Needs to feel premium and data-driven.',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '9 days',
    'active'
  ),
  (
    project5, uid, client1,
    'Social Media Templates',
    'Set of 20 Figma templates for Instagram, Twitter, and LinkedIn posts.',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '20 days',
    'on_hold'
  );

-- ── TASKS ────────────────────────────────────────────────────
INSERT INTO tasks (user_id, project_id, title, description, status, due_date) VALUES
  -- Brand Identity (project1)
  (uid, project1, 'Logo concepts (3 directions)', 'Present 3 distinct logo concepts for client review', 'done', CURRENT_DATE - INTERVAL '10 days'),
  (uid, project1, 'Finalise logo after feedback', 'Incorporate client revisions into final logo files', 'done', CURRENT_DATE - INTERVAL '5 days'),
  (uid, project1, 'Build color palette and typography', 'Define primary, secondary, and neutral colors. Choose font pairing.', 'in_progress', CURRENT_DATE + INTERVAL '2 days'),
  (uid, project1, 'Brand guidelines document', 'Compile all brand assets into a PDF guidelines doc', 'todo', CURRENT_DATE + INTERVAL '4 days'),

  -- E-commerce Landing Page (project2)
  (uid, project2, 'Wireframe and layout', 'Low-fidelity wireframe approved by client before design begins', 'done', CURRENT_DATE - INTERVAL '7 days'),
  (uid, project2, 'Design in Figma', 'Full high-fidelity design with all breakpoints', 'in_progress', CURRENT_DATE + INTERVAL '6 days'),
  (uid, project2, 'Develop with Next.js', 'Build the page with animations and Paystack checkout', 'todo', CURRENT_DATE + INTERVAL '11 days'),

  -- Pitch Deck (project4)
  (uid, project4, 'Content outline and structure', 'Work with client to outline the 18 slides and key messages', 'done', CURRENT_DATE - INTERVAL '3 days'),
  (uid, project4, 'Slide design', 'Design all slides in Figma using premium dark theme', 'in_progress', CURRENT_DATE + INTERVAL '7 days'),
  (uid, project4, 'Export and deliver', 'Export as PDF and PPTX, share via Google Drive', 'todo', CURRENT_DATE + INTERVAL '9 days'),

  -- Standalone tasks (no project)
  (uid, NULL, 'Update portfolio website', 'Add 3 recent projects to portfolio and update bio', 'todo', CURRENT_DATE + INTERVAL '7 days'),
  (uid, NULL, 'Send invoice to Blast Media', 'Invoice for the Annual Report project — ₦180,000', 'todo', CURRENT_DATE + INTERVAL '1 day'),
  (uid, NULL, 'Respond to new client inquiry', 'New lead from Instagram DMs asking about web design rates', 'in_progress', CURRENT_DATE);

-- ── EARNINGS ─────────────────────────────────────────────────
INSERT INTO earnings (user_id, project_id, amount, description, date) VALUES
  -- This year — monthly spread
  (uid, project3, 180000, 'Annual Report Design — Blast Media', CURRENT_DATE - INTERVAL '2 days'),
  (uid, project1, 75000,  'Brand Identity — 50% upfront deposit', CURRENT_DATE - INTERVAL '20 days'),
  (uid, project2, 120000, 'Landing Page — full payment', CURRENT_DATE - INTERVAL '35 days'),
  (uid, NULL,     50000,  'Logo design — one-off client', CURRENT_DATE - INTERVAL '45 days'),
  (uid, NULL,     95000,  'Social media content — monthly retainer', CURRENT_DATE - INTERVAL '60 days'),
  (uid, NULL,     200000, 'Mobile app UI — full project', CURRENT_DATE - INTERVAL '75 days'),
  (uid, NULL,     65000,  'Brand audit and strategy', CURRENT_DATE - INTERVAL '90 days'),
  (uid, NULL,     110000, 'Website redesign — deposit', CURRENT_DATE - INTERVAL '105 days'),
  (uid, NULL,     80000,  'Pitch deck design', CURRENT_DATE - INTERVAL '120 days'),
  (uid, NULL,     145000, 'E-commerce UI kit', CURRENT_DATE - INTERVAL '135 days'),
  (uid, NULL,     90000,  'Brand identity — startup client', CURRENT_DATE - INTERVAL '150 days'),
  (uid, NULL,     160000, 'Full website build', CURRENT_DATE - INTERVAL '165 days');

END $$;