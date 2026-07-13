-- Crafting Tales — Supabase schema (v2: JSONB product storage)
-- This REPLACES the earlier relational schema. Run in Supabase SQL Editor.
-- Safe to run even if the old tables from schema v1 already exist — they're dropped first.

DROP TABLE IF EXISTS product_videos CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Categories (slug/label pairs, matches data/products.json "categories")
CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Products — the "data" column holds the exact shape main.js already expects:
-- { id, name, category, tags, price, featured, customizable, customLabel, badge,
--   description, specs: [[label,value]...], media: [{type,src}...], variants?: {...} }
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category TEXT REFERENCES categories(slug) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold')),
  sort_order INT DEFAULT 0,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_status ON products(status);

-- Site-wide settings (whatsapp, instagram, currency, lead times) — one row
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp TEXT,
  instagram TEXT,
  currency TEXT DEFAULT '₹',
  processing_days_min INT,
  processing_days_max INT,
  delivery_days_min INT,
  delivery_days_max INT
);

-- Seed categories
INSERT INTO categories (slug, label, sort_order) VALUES
  ('all', 'All', 0),
  ('preservation', 'Preservation', 1),
  ('frames', 'Frames', 2),
  ('keychains', 'Keychains', 3),
  ('resin-art', 'Resin Art', 4),
  ('gifts', 'Gifts', 5);

INSERT INTO site_settings (id, whatsapp, instagram, currency, processing_days_min, processing_days_max, delivery_days_min, delivery_days_max)
VALUES (1, '918435588589', 'crafting_tales_by_vaishnavi', '₹', 15, 20, 7, 10);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active products and all lookup/reference data
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public read settings" ON site_settings
  FOR SELECT USING (true);

-- Authenticated admin can do everything (SELECT included, so admin sees drafts too)
CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
