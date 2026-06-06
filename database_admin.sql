-- Run this SQL in Supabase

CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categorie TEXT NOT NULL,
  image_url TEXT,
  excerpt TEXT,
  body TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE galeries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  edition INTEGER NOT NULL,
  titre TEXT NOT NULL,
  date DATE,
  description TEXT,
  cover_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE galerie_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  galerie_id UUID REFERENCES galeries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  ordre INTEGER DEFAULT 0,
  legende TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evenements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  type TEXT CHECK (type IN ('gala','caravane','jpo','autre')),
  date TIMESTAMPTZ,
  lieu TEXT,
  description TEXT,
  statut TEXT DEFAULT 'upcoming' CHECK (statut IN ('upcoming','ongoing','past')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parametres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cle TEXT UNIQUE NOT NULL,
  valeur TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO parametres (cle, valeur) VALUES
  ('gala_date', '2026-06-28'),
  ('gala_lieu', 'Pointe-Noire, Congo'),
  ('pass_bachelier_prix', '15000'),
  ('pass_vip_prix', '25000'),
  ('telephone', '+242 05 328 7181'),
  ('email', 'kimiapriméevents@gmail.com'),
  ('whatsapp', '242053287181');

-- Enable RLS on all new tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerie_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE parametres ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for anon role where appropriate
CREATE POLICY "Allow SELECT on articles for public" ON articles FOR SELECT TO anon USING (published = true);
CREATE POLICY "Allow SELECT on galeries for public" ON galeries FOR SELECT TO anon USING (published = true);
CREATE POLICY "Allow SELECT on galerie_photos for public" ON galerie_photos FOR SELECT TO anon USING (true);
CREATE POLICY "Allow SELECT on evenements for public" ON evenements FOR SELECT TO anon USING (true);
CREATE POLICY "Allow SELECT on parametres for public" ON parametres FOR SELECT TO anon USING (true);

-- Service role bypasses RLS automatically, but just to be explicit:
-- Supabase automatically grants full access to the service_role key.

-- (You will also need to manually create the 'articles-images' and 'galeries' Storage buckets and make them public)
