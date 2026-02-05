import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Plus, Trash2, Edit2, Save, X, Calendar, Brain, Target, AlertTriangle, CheckSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ==================== TYPES ====================

type TimeframeTab = 'monthly' | 'weekly' | 'daily';
type StrategyType = 'ict-silver' | 'smc-ob' | 'price-action' | 'ict-pd';

interface ChecklistItem {
  id: string;
  text: string;
  weight: number; // Probability weight
  done: boolean;
}

interface StrategyChecklist {
  name: string;
  items: ChecklistItem[];
}

interface JournalEntry {
  id: string;
  date: string;
  timeframe: TimeframeTab;
  type: 'growth' | 'psychology' | 'bias' | 'economic' | 'performance';
  title: string;
  content: string;
  strategy?: StrategyType;
  checklistCompletion?: number;
  probabilityScore?: number;
  createdAt: string;
}

// ==================== STRATEGY CHECKLISTS ====================

const strategyChecklists: Record<StrategyType, StrategyChecklist> = {
  'ict-silver': {
    name: 'ICT Silver Bullet',
    items: [
      { id: '1', text: 'Trading during Silver Bullet window (10-11 AM or 2-3 PM EST)?', weight: 15, done: false },
      { id: '2', text: 'Previous Day High/Low marked?', weight: 10, done: false },
      { id: '3', text: 'Liquidity purged on one side?', weight: 20, done: false },
      { id: '4', text: 'Market Structure Shift (MSS) confirmed?', weight: 20, done: false },
      { id: '5', text: 'Fair Value Gap formed?', weight: 15, done: false },
      { id: '6', text: 'Entry at 50% of FVG?', weight: 10, done: false },
      { id: '7', text: 'Risk:Reward minimum 1:2?', weight: 10, done: false },
    ]
  },
  'smc-ob': {
    name: 'SMC Order Block',
    items: [
      { id: '1', text: 'HTF Order Block identified (H4/H1)?', weight: 15, done: false },
      { id: '2', text: 'Price approaching fresh/unmitigated OB?', weight: 20, done: false },
      { id: '3', text: 'Premium/Discount alignment correct?', weight: 15, done: false },
      { id: '4', text: 'LTF (1m-5m) entry confirmation?', weight: 20, done: false },
      { id: '5', text: 'Confluence with FVG or Breaker?', weight: 15, done: false },
      { id: '6', text: 'Stop loss beyond OB extreme?', weight: 10, done: false },
      { id: '7', text: 'Target at next unmitigated OB?', weight: 5, done: false },
    ]
  },
  'price-action': {
    name: 'Price Action Structure',
    items: [
      { id: '1', text: 'Clear HH/HL or LH/LL structure identified?', weight: 20, done: false },
      { id: '2', text: 'Flip zone marked (previous S/R)?', weight: 15, done: false },
      { id: '3', text: 'Price in Premium/Discount zone?', weight: 15, done: false },
      { id: '4', text: 'Price action confirmation candle?', weight: 20, done: false },
      { id: '5', text: 'No conflicting higher timeframe bias?', weight: 15, done: false },
      { id: '6', text: 'Risk:Reward minimum 1:2?', weight: 15, done: false },
    ]
  },
  'ict-pd': {
    name: 'ICT Power of 3 + PD Arrays',
    items: [
      { id: '1', text: 'Asia range identified?', weight: 10, done: false },
      { id: '2', text: 'One side of Asia range swept?', weight: 20, done: false },
      { id: '3', text: 'Return to equilibrium (50% of Asia)?', weight: 15, done: false },
      { id: '4', text: 'PD Array aligned (OB/FVG/Breaker)?', weight: 20, done: false },
      { id: '5', text: 'Killzone timing (London/NY)?', weight: 15, done: false },
      { id: '6', text: 'Displacement candle confirming direction?', weight: 15, done: false },
      { id: '7', text: 'Target: opposite Asia extreme?', weight: 5, done: false },
    ]
  }
};

// ==================== STORAGE KEYS ====================

const STORAGE_KEYS = {
  entries: 'journal_entries_v2',
  checklists: 'journal_checklists'
};

