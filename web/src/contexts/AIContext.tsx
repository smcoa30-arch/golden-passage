import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAIAnalysis, type AIAnalysis } from '../services/aiApi';

interface SavedAnalysis {
  id: string;
  instrument: string;
  tradeType: string;
  analysis: AIAnalysis;
  createdAt: string;
}

interface AIContextType {
  isOpen: boolean;
  openAIAssistant: () => void;
  closeAIAssistant: () => void;
  aiAnalysis: AIAnalysis | null;
  setAiAnalysis: (analysis: AIAnalysis | null) => void;
  aiLoading: boolean;
  handleAIAnalysis: (instrument: string, tradeType: string) => Promise<void>;
  savedAnalyses: SavedAnalysis[];
  saveAnalysis: (instrument: string, tradeType: string, analysis: AIAnalysis) => void;
  deleteSavedAnalysis: (id: string) => void;
  loadSavedAnalysis: (id: string) => void;
  showSavedAnalyses: boolean;
  setShowSavedAnalyses: (show: boolean) => void;
  prefillTradeData: {
    pair: string;
    entry: string;
    exit: string;
    notes: string;
  } | null;
  setPrefillTradeData: (data: any) => void;
  shouldOpenTradeLog: boolean;
  setShouldOpenTradeLog: (should: boolean) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const SAVED_ANALYSES_KEY = 'ai_saved_analyses_v1';

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [showSavedAnalyses, setShowSavedAnalyses] = useState(false);
  const [prefillTradeData, setPrefillTradeData] = useState<any>(null);
  const [shouldOpenTradeLog, setShouldOpenTradeLog] = useState(false);

  // Load saved analyses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_ANALYSES_KEY);
    if (saved) {
      try {
        setSavedAnalyses(JSON.parse(saved));
      } catch {
        console.error('Failed to load saved analyses');
      }
    }
  }, []);

  // Save to localStorage whenever savedAnalyses changes
  useEffect(() => {
    localStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  const openAIAssistant = useCallback(() => {
    setIsOpen(true);
    setAiAnalysis(null);
    setShowSavedAnalyses(false);
  }, []);

  const closeAIAssistant = useCallback(() => {
    setIsOpen(false);
    setAiAnalysis(null);
    setAiLoading(false);
    setShowSavedAnalyses(false);
  }, []);

  const handleAIAnalysis = useCallback(async (instrument: string, tradeType: string) => {
    setAiLoading(true);
    try {
      const analysis = await getAIAnalysis(instrument, tradeType);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setAiLoading(false);
    }
  }, []);

  const saveAnalysis = useCallback((instrument: string, tradeType: string, analysis: AIAnalysis) => {
    const newSaved: SavedAnalysis = {
      id: Date.now().toString(),
      instrument,
      tradeType,
      analysis,
      createdAt: new Date().toISOString(),
    };
    setSavedAnalyses(prev => [newSaved, ...prev]);
  }, []);

  const deleteSavedAnalysis = useCallback((id: string) => {
    setSavedAnalyses(prev => prev.filter(a => a.id !== id));
  }, []);

  const loadSavedAnalysis = useCallback((id: string) => {
    const saved = savedAnalyses.find(a => a.id === id);
    if (saved) {
      setAiAnalysis(saved.analysis);
      setShowSavedAnalyses(false);
    }
  }, [savedAnalyses]);

  return (
    <AIContext.Provider
      value={{
        isOpen,
        openAIAssistant,
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
        prefillTradeData,
        setPrefillTradeData,
        shouldOpenTradeLog,
        setShouldOpenTradeLog,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
