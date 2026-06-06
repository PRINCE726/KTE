-- Run this in the Supabase SQL Editor

-- Table: inscriptions_gala
CREATE TABLE inscriptions_gala (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  type_pass TEXT NOT NULL CHECK (type_pass IN ('bachelier', 'vip')),
  lycee TEXT,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirme', 'annule')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: inscriptions_jpo
CREATE TABLE inscriptions_jpo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  pole TEXT NOT NULL,
  session TEXT NOT NULL,
  lycee TEXT,
  classe TEXT,
  source TEXT,
  statut TEXT DEFAULT 'en_attente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: demandes_caravane
CREATE TABLE demandes_caravane (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lycee TEXT NOT NULL,
  arrondissement TEXT NOT NULL,
  responsable TEXT NOT NULL,
  telephone TEXT NOT NULL,
  email TEXT NOT NULL,
  nb_eleves INTEGER,
  message TEXT,
  statut TEXT DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_traitement', 'traite')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: newsletter
CREATE TABLE newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: articles
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  contenu TEXT,
  categorie TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE inscriptions_gala ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions_jpo ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_caravane ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow insert from anon
CREATE POLICY "Allow public insert on inscriptions_gala" ON inscriptions_gala FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert on inscriptions_jpo" ON inscriptions_jpo FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert on demandes_caravane" ON demandes_caravane FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert on newsletter" ON newsletter FOR INSERT TO anon WITH CHECK (true);

-- Allow select for service_role only (or everything for service role since it bypasses RLS, but explicit is fine)
-- Actually, service_role bypasses RLS by default.
-- So just the anon policies are enough.
