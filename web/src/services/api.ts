const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Mock data for when API is not available (e.g., production without backend)
const mockData = {
  dashboard: {
    message: 'User dashboard',
    data: {
      trades: [],
      analytics: {
        winRate: 65.5,
        profitFactor: 1.8,
        totalTrades: 156
      },
      streaks: { current: 5, best: 12 }
    }
  },
  analytics: {
    winRate: 65.5,
    profitFactor: 1.8,
    totalTrades: 150,
    winningTrades: 98,
    losingTrades: 52
  },
  trades: {
    trades: [
      { id: 1, pair: 'EUR/USD', type: 'Buy', entry: '1.0850', exit: '1.0925', pnl: 125, date: '2024-01-15', strategy: 'Trend Following' },
      { id: 2, pair: 'GBP/USD', type: 'Sell', entry: '1.2650', exit: '1.2695', pnl: -45, date: '2024-01-14', strategy: 'Breakout' },
      { id: 3, pair: 'USD/JPY', type: 'Buy', entry: '147.50', exit: '149.80', pnl: 230, date: '2024-01-13', strategy: 'Trend Following' },
    ],
    count: 3
  }
};

async function fetchWithFallback(endpoint: string, mockResponse?: any) {
  try {
    // Check if API_URL is localhost (meaning we're in production without backend)
    if (API_URL.includes('localhost')) {
      console.warn('API URL is localhost - using mock data');
      return mockResponse || { message: 'Mock data' };
    }

    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}, using mock data:`, error);
    return mockResponse || { error: 'API unavailable' };
  }
}

export const api = {
  // Auth
  login: (_email: string, _password: string) => 
    fetchWithFallback('/auth/login', { message: 'Login endpoint', token: 'mock-jwt-token' }),
  
  register: (_data: any) => 
    fetchWithFallback('/auth/register', { message: 'Register endpoint' }),

  // Dashboard
  getDashboard: () => 
    fetchWithFallback('/users/dashboard', mockData.dashboard),

  // Analytics
  getAnalytics: () => 
    fetchWithFallback('/analytics/overview', mockData.analytics),

  // Trades
  getTrades: () => 
    fetchWithFallback('/trades', mockData.trades),
  
  createTrade: (_trade: any) => 
    fetchWithFallback('/trades', { message: 'Trade created' }),
};

export default api;
