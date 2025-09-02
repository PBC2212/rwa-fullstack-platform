const API_BASE_URL = 'http://localhost:5000/api';

// JWT Token management
const getToken = () => localStorage.getItem('jwt_token');
const setToken = (token: string) => localStorage.setItem('jwt_token', token);
const removeToken = () => localStorage.removeItem('jwt_token');

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// API call wrapper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers = getAuthHeaders();
  
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
  login: async (email: string, password: string) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },
  register: (email: string, password: string, name: string) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  getMe: () => apiCall('/auth/me'),
  logout: () => {
    removeToken();
  },

  // KYC
  submitKYC: (documents: FormData) => 
    apiCall('/kyc/submit', {
      method: 'POST',
      body: documents,
    }),
  uploadKYC: (documents: FormData) => 
    apiCall('/kyc/submit', {
      method: 'POST',
      body: documents,
    }),
  getKYCStatus: () => apiCall('/kyc/status'),

  // Assets & Tokenization
  pledgeAsset: (data: { 
    type: string; 
    value: number; 
    description: string; 
    docs: string[] 
  } | {
    assetType: string; 
    estimatedValue: number; 
    description: string; 
    documents: string[] 
  }) => 
    apiCall('/assets/pledge', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyAssets: () => apiCall('/assets/mine'),
  getPledgedAssets: () => apiCall('/assets/mine'),
  getMyTokens: () => apiCall('/assets/mine'),
  mintToken: (assetId: string, data?: any) => 
    apiCall(`/assets/${assetId}/mint`, {
      method: 'POST',
      ...(data && { body: JSON.stringify(data) }),
    }),
  getMarketplace: () => apiCall('/assets/marketplace'),
  getMarketplaceListings: () => apiCall('/assets/marketplace'),

  // Marketplace & Liquidity
  buyToken: (tokenId: string, amount?: number) => 
    apiCall(`/marketplace/buy/${tokenId}`, {
      method: 'POST',
      ...(amount && { body: JSON.stringify({ amount }) }),
    }),
  sellToken: (tokenId: string, amount?: number, price?: number) => 
    apiCall(`/marketplace/sell/${tokenId}`, {
      method: 'POST',
      ...(amount && price && { body: JSON.stringify({ amount, price }) }),
    }),
  provideLiquidity: (data: any) => 
    apiCall('/liquidity/provide', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  withdrawLiquidity: () => 
    apiCall('/liquidity/withdraw', {
      method: 'POST',
    }),
  getLiquidityPools: () => apiCall('/liquidity/pools'),

  // Activity & Health
  getMyActivity: () => apiCall('/activity/mine'),
  getHealth: () => apiCall('/health'),

  // Legacy endpoints (keeping for backward compatibility)
  getPools: () => apiCall('/liquidity/pools'),
  getNFTs: () => apiCall('/assets/mine'),
  getPortfolio: () => apiCall('/assets/mine'),
  getTransactions: () => apiCall('/activity/mine'),
  getMyTransactions: () => apiCall('/activity/mine'),
  
  // Legacy NFT/Collateral endpoints (keeping for backward compatibility)
  mintNFT: (data: { name: string; description: string; imageUrl: string }) => 
    apiCall('/assets/pledge', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  lockCollateral: (nftId: string) => 
    apiCall(`/assets/${nftId}/mint`, {
      method: 'POST',
      body: JSON.stringify({ nftId }),
    }),
  unlockCollateral: (nftId: string) => 
    apiCall(`/marketplace/sell/${nftId}`, {
      method: 'POST',
      body: JSON.stringify({ nftId }),
    }),
  
  // Legacy Pool endpoints (keeping for backward compatibility)
  depositToPool: (poolId: string, amount: number) => 
    apiCall('/liquidity/provide', {
      method: 'POST',
      body: JSON.stringify({ poolId, amount }),
    }),
  withdrawFromPool: (poolId: string, amount: number) => 
    apiCall('/liquidity/withdraw', {
      method: 'POST',
      body: JSON.stringify({ poolId, amount }),
    }),
  
  // Legacy Borrowing endpoints (keeping for backward compatibility)
  borrow: (collateralId: string, amount: number, currency: 'DAI' | 'USDC') => 
    apiCall(`/marketplace/buy/${collateralId}`, {
      method: 'POST',
      body: JSON.stringify({ collateralId, amount, currency }),
    }),

  // Admin endpoints
  getPendingAssets: () => apiCall('/assets/mine'),
  approveAsset: (assetId: string) => 
    apiCall(`/assets/${assetId}/mint`, {
      method: 'POST',
      body: JSON.stringify({ assetId }),
    }),
  rejectAsset: (assetId: string, reason: string) => 
    apiCall(`/marketplace/sell/${assetId}`, {
      method: 'POST',  
      body: JSON.stringify({ assetId, reason }),
    }),
};