import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export function Trades() {
  const [filter, setFilter] = useState('all');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trades</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Log Trade
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search trades..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Trades</option>
            <option value="win">Winners</option>
            <option value="loss">Losers</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>

      {/* Trades Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Pair</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Entry</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Exit</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">P&L</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Strategy</th>
            </tr>
          </thead>
          <tbody>
            <TradeTableRow 
              date="Jan 15, 2024"
              pair="EUR/USD"
              type="Buy"
              entry="1.0850"
              exit="1.0925"
              pnl={+125}
              strategy="Trend Following"
            />
            <TradeTableRow 
              date="Jan 14, 2024"
              pair="GBP/USD"
              type="Sell"
              entry="1.2650"
              exit="1.2695"
              pnl={-45}
              strategy="Breakout"
            />
            <TradeTableRow 
              date="Jan 13, 2024"
              pair="USD/JPY"
              type="Buy"
              entry="147.50"
              exit="149.80"
              pnl={+230}
              strategy="Trend Following"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TradeTableRow({ date, pair, type, entry, exit, pnl, strategy }: {
  date: string;
  pair: string;
  type: string;
  entry: string;
  exit: string;
  pnl: number;
  strategy: string;
}) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 text-gray-600">{date}</td>
      <td className="py-3 px-4 font-medium">{pair}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded text-sm ${type === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {type}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">{entry}</td>
      <td className="py-3 px-4 text-gray-600">{exit}</td>
      <td className={`py-3 px-4 font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {pnl >= 0 ? '+' : ''}${pnl}
      </td>
      <td className="py-3 px-4 text-gray-600">{strategy}</td>
    </tr>
  );
}
