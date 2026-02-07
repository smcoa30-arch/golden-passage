import { useEffect, useState, useRef } from 'react';
import { Search, Plus, Trash2, Edit2, X, ChevronDown, Brain, AlertTriangle, Download, Smile, Frown, Meh, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import type { AIAnalysis } from '../services/aiApi';

// ==================== TYPES ====================

interface Trade {
  id: string;
  pair: string;
  category: string;
  type: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  pnl: number;
  date: string;
  strategy: string;
  notes?: string;
  lotSize?: number;
  psychology?: 'calm' | 'confident' | 'anxious' | 'greedy' | 'revenge';
  aiAnalysis?: AIAnalysis;
  timestamp: number;
}

// AIAnalysis type is imported from services/aiApi

interface Instrument {
  symbol: string;
  name: string;
  category: string;
}

// ==================== INSTRUMENT DATA ====================

const instruments: Instrument[] = [
  // Major Pairs
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Major Pairs' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Major Pairs' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Major Pairs' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'Major Pairs' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'Major Pairs' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'Major Pairs' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'Major Pairs' },
  
  // Crosses
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'Crosses' },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'Crosses' },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'Crosses' },
  
  // Commodities
  { symbol: 'XAU/USD', name: 'Gold', category: 'Commodities' },
  { symbol: 'XAG/USD', name: 'Silver', category: 'Commodities' },
  { symbol: 'USOIL', name: 'US Oil (WTI)', category: 'Commodities' },
  
  // Indices
  { symbol: 'ES', name: 'S&P 500 (E-mini)', category: 'Indices' },
  { symbol: 'NQ', name: 'Nasdaq 100 (E-mini)', category: 'Indices' },
  { symbol: 'YM', name: 'Dow Jones (E-mini)', category: 'Indices' },
  { symbol: 'HSI', name: 'Hang Seng Index', category: 'Indices' },
];

const strategies = [
  'ICT Silver Bullet',
  'SMC Order Block',
  'Price Action Flip',
  'ICT Power of 3',
  'Trend Following',
  'Breakout',
  'Support/Resistance',
  'Other'
];

const psychologyOptions = [
  { value: 'calm', label: 'Calm & Focused', icon: Smile, color: 'green' },
  { value: 'confident', label: 'Confident', icon: Zap, color: 'blue' },
  { value: 'anxious', label: 'Anxious', icon: Meh, color: 'yellow' },
  { value: 'greedy', label: 'Greedy/FOMO', icon: AlertTriangle, color: 'orange' },
  { value: 'revenge', label: 'Revenge Trading', icon: Frown, color: 'red' },
];

const STORAGE_KEY = 'trades_v2';
const DRAFT_KEY = 'trade_draft';

// ==================== COMPONENT ====================

