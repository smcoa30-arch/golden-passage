import { useState } from 'react';
import { BookOpen, Video, FileText, Play, Calculator, DollarSign, TrendingUp, Percent } from 'lucide-react';

const courses = [
  {
    title: 'Forex Fundamentals',
    description: 'Learn the basics of forex trading, including currency pairs, pips, and leverage.',
    lessons: 12,
    duration: '3 hours',
    icon: BookOpen,
  },
  {
    title: 'Technical Analysis',
    description: 'Master chart patterns, indicators, and price action strategies.',
    lessons: 18,
    duration: '5 hours',
    icon: FileText,
  },
  {
    title: 'Risk Management',
    description: 'Essential techniques to protect your capital and maximize returns.',
    lessons: 8,
    duration: '2 hours',
    icon: Video,
  },
];

const strategies = [
  {
    name: 'Trend Following',
    winRate: '65%',
    avgRR: '1:2.5',
    bestMarket: 'Trending',
    description: 'Follow the direction of the major trend using moving averages and trend indicators.',
  },
  {
    name: 'Breakout Trading',
    winRate: '55%',
    avgRR: '1:3',
    bestMarket: 'Volatile',
    description: 'Enter trades when price breaks through key support or resistance levels.',
  },
  {
    name: 'Range Trading',
    winRate: '60%',
    avgRR: '1:1.5',
    bestMarket: 'Consolidating',
    description: 'Buy at support and sell at resistance in sideways markets.',
  },
];

export function Learning() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Center</h1>

      {/* Courses */}
      <h2 className="text-xl font-semibold mb-4">Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <CourseCard key={course.title} {...course} />
        ))}
      </div>

      {/* Strategies */}
      <h2 className="text-xl font-semibold mb-4">Trading Strategies</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {strategies.map((strategy) => (
            <StrategyCard key={strategy.name} {...strategy} />
          ))}
        </div>
      </div>

      {/* Calculators */}
      <h2 className="text-xl font-semibold mb-4">Trading Calculators</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CalculatorCard 
          title="Position Size" 
          description="Calculate lot size based on risk"
          icon={Calculator}
          onClick={() => setActiveCalculator('position')}
        />
        <CalculatorCard 
          title="Risk/Reward" 
          description="Analyze trade potential"
          icon={TrendingUp}
          onClick={() => setActiveCalculator('riskreward')}
        />
        <CalculatorCard 
          title="Pip Value" 
          description="Calculate pip values"
          icon={DollarSign}
          onClick={() => setActiveCalculator('pip')}
        />
        <CalculatorCard 
          title="Compounding" 
          description="Project account growth"
          icon={Percent}
          onClick={() => setActiveCalculator('compound')}
        />
      </div>

      {/* Calculator Modals */}
      {activeCalculator === 'position' && <PositionSizeCalculator onClose={() => setActiveCalculator(null)} />}
      {activeCalculator === 'riskreward' && <RiskRewardCalculator onClose={() => setActiveCalculator(null)} />}
      {activeCalculator === 'pip' && <PipValueCalculator onClose={() => setActiveCalculator(null)} />}
      {activeCalculator === 'compound' && <CompoundingCalculator onClose={() => setActiveCalculator(null)} />}
    </div>
  );
}

function CourseCard({ title, description, lessons, duration, icon: Icon }: {
  title: string;
  description: string;
  lessons: number;
  duration: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-orange-600" size={24} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>{lessons} lessons</span>
        <span>{duration}</span>
      </div>
      <button 
        onClick={() => alert('Course content coming soon!')}
        className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
      >
        <Play size={16} />
        Start Learning
      </button>
    </div>
  );
}

function StrategyCard({ name, winRate, avgRR, bestMarket, description }: {
  name: string;
  winRate: string;
  avgRR: string;
  bestMarket: string;
  description: string;
}) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-green-50 rounded p-2">
          <p className="text-green-700 font-semibold">{winRate}</p>
          <p className="text-green-600 text-xs">Win Rate</p>
        </div>
        <div className="bg-blue-50 rounded p-2">
          <p className="text-blue-700 font-semibold">{avgRR}</p>
          <p className="text-blue-600 text-xs">R:R</p>
        </div>
        <div className="bg-purple-50 rounded p-2">
          <p className="text-purple-700 font-semibold">{bestMarket}</p>
          <p className="text-purple-600 text-xs">Market</p>
        </div>
      </div>
    </div>
  );
}

