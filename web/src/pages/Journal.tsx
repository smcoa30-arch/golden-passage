import { useState, useEffect } from 'react';
import { Camera, CheckCircle, Circle, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface JournalEntry {
  id: string;
  date: string;
  marketConditions: string;
  emotionalState: string;
  lessonsLearned: string;
  notes: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  preMarket: 'checklist_premarket',
  entry: 'checklist_entry',
  postMarket: 'checklist_postmarket',
  entries: 'journal_entries',
};

const defaultChecklists = {
  preMarket: [
    { id: '1', text: 'Check economic calendar', done: false },
    { id: '2', text: 'Review overnight price action', done: false },
    { id: '3', text: 'Identify key support/resistance levels', done: false },
    { id: '4', text: 'Set daily risk limit (1-2%)', done: false },
    { id: '5', text: 'Review trading plan for the day', done: false },
  ],
  entry: [
    { id: '1', text: 'Signal aligns with higher timeframe trend', done: false },
    { id: '2', text: 'Risk/Reward ratio ≥ 1:2', done: false },
    { id: '3', text: 'Position size calculated correctly', done: false },
    { id: '4', text: 'Stop loss placed before entry', done: false },
    { id: '5', text: 'Entry confirmation candlestick pattern', done: false },
  ],
  postMarket: [
    { id: '1', text: 'Log all trades taken today', done: false },
    { id: '2', text: 'Review winning trades - what went well?', done: false },
    { id: '3', text: 'Review losing trades - lessons learned?', done: false },
    { id: '4', text: 'Note emotional state during trading', done: false },
    { id: '5', text: 'Write journal entry for the day', done: false },
  ],
};

export function Journal() {
  const { user } = useAuth();
  
  // Checklists state
  const [preMarket, setPreMarket] = useState<ChecklistItem[]>([]);
  const [entry, setEntry] = useState<ChecklistItem[]>([]);
  const [postMarket, setPostMarket] = useState<ChecklistItem[]>([]);
  
  // Journal entries state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    marketConditions: '',
    emotionalState: 'calm',
    lessonsLearned: '',
    notes: '',
  });

  // Load data from localStorage
  useEffect(() => {
    const loadChecklist = (key: string, defaultItems: ChecklistItem[]) => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultItems;
    };
    
    setPreMarket(loadChecklist(STORAGE_KEYS.preMarket, defaultChecklists.preMarket));
    setEntry(loadChecklist(STORAGE_KEYS.entry, defaultChecklists.entry));
    setPostMarket(loadChecklist(STORAGE_KEYS.postMarket, defaultChecklists.postMarket));
    
    const savedEntries = localStorage.getItem(STORAGE_KEYS.entries);
    setEntries(savedEntries ? JSON.parse(savedEntries) : []);
  }, []);

  // Save checklist when changed
  const toggleChecklistItem = (list: ChecklistItem[], setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>, storageKey: string, id: string) => {
    const updated = list.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );
    setList(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const resetChecklist = (setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>, storageKey: string, defaultItems: ChecklistItem[]) => {
    const reset = defaultItems.map(item => ({ ...item, done: false }));
    setList(reset);
    localStorage.setItem(storageKey, JSON.stringify(reset));
  };

  // Journal entry handlers
  const handleSaveEntry = () => {
    if (!formData.marketConditions.trim()) {
      alert('Please describe market conditions');
      return;
    }

    const newEntry: JournalEntry = {
      id: editingEntry ? editingEntry.id : Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    let updatedEntries: JournalEntry[];
    if (editingEntry) {
      updatedEntries = entries.map(e => e.id === editingEntry.id ? newEntry : e);
    } else {
      updatedEntries = [newEntry, ...entries];
    }

    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(updatedEntries));
    
    setShowEntryForm(false);
    setEditingEntry(null);
    resetForm();
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
      date: entry.date,
      marketConditions: entry.marketConditions,
      emotionalState: entry.emotionalState,
      lessonsLearned: entry.lessonsLearned,
      notes: entry.notes,
    });
    setShowEntryForm(true);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      marketConditions: '',
      emotionalState: 'calm',
      lessonsLearned: '',
      notes: '',
    });
  };

  const ChecklistCard = ({ title, items, setItems, storageKey, defaultItems }: {
    title: string;
    items: ChecklistItem[];
    setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
    storageKey: string;
    defaultItems: ChecklistItem[];
  }) => {
    const completed = items.filter(i => i.done).length;
    const progress = items.length > 0 ? (completed / items.length) * 100 : 0;

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={() => resetChecklist(setItems, storageKey, defaultItems)}
            className="text-xs text-gray-500 hover:text-orange-600"
          >
            Reset
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-orange-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-3">{completed}/{items.length} completed</p>
        <div className="space-y-2">
          {items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => toggleChecklistItem(items, setItems, storageKey, item.id)}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
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
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trading Journal</h1>

      {/* Checklists */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <ChecklistCard 
          title="Pre-Market Checklist"
          items={preMarket}
          setItems={setPreMarket}
          storageKey={STORAGE_KEYS.preMarket}
          defaultItems={defaultChecklists.preMarket}
        />
        <ChecklistCard 
          title="Entry Checklist"
          items={entry}
          setItems={setEntry}
          storageKey={STORAGE_KEYS.entry}
          defaultItems={defaultChecklists.entry}
        />
        <ChecklistCard 
          title="Post-Market Checklist"
          items={postMarket}
          setItems={setPostMarket}
          storageKey={STORAGE_KEYS.postMarket}
          defaultItems={defaultChecklists.postMarket}
        />
      </div>

      {/* Journal Entries */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Journal Entries</h2>
          <button 
            onClick={() => { setShowEntryForm(true); setEditingEntry(null); resetForm(); }}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            New Entry
          </button>
        </div>

        {showEntryForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-4">{editingEntry ? 'Edit Entry' : 'New Journal Entry'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Conditions</label>
                <textarea 
                  rows={2}
                  value={formData.marketConditions}
                  onChange={(e) => setFormData({...formData, marketConditions: e.target.value})}
                  placeholder="Describe today's market conditions (trending, ranging, volatile...)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emotional State</label>
                <select 
                  value={formData.emotionalState}
                  onChange={(e) => setFormData({...formData, emotionalState: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="calm">Calm and focused</option>
                  <option value="confident">Confident</option>
                  <option value="anxious">Anxious</option>
                  <option value="impatient">Impatient</option>
                  <option value="frustrated">Frustrated</option>
                  <option value="excited">Excited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lessons Learned</label>
                <textarea 
                  rows={2}
                  value={formData.lessonsLearned}
                  onChange={(e) => setFormData({...formData, lessonsLearned: e.target.value})}
                  placeholder="What did you learn from today's trading?"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any other observations or thoughts..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveEntry}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Save size={18} />
                  Save Entry
                </button>
                <button 
                  onClick={() => setShowEntryForm(false)}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No journal entries yet.</p>
              <p className="text-sm">Start documenting your trading journey!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{entry.date}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      entry.emotionalState === 'calm' || entry.emotionalState === 'confident' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {entry.emotionalState}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditEntry(entry)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Market:</span> {entry.marketConditions}</p>
                  {entry.lessonsLearned && (
                    <p><span className="font-medium">Lessons:</span> {entry.lessonsLearned}</p>
                  )}
                  {entry.notes && (
                    <p><span className="font-medium">Notes:</span> {entry.notes}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