export function Trades() {
  useAuth(); // Authentication check
  const { openAIAssistant, prefillTradeData, setPrefillTradeData, shouldOpenTradeLog, setShouldOpenTradeLog } = useAI();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [search, setSearch] = useState('');
  const [filterStrategy, setFilterStrategy] = useState('all');
  const [filterPsychology, setFilterPsychology] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    pair: '',
    category: '',
    type: 'Buy' as 'Buy' | 'Sell',
    entry: '',
    exit: '',
    lotSize: '1',
    strategy: 'ICT Silver Bullet',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    psychology: 'calm' as Trade['psychology'],
  });

  // Instrument search
  const [instrumentSearch, setInstrumentSearch] = useState('');
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load trades
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTrades(JSON.parse(saved));
      } catch {
        setTrades([]);
      }
    }
    setLoading(false);
  }, []);

  // Handle prefill data from AI Assistant
  useEffect(() => {
    if (prefillTradeData) {
      setFormData(prev => ({
        ...prev,
        pair: prefillTradeData.pair || prev.pair,
        entry: prefillTradeData.entry || prev.entry,
        exit: prefillTradeData.exit || prev.exit,
        notes: prefillTradeData.notes || prev.notes,
      }));
      setInstrumentSearch(prefillTradeData.pair || '');
      setPrefillTradeData(null);
    }
  }, [prefillTradeData, setPrefillTradeData]);

  // Handle opening trade log from AI Assistant
  useEffect(() => {
    if (shouldOpenTradeLog) {
      setShowModal(true);
      setShouldOpenTradeLog(false);
    }
  }, [shouldOpenTradeLog, setShouldOpenTradeLog]);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  // Save draft when form changes
  useEffect(() => {
    if (showModal && (formData.pair || formData.notes)) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, showModal]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // L key - Open Log
      if (e.key === 'l' || e.key === 'L') {
        if (!showModal) {
          setShowModal(true);
        }
      }
      // K key - Open AI Assistant
      if (e.key === 'k' || e.key === 'K') {
        if (!showModal) {
          openAIAssistant();
        }
      }
      // Escape - Close modals
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, openAIAssistant]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowInstrumentDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveTrades = (newTrades: Trade[]) => {
    setTrades(newTrades);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTrades));
  };

  const calculatePnL = (entry: number, exit: number, type: 'Buy' | 'Sell', lotSize: number, pair: string) => {
    const pipValue = pair.includes('JPY') ? 0.01 : 0.0001;
    const lotValue = 100000 * lotSize;
    
    if (type === 'Buy') {
      return ((exit - entry) / pipValue) * (lotValue / 100000) * 10;
    } else {
      return ((entry - exit) / pipValue) * (lotValue / 100000) * 10;
    }
  };

  const handleSubmit = () => {
    const entryPrice = parseFloat(formData.entry);
    const exitPrice = parseFloat(formData.exit);
    const lotSize = parseFloat(formData.lotSize) || 1;

    if (!formData.pair || isNaN(entryPrice) || isNaN(exitPrice)) {
      alert('Please fill in all required fields');
      return;
    }

    const pnl = calculatePnL(entryPrice, exitPrice, formData.type, lotSize, formData.pair);

    const tradeData: Trade = {
      id: editingTrade ? editingTrade.id : Date.now().toString(),
      pair: formData.pair,
      category: instruments.find(i => i.symbol === formData.pair)?.category || 'Other',
      type: formData.type,
      entry: entryPrice,
      exit: exitPrice,
      lotSize,
      pnl: Math.round(pnl * 100) / 100,
      date: formData.date,
      strategy: formData.strategy,
      notes: formData.notes,
      psychology: formData.psychology,
      timestamp: Date.now()
    };

    if (editingTrade) {
      saveTrades(trades.map(t => t.id === editingTrade.id ? tradeData : t));
    } else {
      saveTrades([tradeData, ...trades]);
    }

    // Clear draft
    localStorage.removeItem(DRAFT_KEY);
    
    setShowModal(false);
    setEditingTrade(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      pair: '',
      category: '',
      type: 'Buy',
      entry: '',
      exit: '',
      lotSize: '1',
      strategy: 'ICT Silver Bullet',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      psychology: 'calm'
    });
    setInstrumentSearch('');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this trade?')) return;
    saveTrades(trades.filter(t => t.id !== id));
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setFormData({
      pair: trade.pair,
      category: trade.category,
      type: trade.type,
      entry: trade.entry.toString(),
      exit: trade.exit.toString(),
      lotSize: trade.lotSize?.toString() || '1',
      strategy: trade.strategy,
      date: trade.date,
      notes: trade.notes || '',
      psychology: trade.psychology || 'calm'
    });
    setInstrumentSearch(trade.pair);
    setShowModal(true);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Instrument', 'Category', 'Type', 'Entry', 'Exit', 'Lot Size', 'P&L', 'Strategy', 'Psychology', 'Notes'];
    const rows = trades.map(t => [
      t.date, t.pair, t.category, t.type, t.entry, t.exit, t.lotSize, t.pnl, t.strategy, t.psychology, `"${t.notes || ''}"`
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredInstruments = instruments.filter(i => 
    i.symbol.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
    i.name.toLowerCase().includes(instrumentSearch.toLowerCase())
  );

  const filteredTrades = trades.filter(t => {
    if (search && !t.pair.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStrategy !== 'all' && t.strategy !== filterStrategy) return false;
    if (filterPsychology !== 'all' && t.psychology !== filterPsychology) return false;
    return true;
  });

  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winCount = trades.filter(t => t.pnl > 0).length;
  const lossCount = trades.filter(t => t.pnl < 0).length;

  // Psychology analysis
  const psychologyStats = trades.reduce((acc, t) => {
    if (t.psychology) {
      if (!acc[t.psychology]) acc[t.psychology] = { count: 0, wins: 0, pnl: 0 };
      acc[t.psychology].count++;
      if (t.pnl > 0) acc[t.psychology].wins++;
      acc[t.psychology].pnl += t.pnl;
    }
    return acc;
  }, {} as Record<string, { count: number; wins: number; pnl: number }>);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Trading Log</h1>
          <p className="text-gray-400 text-sm mt-1">Press <kbd className="px-2 py-1 bg-gray-800 rounded text-orange-400">L</kbd> to log • <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400">K</kbd> for AI</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={openAIAssistant}
            className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-colors"
          >
            <Brain size={18} />
            AI Assistant
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => { resetForm(); setEditingTrade(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={18} />
            Log Trade
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-2xl font-bold text-white">{trades.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm">Win/Loss</p>
          <p className="text-2xl font-bold text-green-400">{winCount}<span className="text-gray-500">/</span><span className="text-red-400">{lossCount}</span></p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm">Total P&L</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${totalPnl.toFixed(0)}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            {trades.length > 0 ? ((winCount / trades.length) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Psychology Insights */}
      {Object.keys(psychologyStats).length > 0 && (
        <div className="glass-card p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Brain size={20} className="text-purple-400" />
            Psychology Insights
          </h3>
          <div className="grid md:grid-cols-5 gap-3">
            {Object.entries(psychologyStats).map(([mood, stats]) => {
              const winRate = stats.count > 0 ? (stats.wins / stats.count) * 100 : 0;
              const moodConfig = psychologyOptions.find(p => p.value === mood);
              return (
                <div key={mood} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {moodConfig && <moodConfig.icon size={16} className={`text-${moodConfig.color}-400`} />}
                    <span className="text-sm text-gray-300 capitalize">{mood}</span>
                  </div>
                  <p className={`text-lg font-bold ${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {winRate.toFixed(0)}% WR
                  </p>
                  <p className={`text-xs ${stats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${stats.pnl.toFixed(0)} P&L
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search trades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
          </div>
          <select 
            value={filterStrategy}
            onChange={(e) => setFilterStrategy(e.target.value)}
            className="select-field"
          >
            <option value="all">All Strategies</option>
            {strategies.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={filterPsychology}
            onChange={(e) => setFilterPsychology(e.target.value)}
            className="select-field"
          >
            <option value="all">All Moods</option>
            {psychologyOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Trades Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredTrades.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <p className="text-gray-400">No trades found</p>
          <button onClick={() => setShowModal(true)} className="text-orange-400 hover:underline mt-2">
            Log your first trade
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Instrument</th>
                <th>Type</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>P&L</th>
                <th>Strategy</th>
                <th>Mood</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id}>
                  <td className="text-gray-400">{trade.date}</td>
                  <td>
                    <div>
                      <span className="font-medium text-white">{trade.pair}</span>
                      <span className="text-xs text-gray-500 ml-2">{trade.category}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-${trade.type === 'Buy' ? 'success' : 'danger'}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="text-gray-400">{trade.entry}</td>
                  <td className="text-gray-400">{trade.exit}</td>
                  <td className={`font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(0)}
                  </td>
                  <td className="text-gray-400 text-sm">{trade.strategy}</td>
                  <td>
                    {trade.psychology && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        trade.psychology === 'calm' ? 'bg-green-500/10 text-green-400' :
                        trade.psychology === 'confident' ? 'bg-blue-500/10 text-blue-400' :
                        trade.psychology === 'anxious' ? 'bg-yellow-500/10 text-yellow-400' :
                        trade.psychology === 'greedy' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {psychologyOptions.find(p => p.value === trade.psychology)?.icon && (
                          <span>
                            {(() => {
                              const Icon = psychologyOptions.find(p => p.value === trade.psychology)?.icon;
                              return Icon ? <Icon size={12} /> : null;
                            })()}
                          </span>
                        )}
                        <span className="capitalize">{trade.psychology}</span>
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(trade)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(trade.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trade Log Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50" onClick={() => setShowModal(false)}>
          <div className="modal-overlay">
            <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                {editingTrade ? 'Edit Trade' : 'Log New Trade'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Instrument Selector */}
              <div className="relative" ref={dropdownRef}>
                <label className="text-gray-400 text-sm mb-1 block">Instrument *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={instrumentSearch}
                    onChange={(e) => {
                      setInstrumentSearch(e.target.value);
                      setShowInstrumentDropdown(true);
                    }}
                    onFocus={() => setShowInstrumentDropdown(true)}
                    placeholder="Search instrument..."
                    className="input-field w-full"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                </div>
                
                {showInstrumentDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {['Major Pairs', 'Crosses', 'Commodities', 'Indices'].map(category => {
                      const categoryInstruments = filteredInstruments.filter(i => i.category === category);
                      if (categoryInstruments.length === 0) return null;
                      return (
                        <div key={category}>
                          <div className="px-3 py-2 bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase">
                            {category}
                          </div>
                          {categoryInstruments.map(inst => (
                            <button
                              key={inst.symbol}
                              onClick={() => {
                                setFormData({ ...formData, pair: inst.symbol, category: inst.category });
                                setInstrumentSearch(inst.symbol);
                                setShowInstrumentDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-800 flex justify-between items-center"
                            >
                              <span className="text-white font-medium">{inst.symbol}</span>
                              <span className="text-gray-500 text-sm">{inst.name}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Trade Type</label>
                <div className="flex gap-2">
                  {(['Buy', 'Sell'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        formData.type === t 
                          ? t === 'Buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Entry Price *</label>
                  <input 
                    type="number"
                    step="0.00001"
                    value={formData.entry}
                    onChange={(e) => setFormData({...formData, entry: e.target.value})}
                    className="input-field w-full"
                    placeholder="1.08500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Exit Price *</label>
                  <input 
                    type="number"
                    step="0.00001"
                    value={formData.exit}
                    onChange={(e) => setFormData({...formData, exit: e.target.value})}
                    className="input-field w-full"
                    placeholder="1.09250"
                  />
                </div>
              </div>

              {/* Lot Size & Strategy */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Lot Size</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.lotSize}
                    onChange={(e) => setFormData({...formData, lotSize: e.target.value})}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Strategy</label>
                  <select 
                    value={formData.strategy}
                    onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                    className="select-field w-full"
                  >
                    {strategies.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Date & Psychology */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Date</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Psychology/Mood</label>
                  <select 
                    value={formData.psychology}
                    onChange={(e) => setFormData({...formData, psychology: e.target.value as Trade['psychology']})}
                    className="select-field w-full"
                  >
                    {psychologyOptions.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field w-full"
                  rows={3}
                  placeholder="Trade notes, lessons learned..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                {editingTrade ? 'Update Trade' : 'Save Trade'}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

    </div>
  );
}