function CalculatorCard({ title, description, icon: Icon, onClick }: { 
  title: string; 
  description: string;
  icon: typeof Calculator;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left w-full"
    >
      <Icon className="text-orange-600 mb-3" size={24} />
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

// Position Size Calculator
function PositionSizeCalculator({ onClose }: { onClose: () => void }) {
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('1');
  const [stopLoss, setStopLoss] = useState('20');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const riskAmount = parseFloat(accountSize) * (parseFloat(riskPercent) / 100);
    const positionSize = riskAmount / parseFloat(stopLoss);
    setResult(positionSize);
  };

  return (
    <CalculatorModal title="Position Size Calculator" onClose={onClose}>
      <div className="space-y-4">
        <Input label="Account Size ($)" value={accountSize} onChange={setAccountSize} />
        <Input label="Risk per Trade (%)" value={riskPercent} onChange={setRiskPercent} />
        <Input label="Stop Loss (pips)" value={stopLoss} onChange={setStopLoss} />
        <button onClick={calculate} className="w-full bg-orange-600 text-white py-2 rounded-lg">Calculate</button>
        {result !== null && (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-gray-600">Position Size</p>
            <p className="text-2xl font-bold text-orange-600">{result.toFixed(2)} lots</p>
            <p className="text-sm text-gray-500">Risk: ${(parseFloat(accountSize) * parseFloat(riskPercent) / 100).toFixed(2)}</p>
          </div>
        )}
      </div>
    </CalculatorModal>
  );
}

// Risk/Reward Calculator
function RiskRewardCalculator({ onClose }: { onClose: () => void }) {
  const [entry, setEntry] = useState('1.08500');
  const [stopLoss, setStopLoss] = useState('1.08300');
  const [takeProfit, setTakeProfit] = useState('1.09000');
  const [result, setResult] = useState<{risk: number; reward: number; ratio: number} | null>(null);

  const calculate = () => {
    const risk = Math.abs(parseFloat(entry) - parseFloat(stopLoss));
    const reward = Math.abs(parseFloat(takeProfit) - parseFloat(entry));
    const ratio = reward / risk;
    setResult({ risk: risk * 10000, reward: reward * 10000, ratio });
  };

  return (
    <CalculatorModal title="Risk/Reward Calculator" onClose={onClose}>
      <div className="space-y-4">
        <Input label="Entry Price" value={entry} onChange={setEntry} />
        <Input label="Stop Loss" value={stopLoss} onChange={setStopLoss} />
        <Input label="Take Profit" value={takeProfit} onChange={setTakeProfit} />
        <button onClick={calculate} className="w-full bg-orange-600 text-white py-2 rounded-lg">Calculate</button>
        {result && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-red-600">Risk</p>
              <p className="font-bold text-red-700">{result.risk.toFixed(1)} pips</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-600">Reward</p>
              <p className="font-bold text-green-700">{result.reward.toFixed(1)} pips</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-600">R:R Ratio</p>
              <p className="font-bold text-blue-700">1:{result.ratio.toFixed(1)}</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorModal>
  );
}

// Pip Value Calculator
function PipValueCalculator({ onClose }: { onClose: () => void }) {
  const [lotSize, setLotSize] = useState('1');
  const [pair, setPair] = useState('EUR/USD');
  const pipValues: Record<string, number> = {
    'EUR/USD': 10, 'GBP/USD': 10, 'USD/JPY': 9.5, 'USD/CHF': 11,
    'AUD/USD': 10, 'USD/CAD': 7.5, 'NZD/USD': 10, 'XAU/USD': 10,
  };
  const value = (pipValues[pair] || 10) * parseFloat(lotSize);

  return (
    <CalculatorModal title="Pip Value Calculator" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pair</label>
          <select 
            value={pair} 
            onChange={(e) => setPair(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            {Object.keys(pipValues).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <Input label="Lot Size" value={lotSize} onChange={setLotSize} />
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">Pip Value</p>
          <p className="text-2xl font-bold text-orange-600">${value.toFixed(2)}</p>
        </div>
      </div>
    </CalculatorModal>
  );
}

// Compounding Calculator
function CompoundingCalculator({ onClose }: { onClose: () => void }) {
  const [initial, setInitial] = useState('10000');
  const [monthlyReturn, setMonthlyReturn] = useState('5');
  const [months, setMonths] = useState('12');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const finalAmount = parseFloat(initial) * Math.pow(1 + parseFloat(monthlyReturn) / 100, parseFloat(months));
    setResult(finalAmount);
  };

  return (
    <CalculatorModal title="Compounding Calculator" onClose={onClose}>
      <div className="space-y-4">
        <Input label="Initial Capital ($)" value={initial} onChange={setInitial} />
        <Input label="Monthly Return (%)" value={monthlyReturn} onChange={setMonthlyReturn} />
        <Input label="Number of Months" value={months} onChange={setMonths} />
        <button onClick={calculate} className="w-full bg-orange-600 text-white py-2 rounded-lg">Calculate</button>
        {result !== null && (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-gray-600">Final Amount</p>
            <p className="text-2xl font-bold text-orange-600">${result.toFixed(2)}</p>
            <p className="text-sm text-green-600">+${(result - parseFloat(initial)).toFixed(2)} profit</p>
          </div>
        )}
      </div>
    </CalculatorModal>
  );
}

// Shared Components
function CalculatorModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}
