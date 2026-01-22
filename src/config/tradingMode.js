// Trading Mode Configuration
// This file controls whether the platform shows crypto or traditional stocks/commodities

// Check localStorage for runtime override (client-side only)
const getStoredMode = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('TRADING_MODE');
    if (stored === 'crypto' || stored === 'stocks') {
      return stored;
    }
  }
  return null;
};

// Modes: 'crypto' | 'stocks'
// Priority: localStorage > env var > default ('stocks')
export const TRADING_MODE = getStoredMode() || process.env.NEXT_PUBLIC_TRADING_MODE || 'stocks';

// Function to get current mode (checks localStorage each time for reactivity)
export function getCurrentTradingMode() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('TRADING_MODE');
    if (stored === 'crypto' || stored === 'stocks') {
      return stored;
    }
  }
  return process.env.NEXT_PUBLIC_TRADING_MODE || 'stocks';
}

// Function to set trading mode (stores in localStorage and reloads)
export function setTradingMode(mode) {
  if (typeof window !== 'undefined' && (mode === 'crypto' || mode === 'stocks')) {
    localStorage.setItem('TRADING_MODE', mode);
    window.location.reload();
  }
}

// ============================================
// CRYPTO MODE CONFIGURATION
// ============================================
export const CRYPTO_CONFIG = {
  // Trading Pairs
  pairs: [
    "BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT", "ADA/USDT", "DOGE/USDT",
    "AVAX/USDT", "LINK/USDT", "DOT/USDT", "NEAR/USDT", "LTC/USDT",
    "HBAR/USDT", "SUI/USDT", "RENDER/USDT", "ATOM/USDT"
  ],
  
  // Default pair
  defaultPair: "BTC/USDT",
  
  // Exchanges/Brokers
  exchanges: [
    {
      id: "binance",
      name: "Binance",
      icon: "binance",
      color: "from-yellow-400 to-yellow-600",
      description: { en: "Market data provider", uk: "Постачальник ринкових даних" },
      fields: ["apiKey", "secret"],
      testnetUrl: "https://testnet.binance.vision/",
      docsUrl: "https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
    },
    {
      id: "bybit",
      name: "Bybit",
      icon: "bybit",
      color: "from-orange-400 to-orange-600",
      description: { en: "Real-time data feed", uk: "Потік даних в реальному часі" },
      fields: ["apiKey", "secret"],
      testnetUrl: "https://testnet.bybit.com/",
      docsUrl: "https://learn.bybit.com/bybit-guide/how-to-create-bybit-api-key/"
    },
    {
      id: "okx",
      name: "OKX",
      icon: "okx",
      color: "from-gray-700 to-gray-900",
      description: { en: "Advanced data platform", uk: "Просунута платформа даних" },
      fields: ["apiKey", "secret", "password"],
      testnetUrl: "https://www.okx.com/docs-v5/en/",
      docsUrl: "https://www.okx.com/support/hc/en-us/articles/360048917891"
    },
    {
      id: "kraken",
      name: "Kraken",
      icon: "kraken",
      color: "from-gray-600 to-gray-800",
      description: { en: "Reliable US data source", uk: "Надійне джерело даних США" },
      fields: ["apiKey", "secret"],
      testnetUrl: "https://docs.kraken.com/rest/",
      docsUrl: "https://support.kraken.com/hc/en-us/articles/360000919966"
    },
    {
      id: "kucoin",
      name: "KuCoin",
      icon: "kucoin",
      color: "from-green-400 to-emerald-600",
      description: { en: "Comprehensive market data", uk: "Комплексні ринкові дані" },
      fields: ["apiKey", "secret", "password"],
      testnetUrl: "https://www.kucoin.com/docs/",
      docsUrl: "https://www.kucoin.com/support/360015102174"
    },
    {
      id: "coinbase",
      name: "Coinbase",
      icon: "coinbase",
      color: "from-gray-700 to-gray-900",
      description: { en: "Leading data provider", uk: "Провідний постачальник даних" },
      fields: ["apiKey", "secret"],
      testnetUrl: "https://docs.cloud.coinbase.com/",
      docsUrl: "https://help.coinbase.com/en/exchange/managing-my-account/how-to-create-an-api-key"
    }
  ],
  
  // Partner logos for main page
  partners: [
    { name: "TradingView", type: "data" },
    { name: "Polygon.io", type: "data" },
    { name: "Alpha Vantage", type: "data" },
    { name: "Yahoo Finance", type: "data" },
    { name: "Quandl", type: "data" }
  ]
};

