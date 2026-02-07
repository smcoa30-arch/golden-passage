import { useEffect, useState, useRef } from 'react';
import { Search, Plus, Trash2, Edit2, X, ChevronDown, Brain, AlertTriangle, Download, Smile, Frown, Meh, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

interface AIAnalysis {
  fundamentalBias: string;
  technicalBias: string;
  plan: string;
  riskWarning: string;
  entryZone: string;
  stopLoss: string;
  takeProfit: string;
  marketContext: string;
}

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

// ==================== AI SERVICE ====================

const KIMI_API_KEY = 'sk-kimi-ZYG0OqIc4MHrvFN8KLR8pUMps5q37N6Om69SzuthhZT1zNa8aWq9WJbeUkqwbwkO';
const GOOGLE_AI_KEY = 'AIzaSyDgcpJUaMewv-MUl66khU_uP8gGzlwWAB0';

// Demo mode - generates realistic analysis without APIs
function generateDemoAnalysis(instrument: string, tradeType: string): AIAnalysis {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' });
  
  // Generate realistic price levels based on instrument
  const basePrices: { [key: string]: number } = {
    'EUR/USD': 1.0850,
    'GBP/USD': 1.2650,
    'USD/JPY': 148.50,
    'USD/CHF': 0.8850,
    'AUD/USD': 0.6550,
    'NZD/USD': 0.5950,
    'USD/CAD': 1.3650,
    'EUR/GBP': 0.8570,
    'GBP/JPY': 187.50,
    'EUR/JPY': 161.20,
    'XAU/USD': 2035.50,
    'XAG/USD': 22.85,
    'USOIL': 73.50,
    'ES': 4950.00,
    'NQ': 17650.00,
    'YM': 38650.00,
    'HSI': 16500.00
  };
  
  const basePrice = basePrices[instrument] || 100.00;
  const pipSize = instrument.includes('JPY') ? 0.01 : instrument.includes('XAU') ? 0.1 : instrument.includes('XAG') ? 0.01 : instrument.includes('ES') || instrument.includes('NQ') || instrument.includes('YM') || instrument.includes('HSI') ? 1 : 0.0001;
  const pipValue = pipSize * 100;
  
  // Generate realistic levels
  const entryZone = `${(basePrice - pipValue * 0.5).toFixed(4)} - ${(basePrice + pipValue * 0.5).toFixed(4)}`;
  const stopLoss = (basePrice - pipValue * 2).toFixed(4);
  const takeProfit1 = (basePrice + pipValue * 3).toFixed(4);
  const takeProfit2 = (basePrice + pipValue * 5).toFixed(4);
  
  // Instrument-specific analysis
  const analyses: { [key: string]: { fundamental: string; technical: string; context: string } } = {
    'EUR/USD': {
      context: 'EUR/USD is trading within yesterday\'s range, respecting the Asian session consolidation. Price is approaching a key order block on the 4H timeframe.',
      fundamental: 'DXY showing weakness after Fed comments. Euro supported by better-than-expected EU inflation data. ECB maintains hawkish stance. Watch for US NFP data impact.',
      technical: 'Daily trend is bullish with HH/HL structure. Price mitigated a bullish order block at 1.0820 and bounced. Resistance at 1.0900 (previous day high), support at 1.0800. Look for FVG fills on 15m for entries.'
    },
    'GBP/USD': {
      context: 'Cable showing strength during London session. Price swept Asian session lows and reversed with momentum.',
      fundamental: 'BoE maintaining higher rates than ECB providing sterling support. UK PMI data beat expectations. DXY weakness helping GBP pairs across the board.',
      technical: 'Bullish structure on H4. Price formed a higher low at 1.2600. Key resistance at 1.2700 (previous week high). Bearish FVG at 1.2630-1.2640 may act as support on retest.'
    },
    'USD/JPY': {
      context: 'USD/JPY consolidating near recent highs. Tokyo session showed indecision with inside bars forming.',
      fundamental: 'BOJ intervention threats capping upside. US-Japan rate differential still supporting USD. Risk-off flows could trigger yen strength quickly. Monitor 10-year yields.',
      technical: 'Strong uptrend but overextended on Daily. Key support at 147.00 (previous resistance turned support). Bearish order block at 149.00. Watch for liquidity sweep above 149.50 before potential reversal.'
    },
    'XAU/USD': {
      context: 'Gold trading near key psychological $2000 level. Safe-haven flows active amid geopolitical tensions.',
      fundamental: 'Gold supported by declining real yields and geopolitical risk premium. DXY weakness providing tailwind. Watch for Fed speaker comments that could impact rate expectations.',
      technical: 'Daily bullish with price above 20 EMA. Key support at $2015 (bullish order block). Resistance at $2050. Silver lagging gold - potential arbitrage opportunity. Look for entries near $2020-2025 zone.'
    }
  };
  
  const defaultAnalysis = {
    context: `${instrument} is consolidating during the current session. Price action shows indecision with reduced volatility. Key levels from Asian session remain respected.`,
    fundamental: `Monitor DXY direction for USD pairs. Check forexfactory.com for today's high-impact news. Current market sentiment is mixed with no clear catalyst. Trade with caution during low volatility periods.`,
    technical: `Mark previous day high/low as key levels. Identify order blocks on H4 timeframe. Wait for price to reach premium/discount zones before entering. Use proper risk management with 1-2% per trade.`
  };
  
  const analysis = analyses[instrument] || defaultAnalysis;
  
  return {
    marketContext: `[DEMO MODE - ${currentDate} ${currentTime} EST] ${analysis.context}`,
    fundamentalBias: analysis.fundamental,
    technicalBias: analysis.technical,
    plan: `1. Wait for price to reach ${tradeType === 'Intraday' ? '15m/1H' : '4H/Daily'} premium/discount zone\n2. Look for liquidity sweep of Asian session highs/lows\n3. Confirm Market Structure Shift (MSS) on LTF\n4. Enter at Fair Value Gap or Order Block\n5. Target: ${takeProfit1} (1:1.5 RR) then ${takeProfit2}`,
    riskWarning: `[DEMO MODE - APIs unavailable] Always verify with your own analysis. Check forexfactory.com for news. Risk only 1-2% per trade. Current analysis is generated for educational purposes.`,
    entryZone: entryZone,
    stopLoss: stopLoss,
    takeProfit: takeProfit1
  };
}

async function getKimiAnalysis(instrument: string, tradeType: string): Promise<AIAnalysis | null> {
  try {
    console.log('Trying Kimi API...');
    const prompt = `As an expert institutional trader with 20+ years experience, analyze ${instrument} for ${tradeType} trading.

Provide analysis in this EXACT format:

MARKET_CONTEXT: Current price action and trend for ${instrument}
FUNDAMENTAL_BIAS: DXY, interest rates, and macro factors affecting ${instrument}
TECHNICAL_BIAS: Daily/4H trend, support/resistance, order blocks
THE_PLAN:
- Entry Zone: Price range
- Stop Loss: Logical level
- Take Profit 1: First target
RISK_WARNING: Key risks to watch

Be specific with price levels.`;

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'kimi-latest',
        messages: [
          { role: 'system', content: 'You are a professional trading analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      console.log('Kimi API failed:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    if (!content || content.length < 50) return null;

    const contextMatch = content.match(/MARKET_CONTEXT:\s*([^]*?)(?=FUNDAMENTAL_BIAS:|$)/i);
    const fundamentalMatch = content.match(/FUNDAMENTAL_BIAS:\s*([^]*?)(?=TECHNICAL_BIAS:|$)/i);
    const technicalMatch = content.match(/TECHNICAL_BIAS:\s*([^]*?)(?=THE_PLAN:|$)/i);
    const planMatch = content.match(/THE_PLAN:\s*([^]*?)(?=RISK_WARNING:|$)/i);
    const riskMatch = content.match(/RISK_WARNING:\s*([^]*?)$/i);
    
    const entryMatch = content.match(/Entry Zone:\s*([\d.,\s\-/~]+)/i) || content.match(/Entry:\s*([\d.,\s\-/~]+)/i);
    const stopMatch = content.match(/Stop Loss:\s*([\d.,\s\-/~]+)/i) || content.match(/Stop:\s*([\d.,\s\-/~]+)/i);
    const tpMatch = content.match(/Take Profit 1:\s*([\d.,\s\-/~]+)/i) || content.match(/TP1:\s*([\d.,\s\-/~]+)/i);

    return {
      marketContext: contextMatch?.[1]?.trim() || `${instrument} analysis`,
      fundamentalBias: fundamentalMatch?.[1]?.trim() || 'Check DXY and news',
      technicalBias: technicalMatch?.[1]?.trim() || 'Mark S/R levels manually',
      plan: planMatch?.[1]?.trim() || 'Follow your strategy',
      riskWarning: riskMatch?.[1]?.trim() || 'Risk 1-2% per trade',
      entryZone: entryMatch?.[1]?.trim() || 'See technical analysis',
      stopLoss: stopMatch?.[1]?.trim() || 'Below structure',
      takeProfit: tpMatch?.[1]?.trim() || 'Next S/R level'
    };
  } catch (error) {
    console.error('Kimi error:', error);
    return null;
  }
}

async function getGoogleAnalysis(instrument: string, tradeType: string): Promise<AIAnalysis | null> {
  try {
    console.log('Trying Google Gemini API...');
    const prompt = `As an expert institutional trader, analyze ${instrument} for ${tradeType} trading.

Format:
MARKET_CONTEXT: Current price action
FUNDAMENTAL_BIAS: Macro drivers
TECHNICAL_BIAS: Levels and structure
THE_PLAN: Entry, stop, targets
RISK_WARNING: Key risks

Use exact format with colons.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
      })
    });

    if (!response.ok) {
      console.log('Google API failed:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!content || content.length < 50) return null;

    const contextMatch = content.match(/MARKET_CONTEXT:\s*([^]*?)(?=FUNDAMENTAL_BIAS:|$)/i);
    const fundamentalMatch = content.match(/FUNDAMENTAL_BIAS:\s*([^]*?)(?=TECHNICAL_BIAS:|$)/i);
    const technicalMatch = content.match(/TECHNICAL_BIAS:\s*([^]*?)(?=THE_PLAN:|$)/i);
    const planMatch = content.match(/THE_PLAN:\s*([^]*?)(?=RISK_WARNING:|$)/i);
    const riskMatch = content.match(/RISK_WARNING:\s*([^]*?)$/i);
    
    const entryMatch = content.match(/Entry Zone:\s*([\d.,\s\-/~]+)/i) || content.match(/Entry:\s*([\d.,\s\-/~]+)/i);
    const stopMatch = content.match(/Stop Loss:\s*([\d.,\s\-/~]+)/i) || content.match(/Stop:\s*([\d.,\s\-/~]+)/i);
    const tpMatch = content.match(/Take Profit 1:\s*([\d.,\s\-/~]+)/i) || content.match(/TP1:\s*([\d.,\s\-/~]+)/i);

    return {
      marketContext: contextMatch?.[1]?.trim() || `${instrument} analysis`,
      fundamentalBias: fundamentalMatch?.[1]?.trim() || 'Check DXY and news',
      technicalBias: technicalMatch?.[1]?.trim() || 'Mark S/R levels manually',
      plan: planMatch?.[1]?.trim() || 'Follow your strategy',
      riskWarning: riskMatch?.[1]?.trim() || 'Risk 1-2% per trade',
      entryZone: entryMatch?.[1]?.trim() || 'See technical analysis',
      stopLoss: stopMatch?.[1]?.trim() || 'Below structure',
      takeProfit: tpMatch?.[1]?.trim() || 'Next S/R level'
    };
  } catch (error) {
    console.error('Google error:', error);
    return null;
  }
}

// ==================== COMPONENT ====================

export function Trades() {
  useAuth(); // Authentication check
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAIPlanner, setShowAIPlanner] = useState(false);
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

  // AI Planner state
  const [aiForm, setAiForm] = useState({
    instrument: '',
    tradeType: 'Intraday'
  });
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

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
    
    // Check if AI planner should be opened from sidebar
    const openAI = sessionStorage.getItem('openAIPlanner');
    if (openAI === 'true') {
      setShowAIPlanner(true);
      sessionStorage.removeItem('openAIPlanner');
    }
  }, []);

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
        if (!showModal && !showAIPlanner) {
          setShowModal(true);
        }
      }
      // K key - Open AI Assistant
      if (e.key === 'k' || e.key === 'K') {
        if (!showModal && !showAIPlanner) {
          setShowAIPlanner(true);
          handleInstrumentChange('');
        }
      }
      // Escape - Close modals
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowAIPlanner(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, showAIPlanner]);

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

  const handleInstrumentChange = (instrument: string) => {
    setAiForm({ ...aiForm, instrument });
  };

  const handleAIAnalysis = async () => {
    if (!aiForm.instrument) {
      alert('Please select an instrument');
      return;
    }
    setAiLoading(true);
    
    console.log('Starting AI analysis for:', aiForm.instrument);
    
    let analysis: AIAnalysis | null = null;
    
    // Try Kimi first
    analysis = await getKimiAnalysis(aiForm.instrument, aiForm.tradeType);
    
    // Try Google if Kimi failed
    if (!analysis) {
      console.log('Kimi failed, trying Google...');
      analysis = await getGoogleAnalysis(aiForm.instrument, aiForm.tradeType);
    }
    
    // Use demo mode if both APIs failed
    if (!analysis) {
      console.log('Both APIs failed, using demo mode...');
      analysis = generateDemoAnalysis(aiForm.instrument, aiForm.tradeType);
    }
    
    console.log('Analysis complete:', analysis ? 'Success' : 'Failed');
    setAiAnalysis(analysis);
    setAiLoading(false);
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
            onClick={() => setShowAIPlanner(true)}
            className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-colors"
          >
            <Brain size={18} />
            AI Planner
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
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
      )}

      {/* AI Planner Modal */}
      {showAIPlanner && (
        <div className="modal-overlay" onClick={() => setShowAIPlanner(false)}>
          <div className="modal-content max-w-3xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Brain className="text-purple-400" size={24} />
                  Kimi AI Trade Planner
                </h2>
                <p className="text-gray-500 text-sm mt-1">Institutional-grade analysis powered by AI</p>
              </div>
              <button 
                onClick={() => setShowAIPlanner(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {!aiAnalysis ? (
                <>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Select Instrument</label>
                    <select
                      value={aiForm.instrument}
                      onChange={(e) => setAiForm({...aiForm, instrument: e.target.value})}
                      className="select-field w-full"
                    >
                      <option value="">Choose instrument...</option>
                      {instruments.map(i => (
                        <option key={i.symbol} value={i.symbol}>{i.symbol} - {i.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Trade Type</label>
                    <div className="flex gap-2">
                      {['Intraday', 'Swing', 'Position'].map(type => (
                        <button
                          key={type}
                          onClick={() => setAiForm({...aiForm, tradeType: type})}
                          className={`flex-1 py-2 rounded-lg transition-colors ${
                            aiForm.tradeType === type 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <p className="text-sm text-blue-300 flex items-center gap-2">
                      <Brain size={16} />
                      Kimi AI will search for current market data including:
                    </p>
                    <ul className="text-xs text-gray-400 mt-2 space-y-1 ml-6 list-disc">
                      <li>Real-time price and trend analysis</li>
                      <li>Key support/resistance levels</li>
                      <li>Recent news and economic events</li>
                      <li>Technical setup with entry/stop/target</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleAIAnalysis}
                    disabled={aiLoading || !aiForm.instrument}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching market data & analyzing...
                      </>
                    ) : (
                      <>
                        <Brain size={20} />
                        Analyze with Kimi AI
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {/* Analysis Results */}
                  {aiAnalysis.marketContext?.includes('DEMO MODE') && (
                    <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-yellow-400" size={18} />
                        <span className="text-yellow-400 font-semibold text-sm">Demo Mode Active</span>
                      </div>
                      <p className="text-yellow-200/70 text-xs mt-1">
                        AI APIs are unavailable. Showing generated analysis for educational purposes. 
                        Always verify with your own research before trading.
                      </p>
                    </div>
                  )}
                  {aiAnalysis.marketContext && (
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                      <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp size={18} />
                        Market Context (AI-Searched)
                      </h3>
                      <p className="text-gray-300 text-sm">{aiAnalysis.marketContext}</p>
                    </div>
                  )}

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-purple-400 font-semibold mb-2">Fundamental Bias</h3>
                    <p className="text-gray-300 text-sm">{aiAnalysis.fundamentalBias}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-blue-400 font-semibold mb-2">Technical Bias</h3>
                    <p className="text-gray-300 text-sm">{aiAnalysis.technicalBias}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 text-center">
                      <p className="text-green-400 text-xs mb-1">Entry Zone</p>
                      <p className="text-white font-semibold">{aiAnalysis.entryZone}</p>
                    </div>
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 text-center">
                      <p className="text-red-400 text-xs mb-1">Stop Loss</p>
                      <p className="text-white font-semibold">{aiAnalysis.stopLoss}</p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-center">
                      <p className="text-blue-400 text-xs mb-1">Take Profit</p>
                      <p className="text-white font-semibold">{aiAnalysis.takeProfit}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-orange-400 font-semibold mb-2">The Plan</h3>
                    <p className="text-gray-300 text-sm whitespace-pre-line">{aiAnalysis.plan}</p>
                  </div>

                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <h3 className="text-red-400 font-semibold mb-1">Risk Warning</h3>
                      <p className="text-gray-300 text-sm">{aiAnalysis.riskWarning}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setAiAnalysis(null);
                        setAiForm({ instrument: '', tradeType: 'Intraday' });
                      }}
                      className="flex-1 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      New Analysis
                    </button>
                    <button
                      onClick={() => {
                        setShowAIPlanner(false);
                        setShowModal(true);
                      }}
                      className="flex-1 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      Log This Trade
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
