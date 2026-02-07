import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Brain, TrendingUp, AlertTriangle, Bookmark, BookmarkCheck, 
  FileText, Clock, Trash2, ChevronLeft, Scale, Shield
} from 'lucide-react';
import { useAI } from '../contexts/AIContext';
// AIAnalysis type is imported via useAI context

// ==================== TYPES ====================

interface Instrument {
  symbol: string;
  name: string;
  category: string;
}

const instruments: Instrument[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Major Pairs' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Major Pairs' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Major Pairs' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'Major Pairs' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'Major Pairs' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'Major Pairs' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'Major Pairs' },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'Crosses' },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'Crosses' },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'Crosses' },
  { symbol: 'XAU/USD', name: 'Gold', category: 'Commodities' },
  { symbol: 'XAG/USD', name: 'Silver', category: 'Commodities' },
  { symbol: 'USOIL', name: 'US Oil (WTI)', category: 'Commodities' },
  { symbol: 'ES', name: 'S&P 500 (E-mini)', category: 'Indices' },
  { symbol: 'NQ', name: 'Nasdaq 100 (E-mini)', category: 'Indices' },
  { symbol: 'YM', name: 'Dow Jones (E-mini)', category: 'Indices' },
  { symbol: 'HSI', name: 'Hang Seng Index', category: 'Indices' },
];

// ==================== HELPER FUNCTIONS ====================

