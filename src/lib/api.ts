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
  // Authentication
  login: (email: string, password: string) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // KYC
  uploadKYC: (documents: FormData) => 
    apiCall('/kyc/upload', {
      method: 'POST',
      body: documents,
    }),
  getKYCStatus: () => apiCall('/kyc/status'),

  // Asset Pledging
  pledgeAsset: (data: { 
    assetType: string; 
    estimatedValue: number; 
    description: string; 
    documents: string[] 
  }) => 
    apiCall('/assets/pledge', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPledgedAssets: () => apiCall('/assets/my-pledged'),

  // Tokens
  getMyTokens: () => apiCall('/tokens/my-tokens'),
  mintToken: (assetId: string, data: { 
    tokenSymbol: string; 
    totalSupply: number; 
    fractional: boolean 
  }) => 
    apiCall(`/tokens/mint/${assetId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Marketplace
  getMarketplaceListings: () => apiCall('/marketplace/listings'),
  buyToken: (tokenId: string, amount: number) => 
    apiCall('/marketplace/buy', {
      method: 'POST',
      body: JSON.stringify({ tokenId, amount }),
    }),
  sellToken: (tokenId: string, amount: number, price: number) => 
    apiCall('/marketplace/sell', {
      method: 'POST',
      body: JSON.stringify({ tokenId, amount, price }),
    }),

  // Liquidity Pools
  getLiquidityPools: () => apiCall('/liquidity/pools'),
  addLiquidity: (poolId: string, tokenA: number, tokenB: number) => 
    apiCall('/liquidity/add', {
      method: 'POST',
      body: JSON.stringify({ poolId, tokenA, tokenB }),
    }),
  withdrawLiquidity: (poolId: string, lpTokens: number) => 
    apiCall('/liquidity/withdraw', {
      method: 'POST',
      body: JSON.stringify({ poolId, lpTokens }),
    }),

  // Transactions
  getMyTransactions: () => apiCall('/transactions/my-history'),

  // Admin
  getPendingAssets: () => apiCall('/admin/pending-assets'),
  approveAsset: (assetId: string) => 
    apiCall('/admin/approve-asset', {
      method: 'POST',
      body: JSON.stringify({ assetId }),
    }),
  rejectAsset: (assetId: string, reason: string) => 
    apiCall('/admin/reject-asset', {
      method: 'POST',
      body: JSON.stringify({ assetId, reason }),
    }),

  // Legacy endpoints (keeping for backward compatibility)
  getPools: () => apiCall('/api/pools'),
  getNFTs: () => apiCall('/api/nfts'),
  getPortfolio: () => apiCall('/api/portfolio'),
  getTransactions: () => apiCall('/api/transactions'),
  
  // Legacy NFT/Collateral endpoints (keeping for backward compatibility)
  mintNFT: (data: { name: string; description: string; imageUrl: string }) => 
    apiCall('/api/nfts/mint', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
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
  
  // Legacy Pool endpoints (keeping for backward compatibility)
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
  
  // Legacy Borrowing endpoints (keeping for backward compatibility)
  borrow: (collateralId: string, amount: number, currency: 'DAI' | 'USDC') => 
    apiCall('/api/borrow', {
      method: 'POST',
      body: JSON.stringify({ collateralId, amount, currency }),
    }),
};