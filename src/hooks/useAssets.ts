import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Asset {
  id: number;
  name: string;
  type: 'Real Estate' | 'Commodities';
  image_url: string | null;
  value_amount: number;
  value_currency: string;
  tokenized_percentage: number;
  roi_percentage: number;
  location: string;
  status: 'Active Trading' | 'Fully Tokenized' | 'Tokenizing' | 'Complete';
  investors_count: number;
  total_tokens: number;
  available_tokens: number;
  token_price: number;
  minimum_investment: number;
  description: string;
  highlights: string[];
  created_at: string;
  updated_at: string;
}

export const useAssets = (type?: string) => {
  return useQuery({
    queryKey: ['assets', type],
    queryFn: async () => {
      let query = supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (type && type !== 'All') {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch assets: ${error.message}`);
      }

      return data as Asset[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAsset = (id: number) => {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch asset: ${error.message}`);
      }

      return data as Asset;
    },
    enabled: !!id,
  });
};