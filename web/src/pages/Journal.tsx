import { Camera, CheckCircle, Circle } from 'lucide-react';

export function Journal() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trading Journal</h1>

      {/* Checklists */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <ChecklistCard 
          title="Pre-Market Checklist"
          items={[
            { text: 'Check economic calendar', done: true },
            { text: 'Review overnight price action', done: true },
            { text: 'Identify key levels', done: false },
            { text: 'Set daily risk limit', done: false },
          ]}
        />
        <ChecklistCard 
          title="Entry Checklist"
          items={[
            { text: 'Signal aligns with trend', done: false },
            { text: 'Risk/Reward ≥ 1:2', done: false },
            { text: 'Position size calculated', done: false },
            { text: 'Stop loss placed', done: false },
          ]}
        />
        <ChecklistCard 
          title="Post-Market Checklist"
          items={[
            { text: 'Log all trades', done: false },
            { text: 'Review winners', done: false },
            { text: 'Review losers', done: false },
            { text: 'Note lessons learned', done: false },
          ]}
        />
      </div>

      {/* Journal Entry */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">New Journal Entry</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Conditions</label>
            <textarea 
              rows={3}
              placeholder="Describe today's market conditions..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emotional State</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Calm and focused</option>
              <option>Confident</option>
              <option>Anxious</option>
              <option>Impatient</option>
              <option>Frustrated</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lessons Learned</label>
            <textarea 
              rows={3}
              placeholder="What did you learn today?"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Camera size={20} />
              Add Screenshot
            </button>
            <button className="btn-primary">Save Entry</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string; items: { text: string; done: boolean }[] }) {
  const completed = items.filter(i => i.done).length;
  const progress = (completed / items.length) * 100;

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-orange-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.done ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <Circle className="text-gray-400 flex-shrink-0" size={20} />
            )}
            <span className={`text-sm ${item.done ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
