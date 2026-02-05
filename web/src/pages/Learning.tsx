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
        videoUrl: 'https://www.youtube.com/embed/JzrO5wU9nG8',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">Higher Highs, Higher Lows, Lower Highs, Lower Lows</h3>
            <p className="mb-3">Understanding market structure is the foundation of price action trading.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Bullish Structure (HH, HL)</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Higher High (HH)</strong>: Price creates a new peak above the previous high</li>
              <li className="ml-4"><strong className="text-white">Higher Low (HL)</strong>: Price retraces but holds above the previous low</li>
              <li className="ml-4"><strong className="text-white">Significance</strong>: Indicates buying pressure and uptrend continuation</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Bearish Structure (LH, LL)</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Lower High (LH)</strong>: Price fails to break above the previous high</li>
              <li className="ml-4"><strong className="text-white">Lower Low (LL)</strong>: Price breaks below the previous low</li>
              <li className="ml-4"><strong className="text-white">Significance</strong>: Indicates selling pressure and downtrend continuation</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">The &quot;Flip Zone&quot; Concept</h4>
            <p className="mb-3">The flip zone is where previous resistance becomes support (or vice versa). This is your highest-probability entry area.</p>
          </>
        ),
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
        videoUrl: 'https://www.youtube.com/embed/FhGRr2Gt0uw',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">Reading the Story of Price</h3>
            <p className="mb-3">Every candlestick tells a story about buyer and seller psychology.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">High-Probability Patterns</h4>
            <p className="mb-3"><strong className="text-white">Pin Bar (Reversal Signal)</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Long wick rejecting a key level</li>
              <li className="ml-4">Small body at one extreme</li>
              <li className="ml-4">Indicates strong rejection and potential reversal</li>
            </ul>
            <p className="mb-3"><strong className="text-white">Engulfing Patterns</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Bullish: Green candle completely engulfs previous red candle</li>
              <li className="ml-4">Bearish: Red candle completely engulfs previous green candle</li>
              <li className="ml-4">Shows momentum shift</li>
            </ul>
            <p className="mb-3"><strong className="text-white">Inside Bar</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Candle completely inside the range of previous candle</li>
              <li className="ml-4">Indicates consolidation before explosive move</li>
              <li className="ml-4">Best traded at key support/resistance</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">The Narrative Approach</h4>
            <p className="mb-3">Don&apos;t just see candles—read the battle:</p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Who&apos;s in control? (wick direction, body size)</li>
              <li className="ml-4">Where did price get rejected? (wick tips)</li>
              <li className="ml-4">Is momentum building or fading? (candle progression)</li>
            </ul>
          </>
        ),
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
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/UWrvexqN3w8',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">Institutional Order Flow</h3>
            <p className="mb-3">Institutions don&apos;t chase price—they buy at discount and sell at premium.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Fibonacci Premium/Discount Zones</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Premium Zone (60-100%)</strong>: Institutional selling area</li>
              <li className="ml-4"><strong className="text-white">Equilibrium (40-60%)</strong>: Avoid—chop zone</li>
              <li className="ml-4"><strong className="text-white">Discount Zone (0-40%)</strong>: Institutional buying area</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Premium/Discount within Structure</h4>
            <p className="mb-3">In an uptrend:</p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Premium</strong>: Near the highs (sell zone)</li>
              <li className="ml-4"><strong className="text-white">Discount</strong>: Near the flip zone (buy zone)</li>
            </ul>
            <p className="mb-3">In a downtrend:</p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Premium</strong>: Near the flip zone (sell zone)</li>
              <li className="ml-4"><strong className="text-white">Discount</strong>: Near the lows (buy zone)</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Practical Application</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">1. Mark your structure (HH/HL or LH/LL)</li>
              <li className="ml-4">2. Identify premium and discount zones</li>
              <li className="ml-4">3. Only buy in discount, only sell in premium</li>
              <li className="ml-4">4. This filters out 60% of losing trades</li>
            </ul>
          </>
        ),
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
        videoUrl: 'https://www.youtube.com/embed/4Tuk0Yztz3s',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">The Building Blocks of Institutional Order Flow</h3>
            <p className="mb-3">Order Blocks are the last opposing candle before a strong move—where institutions positioned.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Identifying Valid Order Blocks</h4>
            <p className="mb-3"><strong className="text-white">Bullish Order Block</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Last bearish candle before aggressive bullish move</li>
              <li className="ml-4">Creates the &quot;origin&quot; of an uptrend</li>
              <li className="ml-4">Becomes support for future retracements</li>
            </ul>
            <p className="mb-3"><strong className="text-white">Bearish Order Block</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Last bullish candle before aggressive bearish move</li>
              <li className="ml-4">Creates the &quot;origin&quot; of a downtrend</li>
              <li className="ml-4">Becomes resistance for future retracements</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Mitigation Concept</h4>
            <p className="mb-3">Mitigation means price returning to an order block to &quot;fill&quot; remaining orders.</p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Price moves away from OB → creates FVG</li>
              <li className="ml-4">Price returns to OB → mitigation</li>
              <li className="ml-4">Entry trigger: Rejection from OB with LTF confirmation</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Unmitigated vs Mitigated</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Unmitigated</strong>: Price hasn&apos;t returned—high probability future target</li>
              <li className="ml-4"><strong className="text-white">Mitigated</strong>: Price has returned—OB is &quot;used up&quot;</li>
            </ul>
          </>
        ),
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
        videoUrl: 'https://www.youtube.com/embed/FE1bgD9N6DM',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">Reading Institutional Intent</h3>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Break of Structure (BOS)</h4>
            <p className="mb-3">Continuation signal—confirms trend is continuing.</p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Bullish BOS</strong>: Price breaks above previous high in uptrend</li>
              <li className="ml-4"><strong className="text-white">Bearish BOS</strong>: Price breaks below previous low in downtrend</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Change of Character (CHoCH)</h4>
            <p className="mb-3">Reversal signal—indicates potential trend change.</p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Bullish CHoCH</strong>: Price breaks above previous high in downtrend</li>
              <li className="ml-4"><strong className="text-white">Bearish CHoCH</strong>: Price breaks below previous low in uptrend</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">The Significance</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">BOS</strong>: Add to positions, trail stops</li>
              <li className="ml-4"><strong className="text-white">CHoCH</strong>: Close opposing positions, look for reversal entries</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Volume and Speed Matter</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Aggressive break = institutional participation</li>
              <li className="ml-4">Slow, grinding break = weak, likely to fail</li>
            </ul>
          </>
        ),
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
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/6oTABCDoSVc',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">Understanding Stop Hunts</h3>
            <p className="mb-3">Institutions need liquidity to fill large orders—they sweep retail stops.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Types of Liquidity</h4>
            <p className="mb-3"><strong className="text-white">Buy Side Liquidity (BSL)</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Equal highs, swing highs, previous day high</li>
              <li className="ml-4">Where retail traders place stop losses for shorts</li>
              <li className="ml-4">Institutions buy these stops to fill sell orders</li>
            </ul>
            <p className="mb-3"><strong className="text-white">Sell Side Liquidity (SSL)</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Equal lows, swing lows, previous day low</li>
              <li className="ml-4">Where retail traders place stop losses for longs</li>
              <li className="ml-4">Institutions sell these stops to fill buy orders</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">The Inducement Pattern</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">1. Price approaches liquidity level</li>
              <li className="ml-4">2. Retail traders pile in (retail follows retail)</li>
              <li className="ml-4">3. Institutions sweep the liquidity (stop hunt)</li>
              <li className="ml-4">4. Price reverses sharply with momentum</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Trading Liquidity Sweeps</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">1. Mark obvious liquidity levels (equal highs/lows)</li>
              <li className="ml-4">2. Wait for sweep with momentum candle</li>
              <li className="ml-4">3. Enter on confirmation (engulfing, pin bar)</li>
              <li className="ml-4">4. Target the opposite liquidity pool</li>
            </ul>
          </>
        ),
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
        videoUrl: 'https://www.youtube.com/embed/ahpjvyO6-lE',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">The Imbalance Edge</h3>
            <p className="mb-3">FVGs are price inefficiencies created by aggressive institutional moves.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Identifying FVGs</h4>
            <p className="mb-3"><strong className="text-white">Bullish FVG</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Current candle low &gt; Previous candle high</li>
              <li className="ml-4">Gap between candles = bullish imbalance</li>
              <li className="ml-4">Institutions aggressively bought—expect return to fill</li>
            </ul>
            <p className="mb-3"><strong className="text-white">Bearish FVG</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Current candle high &lt; Previous candle high</li>
              <li className="ml-4">Gap between candles = bearish imbalance</li>
              <li className="ml-4">Institutions aggressively sold—expect return to fill</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">FVG as Entry Tool</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">1. Price creates FVG on LTF (1m-5m)</li>
              <li className="ml-4">2. FVG aligns with HTF structure (15m-1H)</li>
              <li className="ml-4">3. Price returns to fill FVG</li>
              <li className="ml-4">4. Enter at 50% of FVG with LTF confirmation</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">FVG Confluence</h4>
            <p className="mb-3">Best entries when FVG aligns with:</p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Order Block</li>
              <li className="ml-4">Breaker Block</li>
              <li className="ml-4">Optimal Trade Entry (OTE) level</li>
            </ul>
          </>
        ),
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
        videoUrl: 'https://www.youtube.com/embed/0LvtR007Plc',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">The 1-Hour High-Probability Windows</h3>
            <p className="mb-3">ICT discovered specific times when algorithms execute orders.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Daily Silver Bullets (EST)</h4>
            <p className="mb-3"><strong className="text-white">AM Session: 10:00 AM - 11:00 AM</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Post-London open volatility</li>
              <li className="ml-4">NY session establishing direction</li>
              <li className="ml-4">High-volume institutional activity</li>
            </ul>
            <p className="mb-3"><strong className="text-white">PM Session: 2:00 PM - 3:00 PM</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Pre-close positioning</li>
              <li className="ml-4">Afternoon algorithmic sweep</li>
              <li className="ml-4">Often reverses morning move</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">The Model (2022)</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">1. Mark previous day&apos;s high/low (liquidity)</li>
              <li className="ml-4">2. Wait for sweep of one side during silver bullet</li>
              <li className="ml-4">3. Look for Market Structure Shift (MSS)</li>
              <li className="ml-4">4. Enter at FVG or breaker block</li>
              <li className="ml-4">5. Target opposite liquidity pool</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Why It Works</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Algorithms execute during these windows</li>
              <li className="ml-4">Higher probability of institutional participation</li>
              <li className="ml-4">Liquidity is actively hunted</li>
            </ul>
          </>
        ),
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
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/Oe8IOKO9jAg',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">The Institutional Cycle</h3>
            <p className="mb-3">All markets follow this 3-phase cycle—understand it to avoid being manipulated.</p>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Phase 1: Accumulation</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Institutions building positions</li>
              <li className="ml-4">Price chops in a range</li>
              <li className="ml-4">Low volatility, &quot;boring&quot; price action</li>
              <li className="ml-4">Retail traders get frustrated and exit</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Phase 2: Manipulation</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Stop hunt in opposite direction</li>
              <li className="ml-4">Sweeps liquidity</li>
              <li className="ml-4">Creates false breakout</li>
              <li className="ml-4">Retail traders chase and get trapped</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Phase 3: Distribution</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">True move in intended direction</li>
              <li className="ml-4">High momentum</li>
              <li className="ml-4">Institutions distributing to retail</li>
              <li className="ml-4">Trend develops</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Trading the Power of 3</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">1. Identify accumulation range (Asia session often)</li>
              <li className="ml-4">2. Anticipate manipulation (sweep)</li>
              <li className="ml-4">3. Enter on distribution (true move)</li>
              <li className="ml-4">4. Never trade during accumulation—wait for sweep</li>
            </ul>
          </>
        ),
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
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/h8ZFeBWxhgY',
        content: (
          <>
            <h3 className="text-xl font-bold text-white mb-3">The Complete ICT Entry Framework</h3>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Pre-Trade Analysis</h4>
            <p className="mb-3"><strong className="text-white">1. Mark Key Levels</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Previous day high/low</li>
              <li className="ml-4">Previous week high/low</li>
              <li className="ml-4">Asian range high/low</li>
            </ul>
            <p className="mb-3"><strong className="text-white">2. Identify Bias</strong></p>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">HTF structure (H4/Daily)</li>
              <li className="ml-4">Current in premium or discount?</li>
              <li className="ml-4">Where is the draw?</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">The Entry Checklist</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">1. ✓ Liquidity sweep (inducement)</li>
              <li className="ml-4">2. ✓ Market Structure Shift (confirmation)</li>
              <li className="ml-4">3. ✓ Fair Value Gap or Order Block (entry)</li>
              <li className="ml-4">4. ✓ Alignment with HTF bias</li>
              <li className="ml-4">5. ✓ Risk:Reward minimum 1:2</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Time-Based Execution</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4"><strong className="text-white">Killzones</strong>: High probability windows</li>
              <li className="ml-4"><strong className="text-white">Midnight Open</strong>: Often sets the day&apos;s tone</li>
              <li className="ml-4"><strong className="text-white">New York Open</strong>: Most volatile—best for entries</li>
            </ul>
            <h4 className="text-lg font-semibold text-white mb-2 mt-4">Risk Management</h4>
            <ul className="space-y-1 mb-3">
              <li className="ml-4">Never risk more than 1-2% per trade</li>
              <li className="ml-4">Maximum 3 trades per day</li>
              <li className="ml-4">Stop trading after 2 consecutive losses</li>
            </ul>
          </>
        ),
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
                            {typeof section.content === 'string' ? (
                              <div className="text-gray-300 whitespace-pre-line">{section.content}</div>
                            ) : (
                              section.content
                            )}
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
