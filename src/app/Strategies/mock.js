export const strategies = [
  {
    id: 'rsi-edge',
    name: 'RSI Edge',
    category: 'Technical / Mean Reversion',
    cagr: 18.2,
    sharpe: 1.4,
    maxDD: 12.6,
    minInvestment: 500,
    description: 'Mean-reversion strategy using RSI bands with ATR-based position sizing.',
    history: Array.from({length: 24}, (_,i)=>({ month: i+1, value: 10000 * (1 + 0.012*i + Math.sin(i/2)/50)})),
    tags: ['Crypto', 'Spot', 'Binance']
  },
  {
    id: 'macd-trend',
    name: 'MACD Trend',
    category: 'Technical / Trend Following',
    cagr: 24.1,
    sharpe: 1.6,
    maxDD: 18.4,
    minInvestment: 1000,
    description: 'Trend-following strategy with MACD crossovers and trailing stops.',
    history: Array.from({length: 24}, (_,i)=>({ month: i+1, value: 10000 * (1 + 0.018*i + Math.cos(i/3)/40)})),
    tags: ['Crypto', 'Futures', 'Bybit']
  },
  {
    id: 'atr-breakout',
    name: 'ATR Breakout',
    category: 'Volatility / Breakout',
    cagr: 16.7,
    sharpe: 1.2,
    maxDD: 9.8,
    minInvestment: 300,
    description: 'Volatility-adjusted breakout with ATR channels and safety orders.',
    history: Array.from({length: 24}, (_,i)=>({ month: i+1, value: 10000 * (1 + 0.011*i + Math.sin(i/1.3)/60)})),
    tags: ['Forex', 'CFD']
  }
]