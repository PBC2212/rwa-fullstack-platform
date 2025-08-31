import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api.com' 
  : 'http://localhost:3001';

// Helper to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`,
  };
};

// API call wrapper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Pools
  getPools: () => apiCall('/api/pools'),
  depositToPool: (poolId: string, amount: number) => 
    apiCall(`/api/pools/${poolId}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  withdrawFromPool: (poolId: string, amount: number) => 
    apiCall(`/api/pools/${poolId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  // NFTs
  getNFTs: () => apiCall('/api/nfts'),
  mintNFT: (data: { name: string; description: string; imageUrl: string }) => 
    apiCall('/api/nfts/mint', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Collateral
  lockCollateral: (nftId: string) => 
    apiCall('/api/collateral/lock', {
      method: 'POST',
      body: JSON.stringify({ nftId }),
    }),
  unlockCollateral: (nftId: string) => 
    apiCall('/api/collateral/unlock', {
      method: 'POST',
      body: JSON.stringify({ nftId }),
    }),

  // Borrowing
  borrow: (collateralId: string, amount: number, currency: 'DAI' | 'USDC') => 
    apiCall('/api/borrow', {
      method: 'POST',
      body: JSON.stringify({ collateralId, amount, currency }),
    }),
  repay: (loanId: string, amount: number) => 
    apiCall('/api/repay', {
      method: 'POST',
      body: JSON.stringify({ loanId, amount }),
    }),

  // Portfolio & Transactions
  getPortfolio: () => apiCall('/api/portfolio'),
  getTransactions: () => apiCall('/api/transactions'),
};