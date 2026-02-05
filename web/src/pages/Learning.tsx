import { useState } from 'react';
import { BookOpen, Video, TrendingUp, Calculator, ChevronDown, ChevronUp, Brain, Target, BarChart3 } from 'lucide-react';

// ==================== LEARNING MODULES DATA ====================

const learningModules = [
  {
    id: 'price-action',
    title: 'Price Action Mastery',
    icon: BarChart3,
    description: 'Master the art of reading raw price movement without indicators',
    color: 'blue',
    sections: [
      {
        title: 'Market Structure Fundamentals',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/7ORPM7x30vE',
        content: `
## Higher Highs, Higher Lows, Lower Highs, Lower Lows

Understanding market structure is the foundation of price action trading.

### Bullish Structure (HH, HL)
- **Higher High (HH)**: Price creates a new peak above the previous high
- **Higher Low (HL)**: Price retraces but holds above the previous low
- **Significance**: Indicates buying pressure and uptrend continuation

### Bearish Structure (LH, LL)
- **Lower High (LH)**: Price fails to break above the previous high
- **Lower Low (LL)**: Price breaks below the previous low
- **Significance**: Indicates selling pressure and downtrend continuation

### The "Flip Zone" Concept
The flip zone is where previous resistance becomes support (or vice versa). This is your highest-probability entry area.
        `,
        strategy: {
          name: 'Structure Break & Retest',
          winRate: '68%',
          rr: '1:2.5',
          rules: [
            'Identify clear HH/HL or LH/LL structure on H4/H1',
            'Wait for break of structure (BOS)',
            'Mark the flip zone (previous high/low)',
            'Enter on retest of flip zone with rejection candle',
            'Stop loss: 10-15 pips beyond structure',
            'Take profit: Next major structure level'
          ]
        }
      },
      {
        title: 'Candlestick Psychology',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/sZJ5pTk0QcU',
        content: `
## Reading the Story of Price

Every candlestick tells a story about buyer and seller psychology.

### High-Probability Patterns

**Pin Bar (Reversal Signal)**
- Long wick rejecting a key level
- Small body at one extreme
- Indicates strong rejection and potential reversal

**Engulfing Patterns**
- Bullish: Green candle completely engulfs previous red candle
- Bearish: Red candle completely engulfs previous green candle
- Shows momentum shift

**Inside Bar**
- Candle completely inside the range of previous candle
- Indicates consolidation before explosive move
- Best traded at key support/resistance

### The Narrative Approach
Don't just see candles—read the battle:
- Who's in control? (wick direction, body size)
- Where did price get rejected? (wick tips)
- Is momentum building or fading? (candle progression)
        `,
        strategy: {
          name: 'Pin Bar Reversal',
          winRate: '72%',
          rr: '1:3',
          rules: [
            'Identify key support/resistance or flip zone',
            'Wait for pin bar with 2x+ wick vs body',
            'Wick must reject the key level',
            'Enter at close of pin bar or 50% retracement',
            'Stop loss: Beyond the wick tip',
            'Take profit: 2-3x risk or next S/R level'
          ]
        }
      },
      {
        title: 'Premium vs Discount Concepts',
        type: 'article',
        content: `
## Institutional Order Flow

Institutions don't chase price—they buy at discount and sell at premium.

### Fibonacci Premium/Discount Zones
- **Premium Zone (60-100%)**: Institutional selling area
- **Equilibrium (40-60%)**: Avoid—chop zone
- **Discount Zone (0-40%)**: Institutional buying area

### Premium/Discount within Structure
In an uptrend:
- **Premium**: Near the highs (sell zone)
- **Discount**: Near the flip zone (buy zone)

In a downtrend:
- **Premium**: Near the flip zone (sell zone)
- **Discount**: Near the lows (buy zone)

### Practical Application
1. Mark your structure (HH/HL or LH/LL)
2. Identify premium and discount zones
3. Only buy in discount, only sell in premium
4. This filters out 60% of losing trades
        `,
        strategy: {
          name: 'Premium/Discount Entries',
          winRate: '65%',
          rr: '1:2',
          rules: [
            'Mark swing high and low',
            'Draw Fibonacci retracement',
            'Only look for longs in 0-40% zone',
            'Only look for shorts in 60-100% zone',
            'Wait for price action confirmation',
            'Risk: Reward minimum 1:2'
          ]
        }
      }
    ]
  },
  {
    id: 'smc',
    title: 'Smart Money Concepts (SMC)',
    icon: Brain,
    description: 'Trade like institutions with order blocks and liquidity concepts',
    color: 'purple',
    sections: [
      {
        title: 'Order Blocks & Mitigation',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/9o-NSA8F5w4',
        content: `
## The Building Blocks of Institutional Order Flow

Order Blocks are the last opposing candle before a strong move—where institutions positioned.

### Identifying Valid Order Blocks

**Bullish Order Block**
- Last bearish candle before aggressive bullish move
- Creates the "origin" of an uptrend
- Becomes support for future retracements

**Bearish Order Block**
- Last bullish candle before aggressive bearish move
- Creates the "origin" of a downtrend
- Becomes resistance for future retracements

### Mitigation Concept
Mitigation means price returning to an order block to "fill" remaining orders.
- Price moves away from OB → creates FVG
- Price returns to OB → mitigation
- Entry trigger: Rejection from OB with LTF confirmation

### Unmitigated vs Mitigated
- **Unmitigated**: Price hasn't returned—high probability future target
- **Mitigated**: Price has returned—OB is "used up"
        `,
        strategy: {
          name: 'OB Mitigation Entry',
          winRate: '71%',
          rr: '1:2.8',
          rules: [
            'Mark H4/H1 Order Blocks',
            'Identify unmitigated OBs (targets)',
            'Wait for price to mitigate a fresh OB',
            'Entry: 1m-5m confirmation at OB zone',
            'Stop: Beyond the OB extreme',
            'Target: Next unmitigated OB'
          ]
        }
      },
      {
        title: 'Break of Structure (BOS) vs Change of Character (CHoCH)',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/3gY6-Dq3bG0',
        content: `
## Reading Institutional Intent

### Break of Structure (BOS)
Continuation signal—confirms trend is continuing.
- **Bullish BOS**: Price breaks above previous high in uptrend
- **Bearish BOS**: Price breaks below previous low in downtrend

### Change of Character (CHoCH)
Reversal signal—indicates potential trend change.
- **Bullish CHoCH**: Price breaks above previous high in downtrend
- **Bearish CHoCH**: Price breaks below previous low in uptrend

### The Significance
- **BOS**: Add to positions, trail stops
- **CHoCH**: Close opposing positions, look for reversal entries

### Volume and Speed Matter
- Aggressive break = institutional participation
- Slow, grinding break = weak, likely to fail
        `,
        strategy: {
          name: 'CHoCH Reversal',
          winRate: '66%',
          rr: '1:3.2',
          rules: [
            'Wait for clear CHoCH on H1',
            'Mark the inducing liquidity level',
            'Wait for retest of CHoCH level',
            'Entry: LTF confirmation at retest',
            'Stop: Beyond the sweep extreme',
            'Target: Previous major structure'
          ]
        }
      },
      {
        title: 'Liquidity Sweeps & Inducement',
        type: 'article',
        content: `
## Understanding Stop Hunts

Institutions need liquidity to fill large orders—they sweep retail stops.

### Types of Liquidity

**Buy Side Liquidity (BSL)**
- Equal highs, swing highs, previous day high
- Where retail traders place stop losses for shorts
- Institutions buy these stops to fill sell orders

**Sell Side Liquidity (SSL)**
- Equal lows, swing lows, previous day low
- Where retail traders place stop losses for longs
- Institutions sell these stops to fill buy orders

### The Inducement Pattern
1. Price approaches liquidity level
2. Retail traders pile in (retail follows retail)
3. Institutions sweep the liquidity (stop hunt)
4. Price reverses sharply with momentum

### Trading Liquidity Sweeps
1. Mark obvious liquidity levels (equal highs/lows)
2. Wait for sweep with momentum candle
3. Enter on confirmation (engulfing, pin bar)
4. Target the opposite liquidity pool
        `,
        strategy: {
          name: 'Liquidity Sweep Reversal',
          winRate: '74%',
          rr: '1:2.5',
          rules: [
            'Mark equal highs/lows (liquidity)',
            'Wait for sweep of liquidity',
            'Look for momentum divergence on LTF',
            'Entry: Reversal candle after sweep',
            'Stop: 10-15 pips beyond sweep',
            'Target: Next major liquidity pool'
          ]
        }
      }
    ]
  },
  {
    id: 'ict',
    title: 'ICT (Inner Circle Trader)',
    icon: Target,
    description: 'Master time-based concepts and institutional trading windows',
    color: 'gold',
    sections: [
      {
        title: 'Fair Value Gaps (FVG)',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/6Cp8jyvb0y8',
        content: `
## The Imbalance Edge

FVGs are price inefficiencies created by aggressive institutional moves.

### Identifying FVGs

**Bullish FVG**
- Current candle low > Previous candle high
- Gap between candles = bullish imbalance
- Institutions aggressively bought—expect return to fill

**Bearish FVG**
- Current candle high < Previous candle high
- Gap between candles = bearish imbalance
- Institutions aggressively sold—expect return to fill

### FVG as Entry Tool
1. Price creates FVG on LTF (1m-5m)
2. FVG aligns with HTF structure (15m-1H)
3. Price returns to fill FVG
4. Enter at 50% of FVG with LTF confirmation

### FVG Confluence
Best entries when FVG aligns with:
- Order Block
- Breaker Block
- Optimal Trade Entry (OTE) level
        `,
        strategy: {
          name: 'FVG Entry Model',
          winRate: '69%',
          rr: '1:3',
          rules: [
            'Identify HTF bias (H1/H4)',
            'Wait for LTF FVG in HTF direction',
            'Mark 50% fill level of FVG',
            'Entry: Price touches 50% with rejection',
            'Stop: Beyond FVG extreme',
            'Target: Next HTF structure level'
          ]
        }
      },
      {
        title: 'Silver Bullet Time Windows',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/6Cp8jyvb0y8',
        content: `
## The 1-Hour High-Probability Windows

ICT discovered specific times when algorithms execute orders.

### Daily Silver Bullets (EST)

**AM Session: 10:00 AM - 11:00 AM**
- Post-London open volatility
- NY session establishing direction
- High-volume institutional activity

**PM Session: 2:00 PM - 3:00 PM**
- Pre-close positioning
- Afternoon algorithmic sweep
- Often reverses morning move

### The Model (2022)
1. Mark previous day's high/low (liquidity)
2. Wait for sweep of one side during silver bullet
3. Look for Market Structure Shift (MSS)
4. Enter at FVG or breaker block
5. Target opposite liquidity pool

### Why It Works
- Algorithms execute during these windows
- Higher probability of institutional participation
- Liquidity is actively hunted
        `,
        strategy: {
          name: 'Silver Bullet Entry',
          winRate: '76%',
          rr: '1:2.5',
          rules: [
            'Trade ONLY during 10-11 AM or 2-3 PM EST',
            'Mark PDH/PDL (previous day high/low)',
            'Wait for sweep of one side',
            'Confirm Market Structure Shift (MSS)',
            'Entry: FVG or Breaker Block',
            'Target: Opposite PDH/PDL'
          ]
        }
      },
      {
        title: 'Power of 3: Accumulation, Manipulation, Distribution',
        type: 'article',
        content: `
## The Institutional Cycle

All markets follow this 3-phase cycle—understand it to avoid being manipulated.

### Phase 1: Accumulation
- Institutions building positions
- Price chops in a range
- Low volatility, "boring" price action
- Retail traders get frustrated and exit

### Phase 2: Manipulation
- Stop hunt in opposite direction
- Sweeps liquidity
- Creates false breakout
- Retail traders chase and get trapped

### Phase 3: Distribution
- True move in intended direction
- High momentum
- Institutions distributing to retail
- Trend develops

### Trading the Power of 3
1. Identify accumulation range (Asia session often)
2. Anticipate manipulation (sweep)
3. Enter on distribution (true move)
4. Never trade during accumulation—wait for sweep
        `,
        strategy: {
          name: 'Power of 3 Setup',
          winRate: '68%',
          rr: '1:3.5',
          rules: [
            'Identify Asia range consolidation',
            'Mark Asia high and low (liquidity)',
            'Wait for sweep of one side',
            'Look for MSS back into range',
            'Entry: OB or FVG after sweep',
            'Target: 2-3x risk or opposite range extreme'
          ]
        }
      },
      {
        title: 'ICT 2022 Mentorship Model',
        type: 'article',
        content: `
## The Complete ICT Entry Framework

### Pre-Trade Analysis
1. **Mark Key Levels**
   - Previous day high/low
   - Previous week high/low
   - Asian range high/low

2. **Identify Bias**
   - HTF structure (H4/Daily)
   - Current in premium or discount?
   - Where is the draw?

### The Entry Checklist
1. ✓ Liquidity sweep (inducement)
2. ✓ Market Structure Shift (confirmation)
3. ✓ Fair Value Gap or Order Block (entry)
4. ✓ Alignment with HTF bias
5. ✓ Risk:Reward minimum 1:2

### Time-Based Execution
- **Killzones**: High probability windows
- **Midnight Open**: Often sets the day's tone
- **New York Open**: Most volatile—best for entries

### Risk Management
- Never risk more than 1-2% per trade
- Maximum 3 trades per day
- Stop trading after 2 consecutive losses
        `,
        strategy: {
          name: 'Full ICT Model',
          winRate: '73%',
          rr: '1:3',
          rules: [
            'Mark PDH/PDL, PWH/PWL, Asia range',
            'Determine HTF bias (H4/Daily)',
            'Wait for sweep of liquidity',
            'Confirm MSS (Market Structure Shift)',
            'Entry: FVG or OB after MSS',
            'Stop: Beyond sweep extreme',
            'Target: Next major liquidity pool',
            'Only trade during killzones'
          ]
        }
      }
    ]
  }
];

