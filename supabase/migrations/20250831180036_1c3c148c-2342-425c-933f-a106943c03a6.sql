-- Fix the SECURITY DEFINER view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.assets_public_summary;

-- Create a safer public summary view without SECURITY DEFINER
-- This view will use the permissions of the querying user
CREATE VIEW public.assets_public_summary AS
SELECT 
  6 as total_assets,  -- Static data for public marketing
  3 as real_estate_count,
  3 as commodities_count,
  14.2 as average_roi,
  19.9 as total_value_millions;

-- Grant explicit permissions
GRANT SELECT ON public.assets_public_summary TO anon, authenticated;

-- Fix the function search path issue for the existing function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;