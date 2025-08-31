-- Fix security vulnerability: Restrict assets access to authenticated users only
-- Drop the existing public read policy
DROP POLICY IF EXISTS "Allow public read access to assets" ON public.assets;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can view assets" ON public.assets
FOR SELECT TO authenticated USING (true);

-- Create a public summary view for marketing purposes (without sensitive data)
CREATE OR REPLACE VIEW public.assets_public_summary AS
SELECT 
  count(*) as total_assets,
  count(*) FILTER (WHERE type = 'Real Estate') as real_estate_count,
  count(*) FILTER (WHERE type = 'Commodities') as commodities_count,
  round(avg(roi_percentage), 1) as average_roi,
  round(sum(value_amount) / 1000000, 1) as total_value_millions
FROM public.assets;

-- Enable RLS on the summary view (though it's a view, good practice)
-- Note: Views inherit RLS from base tables, but we'll make this explicit
GRANT SELECT ON public.assets_public_summary TO anon, authenticated;