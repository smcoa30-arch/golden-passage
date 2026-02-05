import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  type: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  pnl: number;
  date: string;
  strategy: string;
}

export function Analytics() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('trades');
    if (saved) {
      setTrades(JSON.parse(saved));
    }
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

  if (trades.length === 0) {
    return (
      <div className="text-center py-16">
        <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
        <p className="text-gray-600 mb-6">Start logging trades to see your analytics</p>
        <button 
          onClick={() => window.location.href = '/trades'}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
        >
          Log Your First Trade
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          value={`$${totalPnl.toFixed(2)}`}
          subtext={`Avg Win: $${avgWin.toFixed(0)} | Avg Loss: $${avgLoss.toFixed(0)}`}
          icon={PieChart}
          color={totalPnl >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance by Pair */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Performance by Pair</h2>
          <div className="space-y-3">
            {Object.entries(pairStats)
              .sort((a, b) => b[1].pnl - a[1].pnl)
              .map(([pair, stats]) => {
                const winRate = (stats.wins / stats.trades) * 100;
                return (
                  <div key={pair} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{pair}</span>
                        <span className={`font-semibold ${stats.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${stats.pnl.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{stats.trades} trades • {winRate.toFixed(0)}% win</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Performance by Strategy</h2>
          <div className="space-y-3">
            {Object.entries(strategyStats)
              .sort((a, b) => b[1].pnl - a[1].pnl)
              .map(([strategy, stats]) => {
                const winRate = (stats.wins / stats.trades) * 100;
                return (
                  <div key={strategy} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{strategy}</span>
                        <span className={`font-semibold ${stats.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${stats.pnl.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{stats.trades} trades • {winRate.toFixed(0)}% win</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Buy vs Sell Performance</h2>
          {(() => {
            const buyTrades = filteredTrades.filter(t => t.type === 'Buy');
            const sellTrades = filteredTrades.filter(t => t.type === 'Sell');
            const buyPnl = buyTrades.reduce((sum, t) => sum + t.pnl, 0);
            const sellPnl = sellTrades.reduce((sum, t) => sum + t.pnl, 0);
            
            return (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-green-800">Buy Trades</span>
                    <p className="text-sm text-green-600">{buyTrades.length} trades</p>
                  </div>
                  <span className={`font-bold ${buyPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${buyPnl.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-red-800">Sell Trades</span>
                    <p className="text-sm text-red-600">{sellTrades.length} trades</p>
                  </div>
                  <span className={`font-bold ${sellPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${sellPnl.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Recent Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Profit</span>
              <span className="font-semibold text-green-600">+${totalProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Loss</span>
              <span className="font-semibold text-red-600">-${totalLoss.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Average Win</span>
              <span className="font-semibold text-green-600">+${avgWin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Average Loss</span>
              <span className="font-semibold text-red-600">-${avgLoss.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Best Trade</span>
              <span className="font-semibold text-green-600">
                +${Math.max(...filteredTrades.map(t => t.pnl), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Worst Trade</span>
              <span className="font-semibold text-red-600">
                ${Math.min(...filteredTrades.map(t => t.pnl), 0).toFixed(2)}
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
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    blue: 'text-blue-600 bg-blue-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-600 text-sm">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}
