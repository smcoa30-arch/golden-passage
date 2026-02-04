export function Analytics() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Performance by Month</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder - Integration with Recharts
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Win Rate by Pair</h2>
          <div className="space-y-3">
            <PairStat pair="EUR/USD" winRate={72} trades={45} />
            <PairStat pair="GBP/USD" winRate={65} trades={32} />
            <PairStat pair="USD/JPY" winRate={58} trades={28} />
            <PairStat pair="XAU/USD" winRate={70} trades={20} />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Strategy Performance</h2>
          <div className="space-y-3">
            <StrategyStat 
              name="Trend Following" 
              winRate={75} 
              profit={+1250}
              trades={48}
            />
            <StrategyStat 
              name="Breakout" 
              winRate={62} 
              profit={+680}
              trades={35}
            />
            <StrategyStat 
              name="Range Trading" 
              winRate={55} 
              profit={+320}
              trades={25}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Trading Sessions</h2>
          <div className="space-y-3">
            <SessionStat session="London" trades={65} winRate={68} />
            <SessionStat session="New York" trades={48} winRate={72} />
            <SessionStat session="Asian" trades={25} winRate={52} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PairStat({ pair, winRate, trades }: { pair: string; winRate: number; trades: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="font-medium">{pair}</span>
          <span className="text-sm text-gray-600">{trades} trades</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>
      <span className="ml-4 font-semibold text-primary-600">{winRate}%</span>
    </div>
  );
}

function StrategyStat({ name, winRate, profit, trades }: { 
  name: string; 
  winRate: number; 
  profit: number;
  trades: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-600">{trades} trades • {winRate}% win rate</p>
      </div>
      <span className="font-semibold text-green-600">+${profit}</span>
    </div>
  );
}

function SessionStat({ session, trades, winRate }: { session: string; trades: number; winRate: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium">{session} Session</p>
        <p className="text-sm text-gray-600">{trades} trades</p>
      </div>
      <span className="font-semibold text-primary-600">{winRate}%</span>
    </div>
  );
}
