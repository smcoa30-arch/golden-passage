import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, Activity, Target, Plus, DollarSign, PieChart, BarChart3, Clock, TrendingDown, Lock, Brain, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ==================== TYPES ====================

interface Trade {
  id: string;
  pair: string;
  type: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  pnl: number;
  date: string;
  strategy: string;
  psychology?: string;
  timestamp: number;
}

interface EquityPoint {
  date: string;
  equity: number;
  drawdown: number;
}

interface Stats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  totalPnl: number;
  currentStreak: number;
  avgWin: number;
  avgLoss: number;
  bestTrade: number;
  worstTrade: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
}

// ==================== PROP FIRM SETTINGS ====================

const PROP_FIRM_LIMITS = {
  dailyLoss: 0.04, // 4% daily loss limit
  maxDrawdown: 0.08, // 8% max drawdown
};

// ==================== AI STRATEGIES ====================

const aiStrategies = [
  {
    title: 'ICT Silver Bullet',
    description: 'High-probability setup during NY session windows',
    rules: ['Trade ONLY 10-11 AM or 2-3 PM EST', 'Mark PDH/PDL (Previous Day High/Low)', 'Wait for liquidity sweep', 'Confirm Market Structure Shift (MSS)', 'Entry: FVG or Breaker Block', 'Target: Opposite liquidity pool'],
    winRate: '76%',
    bestFor: 'NY Session Scalping'
  },
  {
    title: 'SMC Order Block',
    description: 'Institutional order flow with mitigation',
    rules: ['Mark H4/H1 Order Blocks', 'Identify unmitigated OBs', 'Wait for price to mitigate fresh OB', 'Entry: 1m-5m confirmation at OB', 'Stop: Beyond OB extreme', 'Target: Next unmitigated OB'],
    winRate: '71%',
    bestFor: 'Swing Trading'
  },
  {
    title: 'Price Action Flip Zone',
    description: 'Structure-based entries at key levels',
    rules: ['Identify clear HH/HL or LH/LL', 'Mark flip zone (previous S/R)', 'Wait for break of structure', 'Enter on retest with rejection', 'Stop: 10-15 pips beyond structure', 'Target: Next major structure'],
    winRate: '68%',
    bestFor: 'Trend Trading'
  },
  {
    title: 'Power of 3 + PD Arrays',
    description: 'ICT institutional cycle exploitation',
    rules: ['Identify Asia range consolidation', 'Wait for sweep of one side', 'Look for MSS back into range', 'Entry: OB or FVG after sweep', 'Target: 2-3x risk', 'Only trade during killzones'],
    winRate: '73%',
    bestFor: 'London/NY Sessions'
  }
];

// ==================== DYNAMIC MARKET STRATEGY ====================

interface MarketCondition {
  time: string;
  session: string;
  condition: string;
  recommendedStrategy: number;
  reason: string;
}

function getCurrentMarketCondition(): MarketCondition {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Convert to EST (rough approximation)
  const estHour = (hour - 5 + 24) % 24;
  
  // Determine session
  let session = 'Asia';
  if (estHour >= 3 && estHour < 10) session = 'London';
  if (estHour >= 8 && estHour < 17) session = 'New York';
  if ((estHour >= 3 && estHour < 5) || (estHour >= 8 && estHour < 10)) session = 'Overlap';
  
  // Weekend check
  if (day === 0 || day === 6) {
    return {
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      session: 'Weekend',
      condition: 'Markets Closed',
      recommendedStrategy: 1, // SMC Order Block for analysis
      reason: 'Markets are closed. Use this time to analyze Order Blocks and plan for the week ahead.'
    };
  }
  
  // Silver Bullet windows
  if ((estHour === 10) || (estHour === 14)) {
    return {
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      session,
      condition: 'Silver Bullet Window',
      recommendedStrategy: 0, // ICT Silver Bullet
      reason: `Currently in the ${estHour === 10 ? 'AM' : 'PM'} Silver Bullet window (10-11 AM / 2-3 PM EST). This is high-probability algorithmic execution time.`
    };
  }
  
  // NY Session
  if (session === 'New York' || session === 'Overlap') {
    return {
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      session,
      condition: 'High Volatility',
      recommendedStrategy: 3, // Power of 3
      reason: `${session} session active. Look for Asia range sweeps and Power of 3 setups as institutions accumulate/manipulate/distribute.`
    };
  }
  
  // London Session
  if (session === 'London') {
    return {
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      session,
      condition: 'Trend Establishment',
      recommendedStrategy: 2, // Price Action Flip
      reason: 'London session establishing daily trend. Watch for break of structure and flip zone retests on major pairs.'
    };
  }
  
  // Asia Session
  return {
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    session,
    condition: 'Consolidation',
    recommendedStrategy: 1, // SMC Order Block
    reason: 'Asia session typically consolidates. Mark order blocks and liquidity levels for London/NY breakouts.'
  };
}

