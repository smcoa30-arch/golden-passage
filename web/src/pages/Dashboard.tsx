import { useEffect, useState } from 'react';
import { TrendingUp, Activity, Target, Calendar, Plus, TrendingDown, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';

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

interface Stats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  totalPnl: number;
  currentStreak: number;
}

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
  });
  const [loading, setLoading] = useState(true);
  const [aiStrategy, setAiStrategy] = useState({
    title: 'Trend Following Strategy',
    description: 'Follow the major trend with RSI confirmation',
    rules: ['Price above 50 EMA', 'RSI > 50', 'Entry on pullback', 'Stop loss below swing low']
  });

  useEffect(() => {
    if (!user) return;

    // Subscribe to trades
    const tradesQuery = query(
      collection(db, 'trades'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(tradesQuery, (snapshot) => {
      const tradesData: Trade[] = [];
      let wins = 0;
      let losses = 0;
      let totalWinAmount = 0;
      let totalLossAmount = 0;
      let totalPnl = 0;
      let currentStreak = 0;

      snapshot.docs.forEach((doc) => {
        const trade = { id: doc.id, ...doc.data() } as Trade;
        tradesData.push(trade);
        
        if (trade.pnl > 0) {
          wins++;
          totalWinAmount += trade.pnl;
          if (currentStreak >= 0) currentStreak++;
          else currentStreak = 1;
        } else if (trade.pnl < 0) {
          losses++;
          totalLossAmount += Math.abs(trade.pnl);
          if (currentStreak <= 0) currentStreak--;
          else currentStreak = -1;
        }
        totalPnl += trade.pnl;
      });

      const totalTrades = wins + losses;
      const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
      const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : totalWinAmount > 0 ? Infinity : 0;

      setTrades(tradesData);
      setStats({
        totalTrades,
        winRate: Math.round(winRate * 10) / 10,
        profitFactor: Math.round(profitFactor * 100) / 100,
        totalPnl,
        currentStreak: Math.abs(currentStreak),
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateNewStrategy = () => {
    const strategies = [
      {
        title: 'Trend Following Strategy',
        description: 'Follow the major trend with RSI confirmation',
        rules: ['Price above 50 EMA', 'RSI > 50', 'Entry on pullback to 20 EMA', 'Stop loss below swing low']
      },
      {
        title: 'Breakout Strategy',
        description: 'Trade breakouts from consolidation zones',
        rules: ['Identify key resistance', 'Wait for breakout confirmation', 'Volume above average', 'Target 2R minimum']
      },
      {
        title: 'Support & Resistance',
        description: 'Trade bounces from key support/resistance levels',
        rules: ['Mark key S/R levels', 'Wait for price reaction', 'Candlestick confirmation', 'Tight stop loss']
      }
    ];
    const random = strategies[Math.floor(Math.random() * strategies.length)];
    setAiStrategy(random);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email?.split('@')[0]}</p>
        </div>
        <button 
          onClick={() => navigate('/trades')}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          New Trade
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Win Rate"
          value={`${stats.winRate}%`}
          change={`${stats.totalTrades} trades`}
          icon={Target}
          positive={stats.winRate >= 50}
        />
        <StatCard 
          title="Profit Factor"
          value={stats.profitFactor.toString()}
          change={stats.profitFactor >= 1.5 ? 'Good' : 'Improve'}
          icon={Activity}
          positive={stats.profitFactor >= 1}
        />
        <StatCard 
          title="Total P&L"
          value={`$${stats.totalPnl.toFixed(2)}`}
          change={stats.totalPnl >= 0 ? 'Profit' : 'Loss'}
          icon={DollarSign}
          positive={stats.totalPnl >= 0}
        />
        <StatCard 
          title="Current Streak"
          value={`${stats.currentStreak} Wins`}
          change="Keep it up!"
          icon={Calendar}
          positive={stats.currentStreak > 0}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Trades</h2>
            <button 
              onClick={() => navigate('/trades')}
              className="text-orange-600 hover:text-orange-700 text-sm"
            >
              View all →
            </button>
          </div>
          
          {trades.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No trades yet. Start logging your first trade!</p>
              <button 
                onClick={() => navigate('/trades')}
                className="mt-4 text-orange-600 hover:underline"
              >
                Add Trade
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {trades.map((trade) => (
                <TradeRow key={trade.id} {...trade} />
              ))}
            </div>
          )}
        </div>

        {/* Daily Strategy */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">AI Daily Strategy</h2>
            <button 
              onClick={generateNewStrategy}
              className="text-orange-600 hover:text-orange-700 text-sm"
            >
              Generate New
            </button>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2">{aiStrategy.title}</h3>
            <p className="text-orange-800 text-sm mb-3">{aiStrategy.description}</p>
            <ul className="text-sm text-orange-800 space-y-1">
              {aiStrategy.rules.map((rule, i) => (
                <li key={i}>• {rule}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => navigate('/journal')}
                className="text-sm bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Write Journal
              </button>
              <button 
                onClick={() => navigate('/analytics')}
                className="text-sm bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                View Analytics
              </button>
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
  change, 
  icon: Icon,
  positive 
}: { 
  title: string; 
  value: string; 
  change: string;
  icon: typeof TrendingUp;
  positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-600 text-sm">{title}</p>
        <Icon className="text-orange-600" size={20} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className={`text-sm mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
}

function TradeRow({ pair, type, entry, exit, pnl, date, strategy }: Trade) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{pair}</span>
          <span className={`text-xs px-2 py-1 rounded ${type === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {type}
          </span>
        </div>
        <p className="text-xs text-gray-500">{date} • {strategy}</p>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">{entry} → {exit}</p>
      </div>
    </div>
  );
}
