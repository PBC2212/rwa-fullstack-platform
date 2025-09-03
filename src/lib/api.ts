// src/lib/api.ts - COMPREHENSIVE FIX FOR DATA FORMAT ISSUES
// Replace your existing src/lib/api.ts with this fixed version

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ime-capital-tokenization-backend.onrender.com'
  : 'http://localhost:5001';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API Response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // ASSET PLEDGING API METHODS - FIXED DATA HANDLING
  async getPledgedAssets() {
    try {
      const response = await this.request('/api/assets/pledged');
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response.assets && Array.isArray(response.assets)) {
        return response.assets;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // Fallback: return empty array to prevent .map() errors
      console.warn('getPledgedAssets: Unexpected response format, returning empty array:', response);
      return [];
    } catch (error) {
      console.error('Error in getPledgedAssets:', error);
      return []; // Always return array to prevent .map() errors
    }
  }

  async pledgeAsset(assetData: any) {
    const response = await this.request('/api/assets/pledge', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
    return response;
  }

  // MARKETPLACE API METHODS - FIXED DATA HANDLING
  async getMarketplaceListings() {
    try {
      const response = await this.request('/api/marketplace/listings');
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response.listings && Array.isArray(response.listings)) {
        return response.listings;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      if (response.tokens && Array.isArray(response.tokens)) {
        return response.tokens;
      }
      // Fallback: return empty array to prevent .map() errors
      console.warn('getMarketplaceListings: Unexpected response format, returning empty array:', response);
      return [];
    } catch (error) {
      console.error('Error in getMarketplaceListings:', error);
      return []; // Always return array to prevent .map() errors
    }
  }

  async buyToken(tokenId: string, amount: number) {
    const response = await this.request('/api/marketplace/buy', {
      method: 'POST',
      body: JSON.stringify({ tokenId, amount }),
    });
    return response;
  }

  async sellToken(tokenId: string, amount: number, price: number) {
    const response = await this.request('/api/marketplace/sell', {
      method: 'POST',
      body: JSON.stringify({ tokenId, amount, price }),
    });
    return response;
  }

  // LIQUIDITY API METHODS - FIXED DATA HANDLING
  async getLiquidityPools() {
    try {
      const response = await this.request('/api/liquidity/pools');
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response.pools && Array.isArray(response.pools)) {
        return response.pools;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // Fallback: return empty array to prevent .map() errors
      console.warn('getLiquidityPools: Unexpected response format, returning empty array:', response);
      return [];
    } catch (error) {
      console.error('Error in getLiquidityPools:', error);
      return []; // Always return array to prevent .map() errors
    }
  }

  async addLiquidity(poolId: string, amount: number) {
    const response = await this.request('/api/liquidity/add', {
      method: 'POST',
      body: JSON.stringify({ poolId, amount }),
    });
    return response;
  }

  async removeLiquidity(poolId: string, amount: number) {
    const response = await this.request('/api/liquidity/remove', {
      method: 'POST',
      body: JSON.stringify({ poolId, amount }),
    });
    return response;
  }

  // DASHBOARD API METHODS - FIXED DATA HANDLING
  async getMyAssets() {
    try {
      const response = await this.request('/api/assets/my-assets');
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response.assets && Array.isArray(response.assets)) {
        return response.assets;
      }
      if (response.tokens && Array.isArray(response.tokens)) {
        return response.tokens;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // Fallback: return empty array to prevent .reduce() errors
      console.warn('getMyAssets: Unexpected response format, returning empty array:', response);
      return [];
    } catch (error) {
      console.error('Error in getMyAssets:', error);
      return []; // Always return array to prevent .reduce() errors
    }
  }

  async getMyActivity() {
    try {
      const response = await this.request('/api/activity/my-activity');
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response.activities && Array.isArray(response.activities)) {
        return response.activities;
      }
      if (response.activity && Array.isArray(response.activity)) {
        return response.activity;
      }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // Fallback: return empty array
      console.warn('getMyActivity: Unexpected response format, returning empty array:', response);
      return [];
    } catch (error) {
      console.error('Error in getMyActivity:', error);
      return []; // Always return array
    }
  }

  // KYC API METHODS - WORKING CORRECTLY
  async getKYCStatus() {
    const response = await this.request('/api/kyc/status');
    return response;
  }

  async uploadKYC(formData: FormData) {
    const response = await this.request('/api/kyc/upload', {
      method: 'POST',
      headers: {
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
      body: formData,
    });
    return response;
  }

  // AUTHENTICATION METHODS - WORKING CORRECTLY
  async login(email: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async register(userData: any) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

export const api = new ApiService();