-- IME Tokenization Platform - Assets Table Setup
-- Run this SQL in your Supabase SQL Editor to create the assets table

-- Create assets table for tokenized assets
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Real Estate', 'Commodities')),
  image_url TEXT,
  value_amount DECIMAL(15,2) NOT NULL,
  value_currency TEXT DEFAULT 'USD',
  tokenized_percentage INTEGER NOT NULL CHECK (tokenized_percentage >= 0 AND tokenized_percentage <= 100),
  roi_percentage DECIMAL(5,2) NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active Trading', 'Fully Tokenized', 'Tokenizing', 'Complete')),
  investors_count INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL,
  available_tokens INTEGER NOT NULL,
  token_price DECIMAL(10,2) NOT NULL,
  minimum_investment DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at);

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read assets (public marketplace)
CREATE POLICY "Allow public read access to assets" 
ON assets FOR SELECT 
TO public 
USING (true);

-- Insert sample data
INSERT INTO assets (
  name, type, image_url, value_amount, tokenized_percentage, roi_percentage, 
  location, status, investors_count, total_tokens, available_tokens, 
  token_price, minimum_investment, description, highlights
) VALUES 
(
  'Detroit Complex Apartments',
  'Real Estate',
  '/src/assets/real-estate-token.jpg',
  45200000,
  85,
  10.4,
  'Detroit, MI',
  'Active Trading',
  1247,
  45200,
  6780,
  1000,
  5000,
  'Premium apartment complex with 240 units in Detroit''s revitalized downtown district.',
  ARRAY['Prime Location', 'High Occupancy Rate', 'Stable Income', 'Professional Management']
),
(
  'Ruby Structured Deal',
  'Commodities',
  '/src/assets/commodities-token.jpg',
  28700000,
  92,
  8.9,
  'Swiss Vault',
  'Fully Tokenized',
  834,
  28700,
  2296,
  1000,
  10000,
  'Certified Grade AAA rubies stored in secure Swiss vault facilities with full insurance coverage.',
  ARRAY['Insurance Coverage', 'Grade AAA Quality', 'Secure Storage', 'Market Liquidity']
),
(
  'Industrial Complex Dallas',
  'Real Estate',
  '/src/assets/real-estate-token.jpg',
  32100000,
  67,
  15.2,
  'Dallas, TX',
  'Tokenizing',
  634,
  32100,
  10593,
  1000,
  5000,
  'State-of-the-art industrial facility with Fortune 500 tenants and long-term lease agreements.',
  ARRAY['Fortune 500 Tenants', 'Long-term Leases', 'Modern Facility', 'Expansion Ready']
),
(
  'Precious Metals Collection',
  'Commodities',
  '/src/assets/commodities-token.jpg',
  19800000,
  100,
  11.7,
  'London Vault',
  'Complete',
  567,
  19800,
  0,
  1000,
  10000,
  'Diversified portfolio of platinum, silver, palladium, and rare earth elements.',
  ARRAY['Diversified Portfolio', 'Precious Metals', 'Market Hedge', 'Physical Storage']
),
(
  'Miami Beach Resort',
  'Real Estate',
  '/src/assets/real-estate-token.jpg',
  67500000,
  78,
  12.8,
  'Miami, FL',
  'Active Trading',
  1895,
  67500,
  14850,
  1000,
  5000,
  'Luxury beachfront resort with 180 rooms, spa facilities, and prime ocean access.',
  ARRAY['Beachfront Location', 'Luxury Amenities', 'Tourism Hub', 'Seasonal Revenue']
),
(
  'Gold Bars Collection',
  'Commodities',
  '/src/assets/commodities-token.jpg',
  42300000,
  88,
  9.6,
  'Singapore Vault',
  'Active Trading',
  1156,
  42300,
  5076,
  1000,
  10000,
  'LBMA certified gold bars stored in Singapore''s most secure vault facilities.',
  ARRAY['LBMA Certified', 'Singapore Storage', 'Market Liquidity', 'Inflation Hedge']
);