export function Journal() {
  useAuth(); // Authentication context
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TimeframeTab>('daily');
  
  // Strategy checklist state
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('ict-silver');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [probabilityScore, setProbabilityScore] = useState(0);
  
  // Journal entries
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  // Pre-trade protocol
  const [preTradeProtocol, setPreTradeProtocol] = useState({
    htfBias: '',
    keyLevels: '',
    session: '',
    riskPercent: '',
    maxTrades: ''
  });
  const [protocolComplete, setProtocolComplete] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'performance' as JournalEntry['type']
  });

  // Load data
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.entries);
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    
    const savedChecklist = localStorage.getItem(STORAGE_KEYS.checklists);
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      setChecklist(strategyChecklists[selectedStrategy].items);
    }
  }, []);

  // Update checklist when strategy changes
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEYS.checklists}_${selectedStrategy}`);
    if (saved) {
      setChecklist(JSON.parse(saved));
    } else {
      setChecklist(strategyChecklists[selectedStrategy].items.map(i => ({ ...i })));
    }
  }, [selectedStrategy]);

  // Calculate probability
  useEffect(() => {
    const completed = checklist.filter(i => i.done);
    const score = completed.reduce((sum, item) => sum + item.weight, 0);
    setProbabilityScore(score);
  }, [checklist]);

  // Check protocol completion
  useEffect(() => {
    const complete = Object.values(preTradeProtocol).every(v => v.trim() !== '');
    setProtocolComplete(complete);
  }, [preTradeProtocol]);

  // Save checklist
  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );
    setChecklist(updated);
    localStorage.setItem(`${STORAGE_KEYS.checklists}_${selectedStrategy}`, JSON.stringify(updated));
  };

  const resetChecklist = () => {
    const reset = strategyChecklists[selectedStrategy].items.map(i => ({ ...i, done: false }));
    setChecklist(reset);
    localStorage.setItem(`${STORAGE_KEYS.checklists}_${selectedStrategy}`, JSON.stringify(reset));
  };

  // Journal entry handlers
  const handleSaveEntry = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    const newEntry: JournalEntry = {
      id: editingEntry ? editingEntry.id : Date.now().toString(),
      date: new Date().toISOString(),
      timeframe: activeTab,
      type: formData.type,
      title: formData.title,
      content: formData.content,
      strategy: selectedStrategy,
      checklistCompletion: checklist.filter(i => i.done).length / checklist.length,
      probabilityScore,
      createdAt: new Date().toISOString()
    };

    let updated: JournalEntry[];
    if (editingEntry) {
      updated = entries.map(e => e.id === editingEntry.id ? newEntry : e);
    } else {
      updated = [newEntry, ...entries];
    }

    setEntries(updated);
    localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(updated));
    
    setShowEntryForm(false);
    setEditingEntry(null);
    setFormData({ title: '', content: '', type: 'performance' });
  };

  const handleDeleteEntry = (id: string) => {
    if (!confirm('Delete this journal entry?')) return;
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(updated));
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      type: entry.type
    });
    if (entry.strategy) setSelectedStrategy(entry.strategy);
    setShowEntryForm(true);
  };

  // Filter entries by tab
  const filteredEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    const now = new Date();
    
    if (activeTab === 'daily') {
      return entryDate.toDateString() === now.toDateString();
    }
    if (activeTab === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo;
    }
    if (activeTab === 'monthly') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return entryDate >= monthAgo;
    }
    return true;
  });

  const getProbabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProbabilityLabel = (score: number) => {
    if (score >= 80) return 'High Probability Setup';
    if (score >= 60) return 'Moderate Probability';
    if (score >= 40) return 'Low Probability';
    return 'Avoid Trade';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Advanced Trading Journal</h1>
        <p className="text-gray-400">Temporal workflows • Strategy checklists • Probability analysis</p>
      </div>

      {/* Timeframe Tabs */}
      <div className="flex gap-2 mb-6">
        {(['monthly', 'weekly', 'daily'] as TimeframeTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab} Review
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Strategy Checklist & Protocol */}
        <div className="space-y-6">
          {/* Strategy Selector */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="text-orange-500" size={24} />
              Strategy Checklist System
            </h2>
            
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value as StrategyType)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white mb-4"
            >
              <option value="ict-silver">ICT Silver Bullet</option>
              <option value="smc-ob">SMC Order Block</option>
              <option value="price-action">Price Action Structure</option>
              <option value="ict-pd">ICT Power of 3 + PD Arrays</option>
            </select>

            {/* Probability Meter */}
            <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Setup Probability</span>
                <span className={`text-2xl font-bold ${getProbabilityColor(probabilityScore)}`}>
                  {probabilityScore}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    probabilityScore >= 80 ? 'bg-green-500' :
                    probabilityScore >= 60 ? 'bg-yellow-500' :
                    probabilityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${probabilityScore}%` }}
                />
              </div>
              <p className={`text-center mt-2 font-medium ${getProbabilityColor(probabilityScore)}`}>
                {getProbabilityLabel(probabilityScore)}
              </p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 mb-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
                >
                  {item.done ? (
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  ) : (
                    <Circle className="text-gray-500 flex-shrink-0 mt-0.5" size={20} />
                  )}
                  <div className="flex-1">
                    <span className={`text-sm ${item.done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                      {item.text}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">(+{item.weight}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={resetChecklist}
              className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Reset Checklist
            </button>
          </div>

          {/* Pre-Trade Protocol */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckSquare className="text-blue-500" size={24} />
              Pre-Trade Protocol
              {!protocolComplete && <span className="text-red-500 text-sm">(Required)</span>}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">HTF Bias (H4/Daily)</label>
                <textarea
                  value={preTradeProtocol.htfBias}
                  onChange={e => setPreTradeProtocol({...preTradeProtocol, htfBias: e.target.value})}
                  placeholder="e.g., Bullish - price above 50 EMA, making HH/HL..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Key Levels (Support/Resistance)</label>
                <textarea
                  value={preTradeProtocol.keyLevels}
                  onChange={e => setPreTradeProtocol({...preTradeProtocol, keyLevels: e.target.value})}
                  placeholder="e.g., Resistance: 1.0950, Support: 1.0850..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Session</label>
                  <select
                    value={preTradeProtocol.session}
                    onChange={e => setPreTradeProtocol({...preTradeProtocol, session: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="london">London</option>
                    <option value="ny">New York</option>
                    <option value="asia">Asia</option>
                    <option value="overlap">London-NY Overlap</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Risk %</label>
                  <input
                    type="number"
                    value={preTradeProtocol.riskPercent}
                    onChange={e => setPreTradeProtocol({...preTradeProtocol, riskPercent: e.target.value})}
                    placeholder="1-2%"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Max Trades Today</label>
                <input
                  type="number"
                  value={preTradeProtocol.maxTrades}
                  onChange={e => setPreTradeProtocol({...preTradeProtocol, maxTrades: e.target.value})}
                  placeholder="e.g., 3"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
            </div>

            {protocolComplete ? (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-green-400 text-sm">Protocol Complete - Ready to Trade</span>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={20} />
                <span className="text-red-400 text-sm">Complete all fields before trading</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Journal Entries */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="text-purple-500" size={24} />
              {activeTab === 'daily' && 'Daily Session Review'}
              {activeTab === 'weekly' && 'Weekly Bias & Analysis'}
              {activeTab === 'monthly' && 'Monthly Growth & Psychology'}
            </h2>
            <button
              onClick={() => { setShowEntryForm(true); setEditingEntry(null); setFormData({ title: '', content: '', type: 'performance' }); }}
              disabled={!protocolComplete && activeTab === 'daily'}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              New Entry
            </button>
          </div>

          {!protocolComplete && activeTab === 'daily' && (
            <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={18} />
              <span className="text-yellow-400 text-sm">
                Complete Pre-Trade Protocol to enable journal entries
              </span>
            </div>
          )}

          {showEntryForm && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-white mb-4">
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Entry title..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as JournalEntry['type']})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="performance">Session Performance</option>
                    <option value="bias">Market Bias</option>
                    <option value="psychology">Psychology & Emotions</option>
                    <option value="economic">Economic Events</option>
                    <option value="growth">Growth & Learning</option>
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Your analysis, thoughts, lessons learned..."
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEntry}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    <Save size={18} />
                    Save Entry
                  </button>
                  <button
                    onClick={() => setShowEntryForm(false)}
                    className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Entries List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No {activeTab} entries yet.</p>
                <p className="text-sm">Document your trading journey!</p>
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div key={entry.id} className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{entry.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <span className="capitalize">{entry.type}</span>
                        <span>•</span>
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        {entry.probabilityScore !== undefined && (
                          <>
                            <span>•</span>
                            <span className={getProbabilityColor(entry.probabilityScore)}>
                              {entry.probabilityScore}% Probability
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-1 text-blue-400 hover:bg-blue-900/30 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 text-red-400 hover:bg-red-900/30 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{entry.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
