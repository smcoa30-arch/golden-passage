// AI API Service - Calls backend API which proxies to AI services

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AIAnalysis {
  fundamentalBias: string;
  technicalBias: string;
  plan: string;
  riskWarning: string;
  entryZone: string;
  stopLoss: string;
  takeProfit: string;
  marketContext: string;
}

// Demo mode - generates realistic analysis without APIs
function generateDemoAnalysis(instrument: string, tradeType: string, reason: string = ''): AIAnalysis {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'America/New_York' 
  });
  
  const apiKeyMessage = reason ? ` (${reason})` : '';
  
  const basePrices: { [key: string]: number } = {
    'EUR/USD': 1.0850, 'GBP/USD': 1.2650, 'USD/JPY': 148.50,
    'USD/CHF': 0.8850, 'AUD/USD': 0.6550, 'NZD/USD': 0.5950,
    'USD/CAD': 1.3650, 'EUR/GBP': 0.8570, 'GBP/JPY': 187.50,
    'EUR/JPY': 161.20, 'XAU/USD': 2035.50, 'XAG/USD': 22.85,
    'USOIL': 73.50, 'ES': 4950.00, 'NQ': 17650.00,
    'YM': 38650.00, 'HSI': 16500.00
  };
  
  const basePrice = basePrices[instrument] || 100.00;
  const pipSize = instrument.includes('JPY') ? 0.01 : 
                  instrument.includes('XAU') ? 0.1 : 
                  instrument.includes('XAG') ? 0.01 : 
                  instrument.includes('ES') || instrument.includes('NQ') || 
                  instrument.includes('YM') || instrument.includes('HSI') ? 1 : 0.0001;
  const pipValue = pipSize * 100;
  
  const entryZone = `${(basePrice - pipValue * 0.5).toFixed(4)} - ${(basePrice + pipValue * 0.5).toFixed(4)}`;
  const stopLoss = (basePrice - pipValue * 2).toFixed(4);
  const takeProfit1 = (basePrice + pipValue * 3).toFixed(4);
  const takeProfit2 = (basePrice + pipValue * 5).toFixed(4);
  
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
    fundamental: `Monitor DXY direction for USD pairs. Check forexfactory.com for today's high-impact news. Current market sentiment is mixed with no clear catalyst.`,
    technical: `Mark previous day high/low as key levels. Identify order blocks on H4 timeframe. Wait for price to reach premium/discount zones before entering.`
  };
  
  const analysis = analyses[instrument] || defaultAnalysis;
  
  return {
    marketContext: `[DEMO MODE${apiKeyMessage} - ${currentDate} ${currentTime} EST] ${analysis.context}`,
    fundamentalBias: analysis.fundamental,
    technicalBias: analysis.technical,
    plan: `1. Wait for price to reach ${tradeType === 'Intraday' ? '15m/1H' : '4H/Daily'} premium/discount zone\n2. Look for liquidity sweep of Asian session highs/lows\n3. Confirm Market Structure Shift (MSS) on LTF\n4. Enter at Fair Value Gap or Order Block\n5. Target: ${takeProfit1} (1:1.5 RR) then ${takeProfit2}`,
    riskWarning: `[DEMO MODE - AI APIs unavailable${apiKeyMessage}] To use real AI, add valid KIMI_API_KEY or GOOGLE_AI_KEY to backend/.env. Always verify analysis before trading.`,
    entryZone: entryZone,
    stopLoss: stopLoss,
    takeProfit: takeProfit1
  };
}

// Main function to get AI analysis via backend API
export async function getAIAnalysis(
  instrument: string, 
  tradeType: string
): Promise<AIAnalysis> {
  console.log('Starting AI analysis for:', instrument);
  
  try {
    const response = await fetch(`${API_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instrument,
        tradeType
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend AI API failed:', response.status, errorText);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.analysis) {
      console.error('Invalid response from backend:', data);
      throw new Error('Invalid response from backend');
    }

    console.log('AI analysis complete, source:', data.source);
    return data.analysis;
  } catch (error) {
    console.error('AI analysis error:', error);
    console.log('Falling back to demo mode...');
    return generateDemoAnalysis(instrument, tradeType, 'backend returned demo');
  }
}

export default {
  getAIAnalysis,
  generateDemoAnalysis
};