// ============================================
// STOCKS/COMMODITIES MODE CONFIGURATION
// ============================================
// NOTE: Only include symbols that we actually have data for via Yahoo Finance
// Removed: BRK.B (special chars), Index futures (ES, NQ, YM, RTY - need special handling)
// Removed: Forex pairs (need different data source)
// Commodities use Yahoo's =F suffix internally but displayed without it
export const STOCKS_CONFIG = {
  // Trading Symbols - Only those with confirmed Yahoo Finance data
  pairs: [
    // US Stocks - Tech (all verified)
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
    // US Stocks - Finance (verified)
    "JPM", "V", "MA",
    // US Stocks - Other (verified)
    "JNJ", "WMT", "PG", "HD", "DIS", "NFLX", "PYPL",
    // ETFs (all verified)
    "SPY", "QQQ", "IWM", "DIA", "VTI", "VOO", "EEM",
    // Commodity ETFs (verified)
    "GLD", "SLV", "USO",
  ],
  
  // Categorized pairs for better UI
  categories: {
    "US Stocks": ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "JPM", "V", "MA", "JNJ", "WMT", "PG", "HD", "DIS", "NFLX", "PYPL"],
    "ETFs": ["SPY", "QQQ", "IWM", "DIA", "VTI", "VOO", "EEM"],
    "Commodities": ["GLD", "SLV", "USO"],
  },
  
  // Default pair
  defaultPair: "SPY",
  
  // Brokers with API support for algorithmic trading
  // All marked as comingSoon since live trading is not yet available for stocks
  exchanges: [
    {
      id: "interactive_brokers",
      name: "Interactive Brokers",
      icon: "ib",
      color: "from-red-600 to-red-800",
      description: { en: "Professional trading platform", uk: "Професійна торгова платформа" },
      fields: ["apiKey", "secret", "accountId"],
      testnetUrl: "https://www.interactivebrokers.com/en/trading/ib-api.php",
      docsUrl: "https://www.interactivebrokers.com/campus/ibkr-api-page/",
      comingSoon: true
    },
    {
      id: "thinkorswim",
      name: "TD Ameritrade / thinkorswim",
      icon: "thinkorswim",
      color: "from-green-600 to-green-800",
      description: { en: "Advanced charting & analysis", uk: "Розширені графіки та аналіз" },
      fields: ["apiKey", "secret", "refreshToken"],
      testnetUrl: "https://developer.tdameritrade.com/",
      docsUrl: "https://developer.tdameritrade.com/content/getting-started",
      comingSoon: true
    },
    {
      id: "alpaca",
      name: "Alpaca",
      icon: "alpaca",
      color: "from-yellow-500 to-yellow-700",
      description: { en: "Commission-free API trading (US only)", uk: "Торгівля через API без комісій (тільки США)" },
      fields: ["apiKey", "secret"],
      testnetUrl: "https://app.alpaca.markets/paper/dashboard/overview",
      docsUrl: "https://alpaca.markets/docs/api-documentation/",
      comingSoon: true
    },
    {
      id: "tradier",
      name: "Tradier",
      icon: "tradier",
      color: "from-purple-600 to-purple-800",
      description: { en: "Brokerage API platform", uk: "Брокерська API платформа" },
      fields: ["apiKey", "accountId"],
      testnetUrl: "https://developer.tradier.com/",
      docsUrl: "https://documentation.tradier.com/",
      comingSoon: true
    },
    {
      id: "tradestation",
      name: "TradeStation",
      icon: "tradestation",
      color: "from-blue-700 to-blue-900",
      description: { en: "Award-winning platform", uk: "Нагороджена платформа" },
      fields: ["apiKey", "secret", "refreshToken"],
      testnetUrl: "https://www.tradestation.com/",
      docsUrl: "https://api.tradestation.com/docs/",
      comingSoon: true
    },
    {
      id: "firstrade",
      name: "Firstrade",
      icon: "firstrade",
      color: "from-orange-500 to-orange-700",
      description: { en: "Zero commission broker", uk: "Брокер без комісій" },
      fields: ["username", "password"],
      testnetUrl: "https://www.firstrade.com/",
      docsUrl: "https://www.firstrade.com/content/en-us/education",
      comingSoon: true
    }
  ],
  
  // Partner logos for main page - traditional finance focused
  partners: [
    { name: "Interactive Brokers", type: "broker", logo: "ib" },
    { name: "TD Ameritrade", type: "broker", logo: "td" },
    { name: "Alpaca", type: "broker", logo: "alpaca" },
    { name: "TradingView", type: "data", logo: "tradingview" },
    { name: "Bloomberg", type: "data", logo: "bloomberg" }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get current configuration based on mode
export function getCurrentConfig() {
  const mode = getCurrentTradingMode();
  return mode === 'crypto' ? CRYPTO_CONFIG : STOCKS_CONFIG;
}

// Get trading pairs
export function getTradingPairs() {
  return getCurrentConfig().pairs;
}

// Get default pair
export function getDefaultPair() {
  return getCurrentConfig().defaultPair;
}

// Get exchanges/brokers
export function getExchanges() {
  return getCurrentConfig().exchanges;
}

// Get partners
export function getPartners() {
  return getCurrentConfig().partners;
}

// Check if in crypto mode
export function isCryptoMode() {
  return getCurrentTradingMode() === 'crypto';
}

// Check if in stocks mode
export function isStocksMode() {
  return getCurrentTradingMode() === 'stocks';
}

// Get mode label
export function getModeLabel(language = 'en') {
  if (getCurrentTradingMode() === 'crypto') {
    return language === 'uk' ? 'Криптовалюти' : 'Crypto';
  }
  return language === 'uk' ? 'Акції та товари' : 'Stocks & Commodities';
}
