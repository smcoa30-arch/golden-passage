import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, Activity, Target, Plus, DollarSign, PieChart, BarChart3, Award, Clock } from 'lucide-react';
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
  timestamp: number;
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
}

interface StrategyStat {
  name: string;
  trades: number;
  wins: number;
  pnl: number;
  winRate: number;
}

interface DailyPnL {
  date: string;
  pnl: number;
  trades: number;
}

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

// ==================== STORAGE ====================

const loadTrades = (): Trade[] => {
  const saved = localStorage.getItem('trades');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    totalPnl: 0,
    currentStreak: 0,
    avgWin: 0,
    avgLoss: 0,
    bestTrade: 0,
    worstTrade: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Load trades
  useEffect(() => {
    const loaded = loadTrades();
    setTrades(loaded);
    setLoading(false);
  }, []);

  // Filter trades by time range
  const filteredTrades = useMemo(() => {
    if (timeRange === 'all') return trades;
    
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = timeRange === 'week' ? 7 : 30;
    const cutoff = now - (days * msPerDay);
    
    return trades.filter(t => t.timestamp > cutoff || new Date(t.date).getTime() > cutoff);
  }, [trades, timeRange]);

  // Calculate stats
  useEffect(() => {
    const wins = filteredTrades.filter(t => t.pnl > 0);
    const losses = filteredTrades.filter(t => t.pnl < 0);
    const winCount = wins.length;
    const lossCount = losses.length;
    
    const totalProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = losses.reduce((sum, t) => sum + Math.abs(t.pnl), 0);
    
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
      worstTrade: filteredTrades.length > 0 ? Math.min(...filteredTrades.map(t => t.pnl), 0) : 0
    });
  }, [filteredTrades]);

  // Calculate daily P&L for chart
  const dailyPnL = useMemo(() => {
    const grouped = filteredTrades.reduce((acc, trade) => {
      const date = trade.date;
      if (!acc[date]) {
        acc[date] = { date, pnl: 0, trades: 0 };
      }
      acc[date].pnl += trade.pnl;
      acc[date].trades += 1;
      return acc;
    }, {} as Record<string, DailyPnL>);
    
    return Object.values(grouped).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ).slice(-14); // Last 14 days
  }, [filteredTrades]);

  // Calculate strategy stats
  const strategyStats = useMemo(() => {
    const grouped = filteredTrades.reduce((acc, trade) => {
      if (!acc[trade.strategy]) {
        acc[trade.strategy] = { name: trade.strategy, trades: 0, wins: 0, pnl: 0, winRate: 0 };
      }
      acc[trade.strategy].trades++;
      if (trade.pnl > 0) acc[trade.strategy].wins++;
      acc[trade.strategy].pnl += trade.pnl;
      return acc;
    }, {} as Record<string, StrategyStat>);
    
    // Calculate win rates
    Object.values(grouped).forEach(stat => {
      stat.winRate = stat.trades > 0 ? (stat.wins / stat.trades) * 100 : 0;
    });
    
    return Object.values(grouped).sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  // Forecast (simple projection based on recent performance)
  const forecast = useMemo(() => {
    if (dailyPnL.length < 3) return null;
    const avgDaily = dailyPnL.slice(-7).reduce((sum, d) => sum + d.pnl, 0) / Math.min(dailyPnL.length, 7);
    return {
      weekly: avgDaily * 7,
      monthly: avgDaily * 30
    };
  }, [dailyPnL]);

  // Recent trades (last 5)
  const recentTrades = useMemo(() => {
    return [...filteredTrades]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [filteredTrades]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
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
            onClick={() => navigate('/trades')}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            New Trade
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subtext={`${stats.totalTrades} trades`}
          icon={Target}
          color={stats.winRate >= 50 ? 'green' : 'red'}
        />
        <StatCard 
          title="Profit Factor"
          value={stats.profitFactor >= 999 ? '∞' : stats.profitFactor.toFixed(2)}
          subtext={stats.profitFactor >= 1.5 ? 'Excellent' : stats.profitFactor >= 1 ? 'Profitable' : 'Improvement needed'}
          icon={Activity}
          color={stats.profitFactor >= 1 ? 'green' : 'red'}
        />
        <StatCard 
          title="Net P&L"
          value={`$${stats.totalPnl.toFixed(0)}`}
          subtext={`Avg Win: $${stats.avgWin.toFixed(0)}`}
          icon={DollarSign}
          color={stats.totalPnl >= 0 ? 'green' : 'red'}
        />
        <StatCard 
          title="Best Streak"
          value={`${stats.currentStreak}`}
          subtext="Consecutive wins"
          icon={Award}
          color="blue"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Charts & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily P&L Chart */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
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
                          width: `${Math.min(Math.abs(day.pnl) / Math.max(...dailyPnL.map(d => Math.abs(d.pnl))) * 100, 100)}%`,
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

            {/* Forecast */}
            {forecast && (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Projected Performance (Based on recent avg)</h3>
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
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
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
                        <span>{stat.trades} trades</span>
                        <span>{stat.winRate.toFixed(0)}% win rate</span>
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

          {/* Recent Trades */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Clock className="text-orange-500" size={24} />
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
                <TrendingUp size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No trades yet. Start logging your trades!</p>
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
                      <span className="text-gray-400 text-sm">{trade.strategy}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Strategy & Quick Stats */}
        <div className="space-y-6">
          {/* AI Strategy Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="text-yellow-500" size={24} />
                AI Strategy of the Day
              </h2>
            </div>
            
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
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Trade Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Total Profit</span>
                <span className="font-semibold text-green-400">+${stats.totalPnl > 0 ? stats.totalPnl.toFixed(0) : '0'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Total Loss</span>
                <span className="font-semibold text-red-400">-${stats.totalPnl < 0 ? Math.abs(stats.totalPnl).toFixed(0) : '0'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Average Win</span>
                <span className="font-semibold text-green-400">+${stats.avgWin.toFixed(0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Average Loss</span>
                <span className="font-semibold text-red-400">-${stats.avgLoss.toFixed(0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Best Trade</span>
                <span className="font-semibold text-green-400">+${stats.bestTrade.toFixed(0)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Worst Trade</span>
                <span className="font-semibold text-red-400">${stats.worstTrade.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/journal')}
                className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                Write Journal Entry
              </button>
              <button 
                onClick={() => navigate('/analytics')}
                className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                View Detailed Analytics
              </button>
              <button 
                onClick={() => navigate('/learning')}
                className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                Study Strategies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTS ====================

function StatCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon,
  color
}: { 
  title: string; 
  value: string; 
  subtext: string;
  icon: typeof TrendingUp;
  color: 'green' | 'red' | 'blue';
}) {
  const colorClasses = {
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10'
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}
