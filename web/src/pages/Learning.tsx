import { BookOpen, Video, FileText, Play } from 'lucide-react';

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
  },
  {
    name: 'Breakout Trading',
    winRate: '55%',
    avgRR: '1:3',
    bestMarket: 'Volatile',
  },
  {
    name: 'Range Trading',
    winRate: '60%',
    avgRR: '1:1.5',
    bestMarket: 'Consolidating',
  },
];

export function Learning() {
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
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Strategy</th>
                <th className="text-left py-3 px-4 font-semibold">Win Rate</th>
                <th className="text-left py-3 px-4 font-semibold">Avg R:R</th>
                <th className="text-left py-3 px-4 font-semibold">Best Market</th>
                <th className="text-left py-3 px-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => (
                <tr key={strategy.name} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{strategy.name}</td>
                  <td className="py-3 px-4 text-green-600">{strategy.winRate}</td>
                  <td className="py-3 px-4">{strategy.avgRR}</td>
                  <td className="py-3 px-4 text-gray-600">{strategy.bestMarket}</td>
                  <td className="py-3 px-4">
                    <button className="text-orange-600 hover:text-orange-700 font-medium">
                      Learn →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculators */}
      <h2 className="text-xl font-semibold mb-4 mt-8">Trading Calculators</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CalculatorCard title="Position Size" description="Calculate lot size based on risk" />
        <CalculatorCard title="Risk/Reward" description="Analyze trade potential" />
        <CalculatorCard title="Pip Value" description="Calculate pip values" />
        <CalculatorCard title="Compounding" description="Project account growth" />
      </div>
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
    <div className="card hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-orange-600" size={24} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>{lessons} lessons</span>
        <span>{duration}</span>
      </div>
      <button className="w-full btn-primary flex items-center justify-center gap-2">
        <Play size={16} />
        Start Learning
      </button>
    </div>
  );
}

function CalculatorCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
