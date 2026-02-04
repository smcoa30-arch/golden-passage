import { TrendingUp, Activity, Target, Calendar } from 'lucide-react';

export function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button className="btn-primary">+ New Trade</button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Win Rate"
          value="65.5%"
          change="+2.3%"
          icon={Target}
          positive
        />
        <StatCard 
          title="Profit Factor"
          value="1.84"
          change="+0.12"
          icon={TrendingUp}
          positive
        />
        <StatCard 
          title="Total Trades"
          value="156"
          change="+12"
          icon={Activity}
        />
        <StatCard 
          title="Current Streak"
          value="5 Wins"
          change="Best: 12"
          icon={Calendar}
          positive
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
          <div className="space-y-3">
            <TradeRow pair="EUR/USD" type="Buy" pnl={+125} date="2024-01-15" />
            <TradeRow pair="GBP/USD" type="Sell" pnl={-45} date="2024-01-14" />
            <TradeRow pair="USD/JPY" type="Buy" pnl={+230} date="2024-01-13" />
            <TradeRow pair="XAU/USD" type="Buy" pnl={+89} date="2024-01-12" />
          </div>
        </div>

        {/* Daily Strategy */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Today's AI Strategy</h2>
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary-900 mb-2">Trend Following Strategy</h3>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Price above 50 EMA</li>
              <li>• RSI confirmation above 50</li>
              <li>• Entry on pullback to 20 EMA</li>
              <li>• Stop loss below recent swing low</li>
            </ul>
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
    <div className="card">
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-600 text-sm">{title}</p>
        <Icon className="text-primary-600" size={20} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className={`text-sm mt-1 ${positive ? 'text-green-600' : 'text-gray-500'}`}>
        {change}
      </p>
    </div>
  );
}

function TradeRow({ pair, type, pnl, date }: { pair: string; type: string; pnl: number; date: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">{pair}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="text-right">
        <span className={`text-sm px-2 py-1 rounded ${type === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {type}
        </span>
        <p className={`font-semibold mt-1 ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {pnl >= 0 ? '+' : ''}${pnl}
        </p>
      </div>
    </div>
  );
}
