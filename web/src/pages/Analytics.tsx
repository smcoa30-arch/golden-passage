import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Calendar, DollarSign, Target } from 'lucide-react';

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
}

export function Analytics() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try both storage keys for backwards compatibility
    const saved = localStorage.getItem('trades_v2') || localStorage.getItem('trades');
    if (saved) {
      try {
        setTrades(JSON.parse(saved));
      } catch {
        setTrades([]);
      }
    }
    setLoading(false);
  }, []);

  // Filter trades by time
  const filteredTrades = trades.filter(trade => {
    if (timeFilter === 'all') return true;
    const tradeDate = new Date(trade.date);
    const now = new Date();
    
    if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return tradeDate >= weekAgo;
    }
    if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return tradeDate >= monthAgo;
    }
    return true;
  });

  // Calculate stats
  const totalTrades = filteredTrades.length;
  const winningTrades = filteredTrades.filter(t => t.pnl > 0);
  const losingTrades = filteredTrades.filter(t => t.pnl < 0);
  const winCount = winningTrades.length;
  const lossCount = losingTrades.length;
  const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
  
  const totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalLoss = losingTrades.reduce((sum, t) => sum + Math.abs(t.pnl), 0);
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;
  const totalPnl = filteredTrades.reduce((sum, t) => sum + t.pnl, 0);
  const avgWin = winCount > 0 ? totalProfit / winCount : 0;
  const avgLoss = lossCount > 0 ? totalLoss / lossCount : 0;

  // Stats by pair
  const pairStats = filteredTrades.reduce((acc, trade) => {
    if (!acc[trade.pair]) {
      acc[trade.pair] = { trades: 0, wins: 0, pnl: 0 };
    }
    acc[trade.pair].trades++;
    if (trade.pnl > 0) acc[trade.pair].wins++;
    acc[trade.pair].pnl += trade.pnl;
    return acc;
  }, {} as Record<string, { trades: number; wins: number; pnl: number }>);

  // Stats by strategy
  const strategyStats = filteredTrades.reduce((acc, trade) => {
    if (!acc[trade.strategy]) {
      acc[trade.strategy] = { trades: 0, wins: 0, pnl: 0 };
    }
    acc[trade.strategy].trades++;
    if (trade.pnl > 0) acc[trade.strategy].wins++;
    acc[trade.strategy].pnl += trade.pnl;
    return acc;
  }, {} as Record<string, { trades: number; wins: number; pnl: number }>);

  // Psychology stats
  const psychStats = filteredTrades.reduce((acc, trade) => {
    if (trade.psychology) {
      if (!acc[trade.psychology]) acc[trade.psychology] = { count: 0, wins: 0, pnl: 0 };
      acc[trade.psychology].count++;
      if (trade.pnl > 0) acc[trade.psychology].wins++;
      acc[trade.psychology].pnl += trade.pnl;
    }
    return acc;
  }, {} as Record<string, { count: number; wins: number; pnl: number }>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-16">
        <BarChart3 size={64} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Data Yet</h2>
        <p className="text-gray-400 mb-6">Start logging trades to see your analytics</p>
        <button 
          onClick={() => window.location.href = '/trades'}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Log Your First Trade
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Deep insights into your trading performance</p>
        </div>
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Trades"
          value={totalTrades.toString()}
          subtext={`${winCount} wins, ${lossCount} losses`}
          icon={Activity}
          color="blue"
        />
        <StatCard 
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          subtext={winRate >= 50 ? 'Good performance!' : 'Keep improving'}
          icon={winRate >= 50 ? TrendingUp : TrendingDown}
          color={winRate >= 50 ? 'green' : 'red'}
        />
        <StatCard 
          title="Profit Factor"
          value={profitFactor >= 999 ? '∞' : profitFactor.toFixed(2)}
          subtext={profitFactor >= 1.5 ? 'Excellent' : profitFactor >= 1 ? 'Profitable' : 'Need improvement'}
          icon={BarChart3}
          color={profitFactor >= 1 ? 'green' : 'red'}
        />
        <StatCard 
          title="Net P&L"
          value={`$${totalPnl.toFixed(0)}`}
          subtext={`Avg Win: $${avgWin.toFixed(0)} | Avg Loss: $${avgLoss.toFixed(0)}`}
          icon={DollarSign}
          color={totalPnl >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Psychology Analysis */}
      {Object.keys(psychStats).length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="text-purple-400" size={24} />
            Psychology Analysis
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {Object.entries(psychStats).map(([mood, stats]) => {
              const winRate = stats.count > 0 ? (stats.wins / stats.count) * 100 : 0;
              return (
                <div key={mood} className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm capitalize mb-1">{mood}</p>
                  <p className={`text-2xl font-bold ${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {winRate.toFixed(0)}%
                  </p>
                  <p className={`text-sm ${stats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${stats.pnl.toFixed(0)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{stats.count} trades</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance by Pair */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Performance by Pair</h2>
          <div className="space-y-3">
            {Object.entries(pairStats)
              .sort((a, b) => b[1].pnl - a[1].pnl)
              .map(([pair, stats]) => {
                const winRate = (stats.wins / stats.trades) * 100;
                return (
                  <div key={pair} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-white">{pair}</span>
                        <span className={`font-semibold ${stats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${stats.pnl.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{stats.trades} trades • {winRate.toFixed(0)}% win</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(winRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Performance by Strategy */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Performance by Strategy</h2>
          <div className="space-y-3">
            {Object.entries(strategyStats)
              .sort((a, b) => b[1].pnl - a[1].pnl)
              .map(([strategy, stats]) => {
                const winRate = (stats.wins / stats.trades) * 100;
                return (
                  <div key={strategy} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-white">{strategy}</span>
                        <span className={`font-semibold ${stats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${stats.pnl.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{stats.trades} trades • {winRate.toFixed(0)}% win</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(winRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Trade Type Analysis */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Buy vs Sell Performance</h2>
          {(() => {
            const buyTrades = filteredTrades.filter(t => t.type === 'Buy');
            const sellTrades = filteredTrades.filter(t => t.type === 'Sell');
            const buyPnl = buyTrades.reduce((sum, t) => sum + t.pnl, 0);
            const sellPnl = sellTrades.reduce((sum, t) => sum + t.pnl, 0);
            
            return (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <div>
                    <span className="font-semibold text-green-400">Buy Trades</span>
                    <p className="text-sm text-green-500/80">{buyTrades.length} trades</p>
                  </div>
                  <span className={`font-bold text-xl ${buyPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${buyPnl.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
                  <div>
                    <span className="font-semibold text-red-400">Sell Trades</span>
                    <p className="text-sm text-red-500/80">{sellTrades.length} trades</p>
                  </div>
                  <span className={`font-bold text-xl ${sellPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${sellPnl.toFixed(0)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Recent Performance Summary */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Performance Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Total Profit</span>
              <span className="font-semibold text-green-400">+${Math.max(0, totalProfit).toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Total Loss</span>
              <span className="font-semibold text-red-400">-${Math.abs(Math.min(0, -totalLoss)).toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Average Win</span>
              <span className="font-semibold text-green-400">+${avgWin.toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Average Loss</span>
              <span className="font-semibold text-red-400">-${avgLoss.toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Best Trade</span>
              <span className="font-semibold text-green-400">
                +${Math.max(...filteredTrades.map(t => t.pnl), 0).toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Worst Trade</span>
              <span className="font-semibold text-red-400">
                ${Math.min(...filteredTrades.map(t => t.pnl), 0).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  color: 'green' | 'red' | 'blue' | 'orange';
}) {
  const colorClasses = {
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}
