-- Create the assets table for tokenized assets
CREATE TABLE public.assets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Real Estate', 'Commodities')),
  image_url TEXT,
  value_amount DECIMAL(15,2) NOT NULL,
  value_currency TEXT NOT NULL DEFAULT 'USD',
  tokenized_percentage DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (tokenized_percentage >= 0 AND tokenized_percentage <= 100),
  roi_percentage DECIMAL(5,2) NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active Trading', 'Fully Tokenized', 'Tokenizing', 'Complete')),
  investors_count INTEGER NOT NULL DEFAULT 0,
  total_tokens BIGINT NOT NULL,
  available_tokens BIGINT NOT NULL DEFAULT 0,
  token_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  minimum_investment DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_assets_type ON public.assets(type);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_assets_created_at ON public.assets(created_at);

-- Enable Row Level Security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to assets
CREATE POLICY "Allow public read access to assets" ON public.assets
FOR SELECT TO public USING (true);

-- Insert sample data
INSERT INTO public.assets (name, type, image_url, value_amount, roi_percentage, location, status, investors_count, total_tokens, available_tokens, token_price, minimum_investment, description, highlights) VALUES
('Premium Office Complex', 'Real Estate', NULL, 2500000.00, 12.5, 'New York, NY', 'Active Trading', 156, 2500000, 875000, 1.00, 1000.00, 'Prime commercial real estate in Manhattan financial district', ARRAY['Prime location', 'High occupancy rate', 'Stable rental income']),
('Luxury Residential Tower', 'Real Estate', NULL, 4200000.00, 15.2, 'Miami, FL', 'Tokenizing', 89, 4200000, 1680000, 1.00, 2500.00, 'Luxury waterfront residential development with premium amenities', ARRAY['Waterfront location', 'Luxury amenities', 'High appreciation potential']),
('Industrial Warehouse Complex', 'Real Estate', NULL, 1800000.00, 10.8, 'Phoenix, AZ', 'Fully Tokenized', 234, 1800000, 0, 1.00, 500.00, 'Modern logistics and distribution center in growing market', ARRAY['Strategic location', 'Modern facilities', 'Long-term leases']),
('Gold Mining Operations', 'Commodities', NULL, 3500000.00, 18.7, 'Nevada, USA', 'Active Trading', 312, 3500000, 1225000, 1.00, 1500.00, 'Established gold mining operation with proven reserves', ARRAY['Proven reserves', 'Modern equipment', 'Experienced management']),
('Agricultural Land Portfolio', 'Commodities', NULL, 2100000.00, 14.3, 'Iowa, USA', 'Tokenizing', 145, 2100000, 1260000, 1.00, 750.00, 'Premium farmland portfolio in Americas agricultural heartland', ARRAY['Prime soil quality', 'Water rights included', 'Sustainable practices']),
('Renewable Energy Project', 'Commodities', NULL, 5800000.00, 16.9, 'Texas, USA', 'Complete', 478, 5800000, 0, 1.00, 2000.00, 'Large-scale solar energy installation with power purchase agreements', ARRAY['20-year contracts', 'Clean energy', 'Government incentives']);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();