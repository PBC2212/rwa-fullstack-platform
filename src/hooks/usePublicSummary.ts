import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicSummary {
  total_assets: number;
  real_estate_count: number;
  commodities_count: number;
  average_roi: number;
  total_value_millions: number;
}

export const usePublicSummary = () => {
  return useQuery({
    queryKey: ['publicSummary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets_public_summary')
        .select('*')
        .single();

      if (error) {
        // Fallback to static data if query fails
        return {
          total_assets: 6,
          real_estate_count: 3,
          commodities_count: 3,
          average_roi: 14.2,
          total_value_millions: 19.9
        } as PublicSummary;
      }

      return data as PublicSummary;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};