function formatStructuredText(text: string): React.ReactNode {
  if (!text) return null;
  
  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .replace(/`/g, '')
    .replace(/_{2,}/g, '')
    .replace(/_{1}/g, '')
    .replace(/\[|\]/g, '')
    .trim();
  
  const lines = cleanText.split('\n').filter(line => line.trim());
  const hasBullets = lines.some(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
  
  if (hasBullets) {
    return (
      <ul className="space-y-1.5">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
            const content = trimmed.substring(1).trim();
            if (content.includes(':')) {
              const [key, ...valueParts] = content.split(':');
              const value = valueParts.join(':').trim();
              return (
                <li key={idx} className="flex gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    <span className="font-medium text-gray-200">{key.trim()}:</span>
                    {value && <span className="text-gray-300"> {value}</span>}
                  </span>
                </li>
              );
            }
            return (
              <li key={idx} className="flex gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span className="text-gray-300">{content}</span>
              </li>
            );
          }
          return <p key={idx} className="text-gray-300">{trimmed}</p>;
        })}
      </ul>
    );
  }
  
  const hasNumbers = lines.some(line => /^\d+\./.test(line.trim()));
  
  if (hasNumbers) {
    return (
      <ol className="space-y-1.5 list-decimal list-inside">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const match = trimmed.match(/^\d+\.\s*(.+)$/);
          if (match) {
            return <li key={idx} className="text-gray-300 pl-1">{match[1]}</li>;
          }
          return <p key={idx} className="text-gray-300">{trimmed}</p>;
        })}
      </ol>
    );
  }
  
  return lines.map((line, idx) => (
    <p key={idx} className="text-gray-300 leading-relaxed">{line}</p>
  ));
}

// Extract price from text
function extractPrice(text: string): string {
  const match = text.match(/(\d+\.?\d*)/);
  return match ? match[1] : '';
}

// ==================== COMPONENT ====================

export function AIAssistantModal() {
  const navigate = useNavigate();
  const {
    isOpen,
    closeAIAssistant,
    aiAnalysis,
    setAiAnalysis,
    aiLoading,
    handleAIAnalysis,
    savedAnalyses,
    saveAnalysis,
    deleteSavedAnalysis,
    loadSavedAnalysis,
    showSavedAnalyses,
    setShowSavedAnalyses,
    setPrefillTradeData,
    setShouldOpenTradeLog,
  } = useAI();

  const [aiForm, setAiForm] = useState({
    instrument: '',
    tradeType: 'Intraday'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAiForm({ instrument: '', tradeType: 'Intraday' });
      setSavedSuccess(false);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAIAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAIAssistant]);

  if (!isOpen) return null;

  const onAnalyze = async () => {
    if (!aiForm.instrument) {
      alert('Please select an instrument');
      return;
    }
    await handleAIAnalysis(aiForm.instrument, aiForm.tradeType);
  };

  const onSaveForLater = () => {
    if (!aiAnalysis || !aiForm.instrument) return;
    saveAnalysis(aiForm.instrument, aiForm.tradeType, aiAnalysis);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const onLogTrade = () => {
    if (!aiAnalysis || !aiForm.instrument) return;
    
    // Extract entry and exit from the analysis
    const entryPrice = extractPrice(aiAnalysis.entryZone);
    const exitPrice = extractPrice(aiAnalysis.takeProfit);
    
    // Create prefill data
    const prefillData = {
      pair: aiForm.instrument,
      entry: entryPrice,
      exit: exitPrice,
      notes: `AI Analysis - ${aiForm.tradeType}\n\nFundamental: ${aiAnalysis.fundamentalBias.substring(0, 100)}...\n\nTechnical: ${aiAnalysis.technicalBias.substring(0, 100)}...\n\nPlan: ${aiAnalysis.plan.substring(0, 200)}...`,
    };
    
    setPrefillTradeData(prefillData);
    setShouldOpenTradeLog(true);
    closeAIAssistant();
    navigate('/trades');
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show saved analyses list
  if (showSavedAnalyses) {
    return (
      <div className="modal-overlay" onClick={closeAIAssistant}>
        <div className="modal-content max-w-4xl w-[95vw]" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSavedAnalyses(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BookmarkCheck className="text-purple-400" size={24} />
                  Saved Analyses
                </h2>
                <p className="text-gray-500 text-sm mt-1">Your previously saved trade analyses</p>
              </div>
            </div>
            <button 
              onClick={closeAIAssistant}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {savedAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No saved analyses yet</p>
                <button 
                  onClick={() => setShowSavedAnalyses(false)}
                  className="mt-4 text-purple-400 hover:underline"
                >
                  Create your first analysis
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedAnalyses.map((saved) => (
                  <div 
                    key={saved.id} 
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-white">{saved.instrument}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                            {saved.tradeType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <Clock size={14} />
                          {formatDate(saved.createdAt)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setAiForm({ 
                              instrument: saved.instrument, 
                              tradeType: saved.tradeType 
                            });
                            loadSavedAnalysis(saved.id);
                          }}
                          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-sm transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => deleteSavedAnalysis(saved.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-400 line-clamp-2">
                      {saved.analysis.fundamentalBias.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={closeAIAssistant}>
      <div className="modal-content max-w-6xl w-[95vw]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Brain className="text-purple-400" size={24} />
              AI Trade Assistant
            </h2>
            <p className="text-gray-500 text-sm mt-1">Institutional-grade analysis powered by AI</p>
          </div>
          <div className="flex items-center gap-2">
            {savedAnalyses.length > 0 && (
              <button 
                onClick={() => setShowSavedAnalyses(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Bookmark size={18} />
                <span className="hidden sm:inline">Saved ({savedAnalyses.length})</span>
              </button>
            )}
            <button 
              onClick={closeAIAssistant}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {!aiAnalysis ? (
            <>
              {/* Legal Disclaimer Banner */}
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Scale className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="text-yellow-400 font-semibold text-sm mb-1">Legal Disclaimer</h3>
                    <p className="text-yellow-200/70 text-xs">
                      This AI-generated analysis is for educational purposes only and does not constitute financial advice. 
                      Trading carries significant risk. Always conduct your own research and consult a qualified financial advisor.
                    </p>
                  </div>
                </div>
              </div>

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
                  AI Trade Assistant will analyze:
                </p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1 ml-6 list-disc">
                  <li>Current market structure and trend</li>
                  <li>Key support/resistance levels</li>
                  <li>Fundamental factors affecting the instrument</li>
                  <li>Specific entry, stop loss, and take profit zones</li>
                  <li>Risk management considerations</li>
                </ul>
              </div>

              <button
                onClick={onAnalyze}
                disabled={aiLoading || !aiForm.instrument}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing market data...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Get AI Analysis
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Success Message */}
              {savedSuccess && (
                <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-3 flex items-center gap-2">
                  <BookmarkCheck className="text-green-400" size={18} />
                  <span className="text-green-400 text-sm font-medium">Analysis saved for later reference!</span>
                </div>
              )}

              {/* Demo Mode Warning */}
              {aiAnalysis.marketContext?.includes('DEMO MODE') && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-yellow-400" size={18} />
                    <span className="text-yellow-400 font-semibold text-sm">Demo Mode Active</span>
                  </div>
                  <p className="text-yellow-200/70 text-xs mt-1">
                    AI APIs are unavailable. Showing generated analysis for educational purposes only.
                  </p>
                </div>
              )}
              
              {/* Structured Analysis Output */}
              <div className="grid md:grid-cols-2 gap-4">
                {aiAnalysis.marketContext && (
                  <div className="md:col-span-2 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp size={18} />
                      Market Context
                    </h3>
                    <div className="text-gray-300 text-sm space-y-2">
                      {formatStructuredText(aiAnalysis.marketContext)}
                    </div>
                  </div>
                )}

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-3">Fundamental Bias</h3>
                  <div className="text-gray-300 text-sm space-y-2">
                    {formatStructuredText(aiAnalysis.fundamentalBias)}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-cyan-400 font-semibold mb-3">Technical Bias</h3>
                  <div className="text-gray-300 text-sm space-y-2">
                    {formatStructuredText(aiAnalysis.technicalBias)}
                  </div>
                </div>
              </div>

              {/* Trade Levels */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 text-xs mb-1 uppercase tracking-wide">Entry Zone</p>
                  <p className="text-white font-bold text-lg">{aiAnalysis.entryZone}</p>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 text-xs mb-1 uppercase tracking-wide">Stop Loss</p>
                  <p className="text-white font-bold text-lg">{aiAnalysis.stopLoss}</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-center">
                  <p className="text-blue-400 text-xs mb-1 uppercase tracking-wide">Take Profit</p>
                  <p className="text-white font-bold text-lg">{aiAnalysis.takeProfit}</p>
                </div>
              </div>

              {/* The Plan */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-orange-400 font-semibold mb-3">The Plan</h3>
                <div className="text-gray-300 text-sm space-y-2">
                  {formatStructuredText(aiAnalysis.plan)}
                </div>
              </div>

              {/* Risk Warning with Legal */}
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <h3 className="text-red-400 font-semibold mb-2">Risk Warning & Legal Disclaimer</h3>
                    <div className="text-gray-300 text-sm space-y-2">
                      {formatStructuredText(aiAnalysis.riskWarning)}
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-700/30">
                      <p className="text-red-300/80 text-xs italic">
                        This analysis is generated by AI for educational purposes only and does not constitute financial advice. 
                        Always verify with your own research. Trading involves substantial risk of loss. 
                        Past performance does not guarantee future results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <button
                  onClick={() => {
                    setAiAnalysis(null);
                    setAiForm({ instrument: '', tradeType: 'Intraday' });
                  }}
                  className="py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  New Analysis
                </button>
                <button
                  onClick={onSaveForLater}
                  className="flex items-center justify-center gap-2 py-2.5 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors"
                >
                  <Bookmark size={18} />
                  Save for Later
                </button>
                <button
                  onClick={onLogTrade}
                  className="flex items-center justify-center gap-2 py-2.5 bg-orange-600/20 border border-orange-500/30 text-orange-300 rounded-lg hover:bg-orange-600/30 transition-colors"
                >
                  <FileText size={18} />
                  Log Trade
                </button>
                <button
                  onClick={() => setShowSavedAnalyses(true)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <BookmarkCheck size={18} />
                  Saved ({savedAnalyses.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
