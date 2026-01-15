// Trading Mode Configuration
// This file controls whether the platform shows crypto or traditional stocks/commodities

// Modes: 'crypto' | 'stocks'
// Default mode - can be changed via admin panel or environment variable
export const TRADING_MODE = process.env.NEXT_PUBLIC_TRADING_MODE || 'stocks';

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
export const STOCKS_CONFIG = {
  // Trading Symbols - Popular Stocks, ETFs, Commodities, Indexes
  pairs: [
    // US Stocks
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B",
    "JPM", "V", "JNJ", "WMT", "PG", "MA", "HD", "DIS", "NFLX", "PYPL",
    // ETFs
    "SPY", "QQQ", "IWM", "DIA", "VTI", "VOO", "EEM", "GLD", "SLV", "USO",
    // Indexes (CFD style)
    "ES", "NQ", "YM", "RTY",
    // Commodities
    "GC", "SI", "CL", "NG", "HG",
    // Forex Majors
    "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD"
  ],
  
  // Categorized pairs for better UI
  categories: {
    "US Stocks": ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "JPM", "V", "JNJ", "WMT", "PG", "MA", "HD", "DIS", "NFLX", "PYPL"],
    "ETFs": ["SPY", "QQQ", "IWM", "DIA", "VTI", "VOO", "EEM", "GLD", "SLV", "USO"],
    "Index Futures": ["ES", "NQ", "YM", "RTY"],
    "Commodities": ["GC", "SI", "CL", "NG", "HG"],
    "Forex": ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD"]
  },
  
  // Default pair
  defaultPair: "SPY",
  
  // Brokers with API support for algorithmic trading
  exchanges: [
    {
      id: "interactive_brokers",
      name: "Interactive Brokers",
      icon: "ib",
      color: "from-red-600 to-red-800",
      description: { en: "Professional trading platform", uk: "Професійна торгова платформа" },
      fields: ["apiKey", "secret", "accountId"],
      testnetUrl: "https://www.interactivebrokers.com/en/trading/ib-api.php",
      docsUrl: "https://www.interactivebrokers.com/campus/ibkr-api-page/"
    },
    {
      id: "thinkorswim",
      name: "TD Ameritrade / thinkorswim",
      icon: "thinkorswim",
      color: "from-green-600 to-green-800",
      description: { en: "Advanced charting & analysis", uk: "Розширені графіки та аналіз" },
      fields: ["apiKey", "secret", "refreshToken"],
      testnetUrl: "https://developer.tdameritrade.com/",
      docsUrl: "https://developer.tdameritrade.com/content/getting-started"
    },
    {
      id: "alpaca",
      name: "Alpaca",
      icon: "alpaca",
      color: "from-yellow-500 to-yellow-700",
      description: { en: "Commission-free API trading", uk: "Торгівля через API без комісій" },
      fields: ["apiKey", "secret"],
      testnetUrl: "https://app.alpaca.markets/paper/dashboard/overview",
      docsUrl: "https://alpaca.markets/docs/api-documentation/"
    },
    {
      id: "tradier",
      name: "Tradier",
      icon: "tradier",
      color: "from-purple-600 to-purple-800",
      description: { en: "Brokerage API platform", uk: "Брокерська API платформа" },
      fields: ["apiKey", "accountId"],
      testnetUrl: "https://developer.tradier.com/",
      docsUrl: "https://documentation.tradier.com/"
    },
    {
      id: "tradestation",
      name: "TradeStation",
      icon: "tradestation",
      color: "from-blue-700 to-blue-900",
      description: { en: "Award-winning platform", uk: "Нагороджена платформа" },
      fields: ["apiKey", "secret", "refreshToken"],
      testnetUrl: "https://www.tradestation.com/",
      docsUrl: "https://api.tradestation.com/docs/"
    },
    {
      id: "firstrade",
      name: "Firstrade",
      icon: "firstrade",
      color: "from-orange-500 to-orange-700",
      description: { en: "Zero commission broker", uk: "Брокер без комісій" },
      fields: ["username", "password"],
      testnetUrl: "https://www.firstrade.com/",
      docsUrl: "https://www.firstrade.com/content/en-us/education"
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
  return TRADING_MODE === 'crypto' ? CRYPTO_CONFIG : STOCKS_CONFIG;
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
  return TRADING_MODE === 'crypto';
}

// Check if in stocks mode
export function isStocksMode() {
  return TRADING_MODE === 'stocks';
}

// Get mode label
export function getModeLabel(language = 'en') {
  if (TRADING_MODE === 'crypto') {
    return language === 'uk' ? 'Криптовалюти' : 'Crypto';
  }
  return language === 'uk' ? 'Акції та товари' : 'Stocks & Commodities';
}