const STORAGE_KEY = 'trades_v2';
const EQUITY_KEY = 'starting_equity';

// ==================== COMPONENT ====================

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTrades: 0, winRate: 0, profitFactor: 0, totalPnl: 0,
    currentStreak: 0, avgWin: 0, avgLoss: 0, bestTrade: 0, worstTrade: 0,
    maxDrawdown: 0, maxDrawdownPercent: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [startingEquity, setStartingEquity] = useState(10000);
  const [showEquitySettings, setShowEquitySettings] = useState(false);
  const [journalLocked, setJournalLocked] = useState(false);
  const [marketCondition, setMarketCondition] = useState<MarketCondition | null>(null);

  // Load trades
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTrades(JSON.parse(saved));
      } catch {
        setTrades([]);
      }
    }
    const savedEquity = localStorage.getItem(EQUITY_KEY);
    if (savedEquity) setStartingEquity(parseFloat(savedEquity));
    setLoading(false);
  }, []);

  // Update market condition periodically
  useEffect(() => {
    setMarketCondition(getCurrentMarketCondition());
    const interval = setInterval(() => {
      setMarketCondition(getCurrentMarketCondition());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Reset all data
  const handleResetData = () => {
    if (!confirm('WARNING: This will delete ALL your trades and reset your equity. This cannot be undone. Are you sure?')) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EQUITY_KEY);
    setTrades([]);
    setStartingEquity(10000);
    alert('All data has been reset. Starting fresh!');
  };

  // Reset prop firm limits (for demo/testing)
  const handleResetPropFirm = () => {
    if (!confirm('Reset prop firm risk limits? This will clear the trading halt.')) {
      return;
    }
    // Clear today's trades to reset daily loss
    const today = new Date().toISOString().split('T')[0];
    const filteredTrades = trades.filter(t => !t.date.startsWith(today));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTrades));
    setTrades(filteredTrades);
    alert('Prop firm limits reset. You can trade again!');
  };

  // Filter trades by time range
  const filteredTrades = useMemo(() => {
    if (timeRange === 'all') return trades;
    const now = Date.now();
    const days = timeRange === 'week' ? 7 : 30;
    const cutoff = now - (days * 24 * 60 * 60 * 1000);
    return trades.filter(t => (t.timestamp || new Date(t.date).getTime()) > cutoff);
  }, [trades, timeRange]);

  // Calculate equity curve
  const equityCurve = useMemo(() => {
    const sorted = [...trades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let equity = startingEquity;
    let peakEquity = startingEquity;
    const points: EquityPoint[] = [];
    
    sorted.forEach(trade => {
      equity += trade.pnl;
      if (equity > peakEquity) peakEquity = equity;
      const drawdown = peakEquity - equity;
      points.push({
        date: trade.date,
        equity: Math.round(equity * 100) / 100,
        drawdown: Math.round((drawdown / peakEquity) * 100 * 100) / 100
      });
    });
    
    return points;
  }, [trades, startingEquity]);

  // Calculate stats
  useEffect(() => {
    const wins = filteredTrades.filter(t => t.pnl > 0);
    const losses = filteredTrades.filter(t => t.pnl < 0);
    const winCount = wins.length;
    const lossCount = losses.length;
    
    const totalProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = losses.reduce((sum, t) => sum + Math.abs(t.pnl), 0);
    
    // Calculate max drawdown
    let maxDD = 0;
    let maxDDPercent = 0;
    let currentEquity = startingEquity;
    let peakEquity = startingEquity;
    
    filteredTrades.forEach(trade => {
      currentEquity += trade.pnl;
      if (currentEquity > peakEquity) peakEquity = currentEquity;
      const dd = peakEquity - currentEquity;
      const ddPercent = peakEquity > 0 ? (dd / peakEquity) * 100 : 0;
      if (dd > maxDD) {
        maxDD = dd;
        maxDDPercent = ddPercent;
      }
    });

    // Calculate streak
    let streak = 0;
    let maxStreak = 0;
    const sortedTrades = [...filteredTrades].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (const trade of sortedTrades) {
      if (trade.pnl > 0) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else if (trade.pnl < 0) {
        streak = 0;
      }
    }

    setStats({
      totalTrades: filteredTrades.length,
      winRate: filteredTrades.length > 0 ? (winCount / filteredTrades.length) * 100 : 0,
      profitFactor: totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0,
      totalPnl: filteredTrades.reduce((sum, t) => sum + t.pnl, 0),
      currentStreak: maxStreak,
      avgWin: winCount > 0 ? totalProfit / winCount : 0,
      avgLoss: lossCount > 0 ? totalLoss / lossCount : 0,
      bestTrade: filteredTrades.length > 0 ? Math.max(...filteredTrades.map(t => t.pnl), 0) : 0,
      worstTrade: filteredTrades.length > 0 ? Math.min(...filteredTrades.map(t => t.pnl), 0) : 0,
      maxDrawdown: maxDD,
      maxDrawdownPercent: maxDDPercent
    });

    // Check prop firm limits - only lock if there are actual losses
    const todayTrades = trades.filter(t => {
      const tradeDate = new Date(t.date).toDateString();
      const today = new Date().toDateString();
      return tradeDate === today;
    });
    const todayPnl = todayTrades.reduce((sum, t) => sum + t.pnl, 0);
    const todayLossPercent = todayPnl < 0 ? Math.abs(todayPnl) / startingEquity : 0;
    
    // Only lock if user has actual trades AND has exceeded limits
    const shouldLock = trades.length > 0 && (
      todayLossPercent >= PROP_FIRM_LIMITS.dailyLoss || 
      maxDDPercent >= PROP_FIRM_LIMITS.maxDrawdown * 100
    );
    
    setJournalLocked(shouldLock);
  }, [filteredTrades, startingEquity, trades]);

  // Daily P&L
  const dailyPnL = useMemo(() => {
    const grouped = filteredTrades.reduce((acc, trade) => {
      const date = trade.date;
      if (!acc[date]) acc[date] = { date, pnl: 0, trades: 0 };
      acc[date].pnl += trade.pnl;
      acc[date].trades += 1;
      return acc;
    }, {} as Record<string, { date: string; pnl: number; trades: number }>);
    
    return Object.values(grouped).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ).slice(-14);
  }, [filteredTrades]);

  // Strategy stats
  const strategyStats = useMemo(() => {
    const grouped = filteredTrades.reduce((acc, trade) => {
      if (!acc[trade.strategy]) {
        acc[trade.strategy] = { name: trade.strategy, trades: 0, wins: 0, pnl: 0, winRate: 0 };
      }
      acc[trade.strategy].trades++;
      if (trade.pnl > 0) acc[trade.strategy].wins++;
      acc[trade.strategy].pnl += trade.pnl;
      return acc;
    }, {} as Record<string, { name: string; trades: number; wins: number; pnl: number; winRate: number }>);
    
    Object.values(grouped).forEach(stat => {
      stat.winRate = stat.trades > 0 ? (stat.wins / stat.trades) * 100 : 0;
    });
    
    return Object.values(grouped).sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  // Forecast
  const forecast = useMemo(() => {
    if (dailyPnL.length < 3) return null;
    const avgDaily = dailyPnL.slice(-7).reduce((sum, d) => sum + d.pnl, 0) / Math.min(dailyPnL.length, 7);
    return { weekly: avgDaily * 7, monthly: avgDaily * 30 };
  }, [dailyPnL]);

  const recentTrades = useMemo(() => {
    return [...filteredTrades]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [filteredTrades]);

  const currentEquity = startingEquity + stats.totalPnl;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Prop Firm Alert */}
      {journalLocked && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="text-red-400" size={24} />
            <div>
              <h3 className="font-semibold text-red-400">Trading Halted - Risk Limit Reached</h3>
              <p className="text-red-300/80 text-sm">
                You've reached the prop firm daily loss limit (4%) or max drawdown (8%). 
                Take a break and review your strategy.
              </p>
            </div>
          </div>
          <div className="flex gap-3 ml-11">
            <button
              onClick={handleResetPropFirm}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-300 rounded-lg text-sm transition-colors"
            >
              <RotateCcw size={16} />
              Reset Risk Limits
            </button>
            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
            >
              <AlertTriangle size={16} />
              Reset All Data
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.email?.split('@')[0] || 'Trader'}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as 'week' | 'month' | 'all')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={handleResetData}
            className="flex items-center gap-2 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-colors"
            title="Reset all trading data"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button 
            onClick={() => navigate('/trades')}
            disabled={journalLocked}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <Plus size={20} />
            New Trade
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Current Equity"
          value={`$${currentEquity.toFixed(0)}`}
          subtext={`Starting: $${startingEquity.toLocaleString()}`}
          icon={DollarSign}
          color={currentEquity >= startingEquity ? 'green' : 'red'}
        />
        <StatCard 
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subtext={`${stats.totalTrades} trades`}
          icon={Target}
          color={stats.winRate >= 50 ? 'green' : 'red'}
        />
        <StatCard 
          title="Max Drawdown"
          value={`-${stats.maxDrawdownPercent.toFixed(1)}%`}
          subtext={`$${stats.maxDrawdown.toFixed(0)}`}
          icon={TrendingDown}
          color={stats.maxDrawdownPercent < 8 ? 'green' : 'red'}
        />
        <StatCard 
          title="Profit Factor"
          value={stats.profitFactor >= 999 ? '∞' : stats.profitFactor.toFixed(2)}
          subtext={stats.profitFactor >= 1.5 ? 'Excellent' : stats.profitFactor >= 1 ? 'Profitable' : 'Improvement needed'}
          icon={Activity}
          color={stats.profitFactor >= 1 ? 'green' : 'red'}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equity Curve */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <TrendingUp className="text-green-500" size={24} />
                Equity Curve
              </h2>
              <button
                onClick={() => setShowEquitySettings(true)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Set Starting Equity
              </button>
            </div>
            
            {equityCurve.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No trading data available</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Chart */}
                <div className="relative h-48 bg-gray-800/50 rounded-lg p-4">
                  <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                      <line key={y} x1="0" y1={50 - y * 0.5} x2="100" y2={50 - y * 0.5} stroke="#374151" strokeWidth="0.2" />
                    ))}
                    
                    {/* Equity line */}
                    {equityCurve.length > 1 && (() => {
                      const minEq = Math.min(...equityCurve.map(e => e.equity), startingEquity);
                      const maxEq = Math.max(...equityCurve.map(e => e.equity), startingEquity);
                      const range = maxEq - minEq || 1;
                      
                      const points = equityCurve.map((pt, i) => {
                        const x = (i / (equityCurve.length - 1)) * 100;
                        const y = 50 - ((pt.equity - minEq) / range) * 50;
                        return `${x},${y}`;
                      }).join(' ');
                      
                      return (
                        <polyline
                          points={points}
                          fill="none"
                          stroke={currentEquity >= startingEquity ? "#22c55e" : "#ef4444"}
                          strokeWidth="0.5"
                        />
                      );
                    })()}
                    
                    {/* Starting equity line */}
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#6b7280" strokeWidth="0.2" strokeDasharray="2,2" />
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute top-2 right-2 text-xs text-gray-400">
                    Peak: ${Math.max(...equityCurve.map(e => e.equity), startingEquity).toFixed(0)}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Return</p>
                    <p className={`text-lg font-bold ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {((stats.totalPnl / startingEquity) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Max DD</p>
                    <p className="text-lg font-bold text-red-400">
                      -{stats.maxDrawdownPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Avg Trade</p>
                    <p className={`text-lg font-bold ${stats.totalPnl / stats.totalTrades >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${stats.totalTrades > 0 ? (stats.totalPnl / stats.totalTrades).toFixed(0) : '0'}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Trades</p>
                    <p className="text-lg font-bold text-white">{stats.totalTrades}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Daily P&L */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={24} />
              Daily Performance
            </h2>
            
            {dailyPnL.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No trading data available</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dailyPnL.map((day) => (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-20">{day.date.slice(5)}</span>
                    <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div 
                        className={`h-full transition-all ${day.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ 
                          width: `${Math.min(Math.abs(day.pnl) / Math.max(...dailyPnL.map(d => Math.abs(d.pnl))) * 50, 50)}%`,
                          marginLeft: day.pnl >= 0 ? '50%' : `${50 - Math.min(Math.abs(day.pnl) / Math.max(...dailyPnL.map(d => Math.abs(d.pnl))) * 50, 50)}%`
                        }}
                      />
                      <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium ${day.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {day.pnl >= 0 ? '+' : ''}${day.pnl.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {forecast && (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Projected Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Next 7 Days</p>
                    <p className={`text-xl font-bold ${forecast.weekly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {forecast.weekly >= 0 ? '+' : ''}${forecast.weekly.toFixed(0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Next 30 Days</p>
                    <p className={`text-xl font-bold ${forecast.monthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {forecast.monthly >= 0 ? '+' : ''}${forecast.monthly.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Strategy Performance */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="text-purple-500" size={24} />
              Strategy Efficiency
            </h2>
            
            {strategyStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No strategy data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {strategyStats.map(stat => (
                  <div key={stat.name} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-white">{stat.name}</span>
                        <span className={`font-semibold ${stat.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${stat.pnl.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{stat.trades} trades • {stat.winRate.toFixed(0)}% win</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${stat.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(stat.winRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Strategy with Dynamic Suggestions */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Brain className="text-purple-400" size={20} />
                AI Strategy
              </h2>
              {marketCondition && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {marketCondition.session} Session
                </span>
              )}
            </div>
            
            {/* Dynamic Market Suggestion */}
            {marketCondition && (
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-yellow-400" size={16} />
                  <span className="text-sm font-medium text-white">Current Market Insight ({marketCondition.time} EST)</span>
                </div>
                <p className="text-xs text-gray-300 mb-2">{marketCondition.reason}</p>
                <button
                  onClick={() => setSelectedStrategy(marketCondition.recommendedStrategy)}
                  className="text-xs px-3 py-1.5 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 transition-colors"
                >
                  Switch to {aiStrategies[marketCondition.recommendedStrategy].title}
                </button>
              </div>
            )}
            
            <div className="mb-4">
              <select
                value={selectedStrategy}
                onChange={e => setSelectedStrategy(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                {aiStrategies.map((s, i) => (
                  <option key={i} value={i}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-orange-400 mb-2">{aiStrategies[selectedStrategy].title}</h3>
              <p className="text-gray-300 text-sm mb-3">{aiStrategies[selectedStrategy].description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400">Win Rate: {aiStrategies[selectedStrategy].winRate}</span>
                <span className="text-blue-400">{aiStrategies[selectedStrategy].bestFor}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-medium">Setup Rules:</p>
              {aiStrategies[selectedStrategy].rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-orange-500 mt-0.5">{i + 1}.</span>
                  {rule}
                </div>
              ))}
            </div>
            
            {/* Quick Action */}
            <button
              onClick={() => {
                sessionStorage.setItem('openAIPlanner', 'true');
                navigate('/trades');
              }}
              className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 text-sm hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
            >
              Get AI Trade Analysis →
            </button>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Trade Statistics</h2>
            <div className="space-y-3">
              <StatRow label="Total Profit" value={`+$${Math.max(0, stats.totalPnl).toFixed(0)}`} color="green" />
              <StatRow label="Total Loss" value={`-$${Math.abs(Math.min(0, stats.totalPnl)).toFixed(0)}`} color="red" />
              <StatRow label="Average Win" value={`+$${stats.avgWin.toFixed(0)}`} color="green" />
              <StatRow label="Average Loss" value={`-$${stats.avgLoss.toFixed(0)}`} color="red" />
              <StatRow label="Best Trade" value={`+$${stats.bestTrade.toFixed(0)}`} color="green" />
              <StatRow label="Worst Trade" value={`$${stats.worstTrade.toFixed(0)}`} color="red" />
            </div>
          </div>

          {/* Recent Trades */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="text-orange-500" size={20} />
                Recent Trades
              </h2>
              <button 
                onClick={() => navigate('/trades')}
                className="text-orange-400 hover:text-orange-300 text-sm"
              >
                View all →
              </button>
            </div>
            
            {recentTrades.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No trades yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTrades.map(trade => (
                  <div key={trade.id} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">{trade.pair}</span>
                      <span className={`text-xs px-2 py-1 rounded ${trade.type === 'Buy' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                        {trade.type}
                      </span>
                    </div>
                    <span className={`font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Equity Settings Modal */}
      {showEquitySettings && (
        <div className="modal-overlay" onClick={() => setShowEquitySettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Set Starting Equity</h3>
              <input
                type="number"
                value={startingEquity}
                onChange={e => setStartingEquity(parseFloat(e.target.value) || 0)}
                className="input-field w-full mb-4"
                placeholder="10000"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEquitySettings(false)}
                  className="flex-1 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(EQUITY_KEY, startingEquity.toString());
                    setShowEquitySettings(false);
                  }}
                  className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SUBCOMPONENTS ====================

function StatCard({ title, value, subtext, icon: Icon, color }: {
  title: string; value: string; subtext: string;
  icon: typeof TrendingUp; color: 'green' | 'red' | 'blue';
}) {
  const colors = {
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10'
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{title}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: 'green' | 'red' }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-800 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className={`font-semibold ${color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
        {value}
      </span>
    </div>
  );
}