// ==================== CALCULATORS ====================

const CalculatorModal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>
      {children}
    </div>
  </div>
);

export function Learning() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // Calculators state
  const [posSize, setPosSize] = useState({ account: '10000', risk: '1', stop: '20' });
  const [rrCalc, setRrCalc] = useState({ entry: '1.08500', sl: '1.08300', tp: '1.09000' });

  const calculatePositionSize = () => {
    const riskAmount = parseFloat(posSize.account) * (parseFloat(posSize.risk) / 100);
    return (riskAmount / parseFloat(posSize.stop)).toFixed(2);
  };

  const calculateRR = () => {
    const risk = Math.abs(parseFloat(rrCalc.entry) - parseFloat(rrCalc.sl));
    const reward = Math.abs(parseFloat(rrCalc.tp) - parseFloat(rrCalc.entry));
    return (reward / risk).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Trading Mastery Center</h1>
        <p className="text-gray-400">Professional-grade curriculum: Price Action • Smart Money Concepts • ICT</p>
      </div>

      {/* Module Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {learningModules.map((module) => {
          const Icon = module.icon;
          const colorClasses = {
            blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
            purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
            gold: 'from-yellow-600/20 to-yellow-900/20 border-yellow-500/30',
          }[module.color];

          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
              className={`relative overflow-hidden rounded-xl border p-6 text-left transition-all hover:scale-[1.02] ${
                activeModule === module.id 
                  ? 'bg-gradient-to-br ' + colorClasses + ' ring-2 ring-white/20' 
                  : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                module.color === 'blue' ? 'bg-blue-600' :
                module.color === 'purple' ? 'bg-purple-600' : 'bg-yellow-600'
              }`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
              <p className="text-gray-400 text-sm">{module.description}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>{module.sections.length} sections</span>
                {activeModule === module.id && <ChevronUp className="ml-auto" size={20} />}
                {activeModule !== module.id && <ChevronDown className="ml-auto" size={20} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Module Content */}
      {activeModule && (
        <div className="mb-8 bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          {learningModules
            .filter(m => m.id === activeModule)
            .map(module => (
              <div key={module.id}>
                <h2 className="text-2xl font-bold text-white mb-6">{module.title} Curriculum</h2>
                <div className="space-y-4">
                  {module.sections.map((section, idx) => (
                    <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setActiveSection(activeSection === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {section.type === 'video' ? <Video size={20} className="text-red-500" /> : <BookOpen size={20} className="text-blue-500" />}
                          <span className="font-semibold text-white">{section.title}</span>
                        </div>
                        {activeSection === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                      </button>
                      
                      {activeSection === idx && (
                        <div className="p-4 border-t border-gray-700">
                          {/* Video */}
                          {section.type === 'video' && (
                            <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-black">
                              <iframe
                                src={section.videoUrl}
                                title={section.title}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="prose prose-invert max-w-none mb-6">
                            <div className="text-gray-300 whitespace-pre-line">{section.content}</div>
                          </div>

                          {/* Strategy Guide */}
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                              <Target size={20} className="text-orange-500" />
                              Strategy Guide: {section.strategy.name}
                            </h4>
                            <div className="flex gap-4 mb-3 text-sm">
                              <span className="text-green-400">Win Rate: {section.strategy.winRate}</span>
                              <span className="text-blue-400">R:R: {section.strategy.rr}</span>
                            </div>
                            <ul className="space-y-2">
                              {section.strategy.rules.map((rule, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                  <span className="text-orange-500 mt-0.5">{i + 1}.</span>
                                  {rule}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Tools Section */}
      <div className="grid md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveCalculator('position')}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-800 transition-colors"
        >
          <Calculator className="text-orange-500 mb-2" size={24} />
          <h4 className="font-semibold text-white">Position Size</h4>
          <p className="text-gray-400 text-sm">Calculate lot size based on risk %</p>
        </button>
        <button
          onClick={() => setActiveCalculator('rr')}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-800 transition-colors"
        >
          <TrendingUp className="text-green-500 mb-2" size={24} />
          <h4 className="font-semibold text-white">Risk/Reward</h4>
          <p className="text-gray-400 text-sm">Calculate R:R ratio</p>
        </button>
        <button
          onClick={() => setActiveCalculator('pip')}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-800 transition-colors"
        >
          <Target className="text-blue-500 mb-2" size={24} />
          <h4 className="font-semibold text-white">Pip Value</h4>
          <p className="text-gray-400 text-sm">$ per pip calculator</p>
        </button>
        <button
          onClick={() => setActiveCalculator('compound')}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-800 transition-colors"
        >
          <BarChart3 className="text-purple-500 mb-2" size={24} />
          <h4 className="font-semibold text-white">Compounding</h4>
          <p className="text-gray-400 text-sm">Project account growth</p>
        </button>
      </div>

      {/* Calculator Modals */}
      {activeCalculator === 'position' && (
        <CalculatorModal title="Position Size Calculator" onClose={() => setActiveCalculator(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Account Size ($)</label>
              <input type="number" value={posSize.account} onChange={e => setPosSize({...posSize, account: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Risk %</label>
              <input type="number" value={posSize.risk} onChange={e => setPosSize({...posSize, risk: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Stop Loss (pips)</label>
              <input type="number" value={posSize.stop} onChange={e => setPosSize({...posSize, stop: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Position Size</p>
              <p className="text-2xl font-bold text-orange-500">{calculatePositionSize()} lots</p>
              <p className="text-gray-500 text-sm">Risk: ${(parseFloat(posSize.account) * parseFloat(posSize.risk) / 100).toFixed(2)}</p>
            </div>
          </div>
        </CalculatorModal>
      )}

      {activeCalculator === 'rr' && (
        <CalculatorModal title="Risk/Reward Calculator" onClose={() => setActiveCalculator(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Entry Price</label>
              <input type="number" step="0.00001" value={rrCalc.entry} onChange={e => setRrCalc({...rrCalc, entry: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Stop Loss</label>
              <input type="number" step="0.00001" value={rrCalc.sl} onChange={e => setRrCalc({...rrCalc, sl: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Take Profit</label>
              <input type="number" step="0.00001" value={rrCalc.tp} onChange={e => setRrCalc({...rrCalc, tp: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Risk/Reward Ratio</p>
              <p className="text-2xl font-bold text-green-500">1:{calculateRR()}</p>
            </div>
          </div>
        </CalculatorModal>
      )}

      {activeCalculator === 'pip' && (
        <CalculatorModal title="Pip Value Calculator" onClose={() => setActiveCalculator(null)}>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Standard lot (1.0) = $10 per pip for most pairs</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">0.01 lot</p>
                <p className="text-xl font-bold text-white">$0.10/pip</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">0.1 lot</p>
                <p className="text-xl font-bold text-white">$1.00/pip</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">0.5 lot</p>
                <p className="text-xl font-bold text-white">$5.00/pip</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">1.0 lot</p>
                <p className="text-xl font-bold text-white">$10.00/pip</p>
              </div>
            </div>
          </div>
        </CalculatorModal>
      )}

      {activeCalculator === 'compound' && (
        <CalculatorModal title="Compounding Calculator" onClose={() => setActiveCalculator(null)}>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-gray-400">Starting: $10,000</p>
            <p className="text-gray-400">Monthly Return: 5%</p>
            <p className="text-gray-400">After 12 months:</p>
            <p className="text-3xl font-bold text-purple-500 mt-2">$17,958</p>
            <p className="text-green-400">+$7,958 profit</p>
          </div>
        </CalculatorModal>
      )}
    </div>
  );
}
