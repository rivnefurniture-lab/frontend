// Strategy configurations with real trading conditions
export const strategies = [
  {
    id: "golden-balance",
    name: "Golden Balance",
    category: "Multi-Indicator / Trend & Mean Reversion",
    cagr: 32.4,
    sharpe: 1.85,
    maxDD: 14.2,
    winRate: 67.3,
    totalTrades: 248,
    profitFactor: 2.1,
    minInvestment: 500,
    description: "A balanced strategy combining RSI momentum with Moving Average trend confirmation. Uses Bollinger Bands for dynamic exit points. Optimized for both bullish and bearish market conditions.",
    // Real strategy conditions
    config: {
      bullish_entry_conditions: [
        {
          indicator: "RSI",
          subfields: {
            "RSI Length": "28",
            "Timeframe": "15m",
            "Condition": "Greater Than",
            "Signal Value": 70
          }
        },
        {
          indicator: "MA",
          subfields: {
            "MA Type": "SMA",
            "Fast MA": "50",
            "Slow MA": "200",
            "Condition": "Greater Than",
            "Timeframe": "1h"
          }
        }
      ],
      bearish_entry_conditions: [
        {
          indicator: "RSI",
          subfields: {
            "RSI Length": "21",
            "Timeframe": "1h",
            "Condition": "Less Than",
            "Signal Value": 20
          }
        },
        {
          indicator: "MA",
          subfields: {
            "MA Type": "EMA",
            "Fast MA": "20",
            "Slow MA": "100",
            "Condition": "Less Than",
            "Timeframe": "1h"
          }
        }
      ],
      bullish_exit_conditions: [
        {
          indicator: "BollingerBands",
          subfields: {
            "BB% Period": "20",
            "Deviation": "1",
            "Condition": "Less Than",
            "Timeframe": "4h",
            "Signal Value": 0.4
          }
        }
      ],
      bearish_exit_conditions: [
        {
          indicator: "BollingerBands",
          subfields: {
            "BB% Period": "50",
            "Deviation": "1",
            "Condition": "Greater Than",
            "Timeframe": "1d",
            "Signal Value": 0.1
          }
        }
      ]
    },
    // Performance metrics
    returns: {
      daily: 0.089,
      weekly: 0.62,
      monthly: 2.7,
      yearly: 32.4
    },
    // Sample trades history
    recentTrades: [
      { date: "2024-12-02", pair: "BTC/USDT", side: "BUY", entry: 96420, exit: 97850, pnl: 1.48, status: "closed" },
      { date: "2024-12-01", pair: "ETH/USDT", side: "SELL", entry: 3680, exit: 3590, pnl: 2.44, status: "closed" },
      { date: "2024-11-30", pair: "BTC/USDT", side: "BUY", entry: 95100, exit: 96800, pnl: 1.79, status: "closed" },
      { date: "2024-11-29", pair: "SOL/USDT", side: "BUY", entry: 235, exit: 242, pnl: 2.98, status: "closed" },
      { date: "2024-11-28", pair: "BTC/USDT", side: "SELL", entry: 94800, exit: 93200, pnl: 1.69, status: "closed" },
    ],
    history: Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      value: 10000 * Math.pow(1.027, i) * (1 + Math.sin(i / 3) / 20),
    })),
    tags: ["Crypto", "Spot", "Multi-Timeframe"],
  },
  {
    id: "rsi-edge",
    name: "RSI Edge",
    category: "Technical / Mean Reversion",
    cagr: 18.2,
    sharpe: 1.4,
    maxDD: 12.6,
    winRate: 58.4,
    totalTrades: 312,
    profitFactor: 1.65,
    minInvestment: 500,
    description: "Mean-reversion strategy using RSI bands with ATR-based position sizing. Best for ranging markets.",
    config: {
      entry_conditions: [
        { indicator: "RSI", subfields: { "RSI Length": 14, "Timeframe": "1h", "Condition": "Less Than", "Signal Value": 30 } }
      ],
      exit_conditions: [
        { indicator: "RSI", subfields: { "RSI Length": 14, "Timeframe": "1h", "Condition": "Greater Than", "Signal Value": 70 } }
      ]
    },
    returns: {
      daily: 0.05,
      weekly: 0.35,
      monthly: 1.52,
      yearly: 18.2
    },
    recentTrades: [
      { date: "2024-12-02", pair: "BTC/USDT", side: "BUY", entry: 96200, exit: 97100, pnl: 0.94, status: "closed" },
      { date: "2024-12-01", pair: "ETH/USDT", side: "BUY", entry: 3620, exit: 3680, pnl: 1.66, status: "closed" },
      { date: "2024-11-30", pair: "BTC/USDT", side: "BUY", entry: 94800, exit: 95400, pnl: 0.63, status: "closed" },
    ],
    history: Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      value: 10000 * Math.pow(1.015, i) * (1 + Math.sin(i / 2) / 25),
    })),
    tags: ["Crypto", "Spot", "Binance"],
  },
  {
    id: "macd-trend",
    name: "MACD Trend",
    category: "Technical / Trend Following",
    cagr: 24.1,
    sharpe: 1.6,
    maxDD: 18.4,
    winRate: 52.1,
    totalTrades: 186,
    profitFactor: 1.92,
    minInvestment: 1000,
    description: "Trend-following strategy with MACD crossovers and trailing stops. Captures major market moves.",
    config: {
      bullish_entry_conditions: [
        { indicator: "MACD", subfields: { "MACD Preset": "12,26,9", "Timeframe": "1d", "MACD Trigger": "Crossing Up", "Line Trigger": "Greater Than 0" } }
      ],
      bullish_exit_conditions: [
        { indicator: "MACD", subfields: { "MACD Preset": "12,26,9", "Timeframe": "1d", "MACD Trigger": "Crossing Down" } }
      ]
    },
    returns: {
      daily: 0.066,
      weekly: 0.46,
      monthly: 2.01,
      yearly: 24.1
    },
    recentTrades: [
      { date: "2024-12-01", pair: "BTC/USDT", side: "BUY", entry: 94500, exit: 97200, pnl: 2.86, status: "closed" },
      { date: "2024-11-25", pair: "ETH/USDT", side: "BUY", entry: 3420, exit: 3680, pnl: 7.60, status: "closed" },
    ],
    history: Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      value: 10000 * Math.pow(1.02, i) * (1 + Math.cos(i / 3) / 18),
    })),
    tags: ["Crypto", "Futures", "Bybit"],
  },
  {
    id: "bb-mean-reversion",
    name: "Bollinger Bounce",
    category: "Volatility / Mean Reversion",
    cagr: 21.3,
    sharpe: 1.52,
    maxDD: 11.2,
    winRate: 64.8,
    totalTrades: 428,
    profitFactor: 1.78,
    minInvestment: 300,
    description: "Buys at lower Bollinger Band and sells at upper band. Works best in volatile but ranging markets.",
    config: {
      entry_conditions: [
        { indicator: "BollingerBands", subfields: { "BB% Period": 20, "Deviation": 2, "Timeframe": "1h", "Condition": "Less Than", "Signal Value": 0 } }
      ],
      exit_conditions: [
        { indicator: "BollingerBands", subfields: { "BB% Period": 20, "Deviation": 2, "Timeframe": "1h", "Condition": "Greater Than", "Signal Value": 1 } }
      ]
    },
    returns: {
      daily: 0.058,
      weekly: 0.41,
      monthly: 1.78,
      yearly: 21.3
    },
    recentTrades: [
      { date: "2024-12-02", pair: "BTC/USDT", side: "BUY", entry: 96100, exit: 97300, pnl: 1.25, status: "closed" },
      { date: "2024-12-02", pair: "ETH/USDT", side: "BUY", entry: 3640, exit: 3710, pnl: 1.92, status: "closed" },
      { date: "2024-12-01", pair: "SOL/USDT", side: "BUY", entry: 238, exit: 245, pnl: 2.94, status: "closed" },
    ],
    history: Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      value: 10000 * Math.pow(1.018, i) * (1 + Math.sin(i / 1.5) / 22),
    })),
    tags: ["Crypto", "Spot", "Multi-Exchange"],
  },
];

// Helper to get strategy by ID
export const getStrategyById = (id) => strategies.find(s => s.id === id);
