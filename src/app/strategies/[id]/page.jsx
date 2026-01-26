"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch, publicFetch } from "@/lib/api";
import { getTradingPairs, getDefaultPair, getExchanges, isCryptoMode } from "@/config/tradingMode";
import SuccessModal from "@/components/SuccessModal";
import { showToast } from "@/components/Toast";

// Build version: 2025-12-14-v3 - percentage fixes
console.log("[Algotcha] Strategy page loaded - build v2026-01-14-v7");

export default function StrategyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();

  // Translations
  const t = {
    back: language === "uk" ? "Назад" : "Back",
    yearlyReturn: language === "uk" ? "Річна дохідність" : "Yearly Return",
    winRate: language === "uk" ? "Відсоток виграшу" : "Win Rate",
    sharpeRatio: language === "uk" ? "Коеф. Шарпа" : "Sharpe Ratio",
    maxDrawdown: language === "uk" ? "Макс. просадка" : "Max Drawdown",
    returnsBreakdown: language === "uk" ? "Розбивка дохідності" : "Returns Breakdown",
    daily: language === "uk" ? "День" : "Daily",
    weekly: language === "uk" ? "Тиждень" : "Weekly",
    monthly: language === "uk" ? "Місяць" : "Monthly",
    yearly: language === "uk" ? "Рік" : "Yearly",
    historicalPerformance: language === "uk" ? "Історичні річні показники" : "Historical Yearly Performance",
    overview: language === "uk" ? "Огляд" : "Overview",
    trades: language === "uk" ? "Угоди" : "Trades",
    conditions: language === "uk" ? "Умови" : "Conditions",
    rerun: language === "uk" ? "Перезапуск" : "Rerun",
    performanceChart: language === "uk" ? "Графік показників" : "Performance Chart",
    totalTrades: language === "uk" ? "Всього угод" : "Total Trades",
    profitFactor: language === "uk" ? "Фактор прибутку" : "Profit Factor",
    minInvestment: language === "uk" ? "Мін. інвестиція" : "Min Investment",
    backtestTrades: language === "uk" ? "Угоди бектесту" : "Backtest Trades",
    tradingConditions: language === "uk" ? "Торгові умови" : "Trading Conditions",
    startLiveTrading: language === "uk" ? "Почати живу торгівлю" : "Start Live Trading",
    connectFirst: language === "uk" ? "Спочатку підключіть джерело даних на" : "Connect your exchange on the",
    connectPage: language === "uk" ? "сторінці підключення" : "Connect page",
    exchange: language === "uk" ? "Платформа" : "Exchange",
    tradingPair: language === "uk" ? "Торгова пара" : "Trading Pair",
    timeframe: language === "uk" ? "Таймфрейм" : "Timeframe",
    orderSize: language === "uk" ? "Розмір ордера ($)" : "Order Size ($)",
    maxRisk: language === "uk" ? "Макс. ризик ($)" : "Max Risk ($)",
    perTrade: language === "uk" ? "$ за угоду" : "$ per trade",
    closesIfLoss: language === "uk" ? "Закриває всі при перевищенні втрат" : "Closes all if loss exceeds",
    riskWarning: language === "uk" ? "Попередження про ризик" : "Risk Warning",
    riskWarningText: language === "uk" ? "Це торгівля РЕАЛЬНИМИ грошима. Якщо нереалізований збиток досягне" : "This trades REAL money. If unrealized loss reaches",
    allPositionsClose: language === "uk" ? ", всі позиції закриються автоматично." : ", all positions close automatically.",
    starting: language === "uk" ? "Запуск..." : "Starting...",
    startLive: language === "uk" ? "🚀 Почати живу торгівлю" : "🚀 Start Live Trading",
    tradingRisk: language === "uk" ? "Торгівля пов'язана з ризиком. Торгуйте лише тими коштами, які можете дозволити собі втратити." : "Trading involves risk. Only trade with money you can afford to lose.",
    quickStats: language === "uk" ? "Швидка статистика" : "Quick Stats",
    loading: language === "uk" ? "Завантаження стратегії..." : "Loading strategy...",
    notFound: language === "uk" ? "Стратегію не знайдено" : "Strategy Not Found",
    notFoundDesc: language === "uk" ? "Стратегія, яку ви шукаєте, не існує." : "The strategy you're looking for doesn't exist.",
    backToStrategies: language === "uk" ? "← Назад до стратегій" : "← Back to Strategies",
    connected: language === "uk" ? "Підключено" : "Connected",
    notConnected: language === "uk" ? "Не підключено." : "Not connected.",
    connectNow: language === "uk" ? "Підключити зараз →" : "Connect now →",
  };

  // Get config from trading mode
  const AVAILABLE_PAIRS = getTradingPairs();
  const DEFAULT_PAIR = getDefaultPair();
  const EXCHANGES = getExchanges();
  const defaultExchange = EXCHANGES[0]?.id || "interactive_brokers";

  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchange, setExchange] = useState(defaultExchange);
  const [symbol, setSymbol] = useState(DEFAULT_PAIR);
  const [timeframe, setTimeframe] = useState("1h");
  const [amount, setAmount] = useState(10); // $ per trade
  const [maxBudget, setMaxBudget] = useState(50); // Max loss before closing all
  const [starting, setStarting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [connectedExchanges, setConnectedExchanges] = useState([]);

  // Modal states
  const [successModal, setSuccessModal] = useState({ open: false, type: null, data: {} });

  // Backtest rerun state
  const [backtestConfig, setBacktestConfig] = useState({
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    initialCapital: 10000,
    pairs: [DEFAULT_PAIR, AVAILABLE_PAIRS[1] || DEFAULT_PAIR], // Default to 2 most liquid pairs
  });
  const [runningBacktest, setRunningBacktest] = useState(false);
  const [backtestResult, setBacktestResult] = useState(null);
  const [backtestProgress, setBacktestProgress] = useState(null);
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(null);
  const [loadingAllTrades, setLoadingAllTrades] = useState(false);
  const [showAllStrategyTrades, setShowAllStrategyTrades] = useState(false);
  const [showChecks, setShowChecks] = useState(false);

  useEffect(() => {
    fetchStrategy();
    if (user) {
      fetchExchangeConnections();
    }
  }, [params.id, user]);

  const fetchExchangeConnections = async () => {
    try {
      const connections = await apiFetch("/exchange/connections");
      setConnectedExchanges(connections || []);
    } catch (e) {
      console.log("No exchange connections found");
    }
  };

  const fetchStrategy = async () => {
    try {
      // Check if this is a backtest result (format: "backtest-123")
      if (params.id.startsWith('backtest-')) {
        const backtestId = params.id.replace('backtest-', '');
        try {
          const result = await publicFetch(`/backtest/results/${backtestId}`);
          if (result) {
            // Transform backtest result to strategy format
            const rawTrades = result.trades ? (typeof result.trades === 'string' ? JSON.parse(result.trades) : result.trades) : [];

            const isExecutionAction = (action = '') => {
              const a = action.toString().toLowerCase();
              return a.includes('buy') || a.includes('sell') || a.includes('entry') || a.includes('exit');
            };

            const executionTrades = rawTrades.filter((t) => isExecutionAction(t.action));
            const checkTrades = rawTrades.filter((t) => !isExecutionAction(t.action));

            // Transform trades to the format expected by the UI
            const formattedTrades = executionTrades.map(t => {
              const ts = new Date(t.timestamp);
              const orderSize = parseFloat(t.order_size) || 1000; // Use actual order_size from backtest
              return {
                date: ts.toLocaleDateString(),
                time: ts.toLocaleTimeString(),
                pair: t.symbol || '',
                side: t.action || '',
                entry: parseFloat(t.price) || 0,
                orderSize: orderSize,
                pnl: parseFloat(t.profit_loss) / (result.initialBalance || 10000) || 0,
                pnlUsd: parseFloat(t.profit_loss) || 0,
                balance: parseFloat(t.balance) || 0,
                comment: t.comment || '',
                timestamp: ts.getTime(),
              };
            });

            const formattedChecks = checkTrades.map(t => {
              const ts = new Date(t.timestamp);
              const orderSize = parseFloat(t.order_size) || 1000;
              return {
                date: ts.toLocaleDateString(),
                time: ts.toLocaleTimeString(),
                pair: t.symbol || '',
                side: t.action || 'Check',
                entry: parseFloat(t.price) || 0,
                orderSize,
                pnl: parseFloat(t.profit_loss) / (result.initialBalance || 10000) || 0,
                pnlUsd: parseFloat(t.profit_loss) || 0,
                balance: parseFloat(t.balance) || 0,
                comment: t.comment || '',
                timestamp: ts.getTime(),
              };
            });

            // Build a fallback history from trades if chartData is missing
            let history =
              result.chartData
                ? (typeof result.chartData === 'string' ? JSON.parse(result.chartData) : result.chartData)
                : [];
            if ((!history || history.length === 0) && formattedTrades.length > 0) {
              const sortedTrades = [...formattedTrades].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
              let balance = result.initialBalance || result.initial_balance || 10000;
              history = sortedTrades.map((t, idx) => {
                balance = t.balance || balance + (t.pnlUsd || 0);
                return {
                  label: t.date,
                  value: balance,
                  idx,
                };
              });
            }

            // Convert raw decimals to percentages
            const yearlyReturnPct = (result.yearlyReturn || result.yearly_return || 0) * 100;
            const winRatePct = (result.winRate || result.win_rate || 0) * 100;
            const maxDDPct = (result.maxDrawdown || result.max_drawdown || 0) * 100;
            const netProfitPct = (result.netProfit || result.net_profit || 0) * 100;

            const transformed = {
              id: `backtest-${backtestId}`,
              name: result.name || result.strategy_name || 'Backtest Result',
              isBacktestResult: true,
              netProfit: netProfitPct,
              netProfitUsd: result.netProfitUsd || result.net_profit_usd || 0,
              sharpe: result.sharpeRatio || result.sharpe_ratio || 0,
              sharpeRatio: result.sharpeRatio || result.sharpe_ratio || 0,
              sortinoRatio: result.sortinoRatio || result.sortino_ratio || 0,
              maxDD: maxDDPct,
              maxDrawdown: maxDDPct,
              winRate: winRatePct,
              totalTrades: result.totalTrades || result.total_trades || executionTrades.length,
              totalBacktestTrades: executionTrades.length,
              totalTradesWithChecks: executionTrades.length + formattedChecks.length,
              profitFactor: result.profitFactor || result.profit_factor || 0,
              yearlyReturn: yearlyReturnPct,
              cagr: yearlyReturnPct,
              startDate: result.startDate || result.start_date,
              endDate: result.endDate || result.end_date,
              initialBalance: result.initialBalance || result.initial_balance || 10000,
              pairs: result.pairs || [],
              history,
              trades: rawTrades,
              recentTrades: formattedTrades,
              checkTrades: formattedChecks,
              config: result.config ? (typeof result.config === 'string' ? JSON.parse(result.config) : result.config) : {},
              returns: {
                daily: (yearlyReturnPct / 365).toFixed(3),
                weekly: (yearlyReturnPct / 52).toFixed(2),
                monthly: (yearlyReturnPct / 12).toFixed(1),
                yearly: yearlyReturnPct.toFixed(1),
              }
            };
            setStrategy(transformed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to fetch backtest result:", e);
        }
      }

      // Fetch preset strategies (public endpoint, no auth required)
      const allStrategies = await publicFetch("/backtest/strategies");
      const found = allStrategies?.find(s => s.id === params.id || s.id === parseInt(params.id));
      if (found) {
        // Calculate returns
        const yearlyReturn = found.cagr || 0;
        found.returns = found.returns || {
          daily: yearlyReturn ? (yearlyReturn / 365).toFixed(3) : null,
          weekly: yearlyReturn ? (yearlyReturn / 52).toFixed(2) : null,
          monthly: yearlyReturn ? (yearlyReturn / 12).toFixed(1) : null,
          yearly: yearlyReturn ? yearlyReturn.toFixed(1) : null,
        };

        // Use history from API if available (already has proper format)
        // history comes from getAllStrategies with { year: 'Jan 23', value: 5000 } format

        // Fetch trades from the backend for preset strategies
        if (found.isPreset || params.id.startsWith('real-')) {
          try {
            const tradesData = await publicFetch(`/backtest/preset-strategies/${params.id}/trades`);
            if (tradesData?.trades && tradesData.trades.length > 0) {
              const allTrades = tradesData.trades;

              // Map trades for the table
              found.recentTrades = allTrades.slice(0, 200).map(t => {
                const profitLossUsd = parseFloat(t.profit_loss) || 0;
                const orderSize = parseFloat(t.order_size) || 1;
                const pnlPercent = orderSize > 0 ? (profitLossUsd / orderSize) * 100 : 0;

                return {
                  date: t.timestamp?.split(' ')[0] || t.date || 'N/A',
                  time: t.timestamp?.split(' ')[1] || t.time || '',
                  pair: t.symbol,
                  side: t.action,
                  entry: parseFloat(t.price) || 0,
                  exit: t.action?.includes('Exit') || t.action === 'SELL' ? parseFloat(t.price) : 0,
                  pnl: pnlPercent / 100,
                  pnlUsd: profitLossUsd,
                  balance: parseFloat(t.balance) || 0,
                  orderSize: orderSize,
                  comment: t.trade_comment,
                  status: t.action === 'BUY' ? 'Entry' : (t.action?.includes('Exit') ? 'Exit' : t.action),
                };
              });
              found.totalBacktestTrades = tradesData.total || allTrades.length;
            }
          } catch (e) {
            console.log('Could not fetch trades:', e);
          }
        }

        setStrategy(found);
      }
    } catch (err) {
      console.error("Failed to fetch strategy:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">{t.loading}</p>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">{t.notFound}</h2>
            <p className="text-gray-600 mb-4">{t.notFoundDesc}</p>
            <Link href="/strategies">
              <Button>{t.backToStrategies}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startLive = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    // Check if exchange is connected
    const exchangeConnection = connectedExchanges.find(c => c.exchange === exchange || c === exchange);
    if (!exchangeConnection) {
      showToast(language === "uk"
        ? `Спочатку підключіть ${exchange} на сторінці Connect`
        : `Please connect your ${exchange} account first`, "warning");
      router.push("/connect");
      return;
    }

    try {
      setStarting(true);
      const response = await apiFetch("/strategies/start", {
        method: "POST",
        body: {
          strategyId: String(strategy.id),
          config: JSON.stringify(strategy.config || {}),
          exchange,
          symbol,
          timeframe,
          orderSize: Number(amount),
          maxBudget: Number(maxBudget),
        },
      });

      if (response?.error) {
        showToast(response.error, "error");
        return;
      }

      setSuccessModal({
        open: true,
        type: "live",
        data: { amount, maxBudget }
      });
    } catch (e) {
      console.error("Start trading error:", e);
      showToast(e.message, "error");
    } finally {
      setStarting(false);
    }
  };

  const formatValue = (val, suffix = "", decimals = 1) => {
    if (val === null || val === undefined) return "—";
    const num = Number(val);
    if (Number.isNaN(num)) return "—";
    return `${num.toFixed(decimals)}${suffix}`;
  };

  const formatSigned = (val) => {
    if (val === null || val === undefined || Number.isNaN(val)) return "—";
    const num = Number(val);
    const sign = num > 0 ? "+" : "";
    return `${sign}${num}`;
  };

  const displayedTrades = (() => {
    if (!strategy) return [];
    const trades = showChecks
      ? [...(strategy.recentTrades || []), ...(strategy.checkTrades || [])]
      : (strategy.recentTrades || []);
    return trades.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  })();

  return (
    <div className="container py-8">
      {/* Success Modal */}
      <SuccessModal
        open={successModal.open}
        onClose={() => {
          setSuccessModal({ open: false, type: null, data: {} });
          if (successModal.type === "live") {
            router.push("/dashboard");
          }
        }}
        title={successModal.type === "backtest"
          ? (language === "uk" ? "Бектест в черзі!" : "Backtest Queued!")
          : (language === "uk" ? "Запущено!" : "Started!")
        }
        subtitle={successModal.type === "backtest"
          ? (language === "uk" ? "Ваш бектест додано до черги обробки" : "Your backtest has been added to the processing queue")
          : (language === "uk" ? "Аналіз запущено успішно" : "Analysis started successfully")
        }
        icon={successModal.type === "backtest" ? "queue" : "success"}
        details={successModal.type === "backtest" ? [
          { label: language === "uk" ? "Позиція в черзі" : "Queue Position", value: `#${successModal.data.position || 1}` },
          { label: language === "uk" ? "Очікуваний час" : "Estimated Wait", value: `~${successModal.data.wait || 10} ${language === "uk" ? "хв" : "min"}` },
        ] : [
          { label: language === "uk" ? "Розмір ордеру" : "Order Size", value: `$${successModal.data.amount}` },
          { label: language === "uk" ? "Макс. ризик" : "Max Risk", value: `$${successModal.data.maxBudget}` },
        ]}
        footer={successModal.type === "backtest"
          ? (language === "uk" ? "Слідкуйте за прогресом у плаваючому моніторі!" : "Watch the floating monitor for live progress!")
          : (language === "uk" ? "Перейдіть на панель для моніторингу" : "Go to Dashboard to monitor")
        }
      />

      {bannerMessage && (
        <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          {bannerMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/strategies" className="text-gray-600 hover:text-black flex items-center gap-1 font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.back}
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{strategy.name}</h1>
          <p className="text-gray-600">{strategy.category}</p>
        </div>
        <div className="flex gap-2">
          {strategy.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label={t.yearlyReturn} value={formatValue(strategy.returns?.yearly || strategy.cagr || strategy.yearlyReturn, "%")} color="emerald" />
            <MetricCard label={t.winRate} value={formatValue(strategy.winRate, "%")} color="black" />
            <MetricCard label={t.sharpeRatio} value={formatValue(strategy.sharpe || strategy.sharpeRatio, "", 2)} color="gray" />
            <MetricCard label={t.maxDrawdown} value={formatValue(strategy.maxDD || strategy.maxDrawdown, "%")} color="red" />
          </div>

          {/* Returns Breakdown */}
          <div className="bg-white border-2 border-gray-100 p-6" style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
            <h3 className="text-lg font-bold mb-4">{t.returnsBreakdown}</h3>
            <div className="grid grid-cols-4 gap-4 text-center mb-6">
              {[
                { label: t.daily, val: strategy.returns?.daily },
                { label: t.weekly, val: strategy.returns?.weekly },
                { label: t.monthly, val: strategy.returns?.monthly },
                { label: t.yearly, val: strategy.returns?.yearly || strategy.cagr },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-gray-50" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                  <div className={`text-2xl font-bold ${Number(item.val) < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {item.val !== null && item.val !== undefined ? `${formatSigned(Number(item.val))}%` : "—"}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Yearly Performance History */}
            <div className="border-t-2 border-gray-100 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gray-800 flex items-center justify-center" style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))' }}>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-700">{t.historicalPerformance}</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[2023, 2024, 2025].map((year) => {
                  const yearData = strategy.yearlyBreakdown?.[year];
                  const value = yearData?.return || strategy.yearlyReturns?.[year];
                  const isPositive = value !== undefined && value !== null && value >= 0;
                  const isPast = year <= new Date().getFullYear();
                  return (
                    <div
                      key={year}
                      className={`p-3 text-center ${isPast ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                        }`}
                      style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                    >
                      <div className="text-xs text-gray-500 mb-1 font-medium">{year}</div>
                      <div className={`font-bold ${value === undefined || value === null
                          ? 'text-gray-400'
                          : isPositive
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}>
                        {value === undefined || value === null ? '—' : `${isPositive ? '+' : ''}${value.toFixed(1)}%`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {language === "uk"
                  ? "Очікується оновлена річна розбивка з останнього бектесту. Минулі результати не гарантують майбутніх."
                  : "Awaiting updated yearly breakdown from the latest backtest. Past performance does not guarantee future results."}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b-2 border-gray-100">
            {[
              { key: "overview", label: t.overview },
              { key: "trades", label: t.trades },
              { key: "conditions", label: t.conditions },
              { key: "backtest", label: t.rerun },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 font-bold transition-all ${activeTab === tab.key
                    ? "bg-black text-white"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
                style={activeTab === tab.key ? { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' } : {}}
              >
                {tab.key === "backtest" ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {tab.label}
                  </span>
                ) : tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <Card>
              <CardHeader>
                <CardTitle>{t.performanceChart}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{strategy.description}</p>
                {strategy.history && strategy.history.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={strategy.history}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          formatter={(v) => [`$${v?.toLocaleString()}`, "Balance"]}
                          labelFormatter={(label) => label ? `Year ${label}` : ''}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          fill="url(#colorValue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-gray-500">Loading performance chart...</p>
                      <p className="text-xs text-gray-400 mt-1">Chart will appear once data loads</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                  <div>
                    <div className="text-lg font-semibold">{strategy.totalTrades}</div>
                    <div className="text-sm text-gray-500">{t.totalTrades}</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{formatValue(strategy.profitFactor, "x", 2)}</div>
                    <div className="text-sm text-gray-500">{t.profitFactor}</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">${strategy.minInvestment}</div>
                    <div className="text-sm text-gray-500">{t.minInvestment}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "trades" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.backtestTrades}</CardTitle>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={showChecks}
                      onChange={(e) => setShowChecks(e.target.checked)}
                    />
                    Include checks
                  </label>
                  <span className="text-sm text-gray-500">
                    {(showChecks ? (strategy.totalTradesWithChecks || 0) : (strategy.totalBacktestTrades || 0)) > 0
                      ? `${(showChecks ? strategy.totalTradesWithChecks : strategy.totalBacktestTrades) || 0} trades`
                      : 'No trades'}
                  </span>
                  {strategy.totalBacktestTrades > (strategy.recentTrades?.length || 0) && (
                    <button
                      onClick={async () => {
                        if (showAllStrategyTrades) {
                          // Reload strategy to get back to sample trades
                          fetchStrategy();
                          setShowAllStrategyTrades(false);
                        } else {
                          // Fetch all trades
                          setLoadingAllTrades(true);
                          try {
                            const allTradesData = await apiFetch(`/backtest/strategies/${params.id}/all-trades`);
                            if (allTradesData.trades) {
                              setStrategy({
                                ...strategy,
                                recentTrades: allTradesData.trades,
                              });
                              setShowAllStrategyTrades(true);
                            }
                          } catch (e) {
                            console.error('Failed to load all trades:', e);
                          } finally {
                            setLoadingAllTrades(false);
                          }
                        }
                      }}
                      className="text-sm text-emerald-600 hover:underline font-medium"
                      disabled={loadingAllTrades}
                    >
                      {loadingAllTrades ? 'Loading...' : showAllStrategyTrades ? 'Show Less' : 'Show All Trades'}
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                      <tr className="text-left text-xs text-gray-600 uppercase tracking-wider">
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Time</th>
                        <th className="px-4 py-3 font-semibold">Pair</th>
                        <th className="px-4 py-3 font-semibold">Action</th>
                        <th className="px-4 py-3 font-semibold">Price</th>
                        <th className="px-4 py-3 font-semibold">Size</th>
                        <th className="px-4 py-3 font-semibold">P&L</th>
                        <th className="px-4 py-3 font-semibold">Balance</th>
                        <th className="px-4 py-3 font-semibold">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedTrades?.map((trade, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{trade.date}</td>
                          <td className="px-4 py-3 text-gray-500">{trade.time}</td>
                          <td className="px-4 py-3 font-medium">{trade.pair}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${trade.side === "BUY" || trade.side?.includes("Entry")
                                ? "bg-green-100 text-green-700"
                                : trade.side === "SELL" || trade.side?.includes("Exit")
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                              {trade.side}
                            </span>
                          </td>
                          <td className="px-4 py-3">${trade.entry?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3">${trade.orderSize?.toLocaleString()}</td>
                          <td className={`px-4 py-3 font-medium ${trade.pnlUsd >= 0 ? "text-green-600" : "text-red-600"}`}>
                            <div>{trade.pnlUsd > 0 ? "+" : ""}{(trade.pnl * 100)?.toFixed(2)}%</div>
                            <div className="text-xs opacity-70">{trade.pnlUsd >= 0 ? "+" : ""}${trade.pnlUsd?.toFixed(2)}</div>
                          </td>
                          <td className="px-4 py-3 font-medium">${trade.balance?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate" title={trade.comment}>
                            {trade.comment}
                          </td>
                        </tr>
                      )) || (
                          <tr>
                            <td colSpan={9} className="px-4 py-12 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-gray-500">No trades available. Run a backtest to see trades.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
                {!displayedTrades?.length && (
                  <p className="text-center text-gray-500 py-4">No trades yet</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "conditions" && (
            <Card>
              <CardHeader>
                <CardTitle>{t.tradingConditions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {strategy.config?.bullish_entry_conditions && (
                  <ConditionGroup title="🟢 Bullish Entry" conditions={strategy.config.bullish_entry_conditions} />
                )}
                {strategy.config?.bearish_entry_conditions && (
                  <ConditionGroup title="🔴 Bearish Entry" conditions={strategy.config.bearish_entry_conditions} />
                )}
                {strategy.config?.entry_conditions && (
                  <ConditionGroup title="📈 Entry Conditions" conditions={strategy.config.entry_conditions} />
                )}
                {strategy.config?.bullish_exit_conditions && (
                  <ConditionGroup title="🟢 Bullish Exit" conditions={strategy.config.bullish_exit_conditions} />
                )}
                {strategy.config?.bearish_exit_conditions && (
                  <ConditionGroup title="🔴 Bearish Exit" conditions={strategy.config.bearish_exit_conditions} />
                )}
                {strategy.config?.exit_conditions && (
                  <ConditionGroup title="📉 Exit Conditions" conditions={strategy.config.exit_conditions} />
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "backtest" && (
            <Card>
              <CardHeader>
                <CardTitle>🔄 Rerun Backtest</CardTitle>
                <p className="text-sm text-gray-500">Test this strategy with different parameters and time periods</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1 bg-emerald-50 px-2 py-1 inline-flex" style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Data available: 2023-01-01 to 2025-12-10
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Period Selectors */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <label className="text-sm font-medium text-gray-700">Quick Periods</label>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(() => {
                      const today = new Date();
                      const formatDate = (d) => d.toISOString().split('T')[0];
                      const subDays = (d, days) => { const r = new Date(d); r.setDate(r.getDate() - days); return r; };
                      const subMonths = (d, months) => { const r = new Date(d); r.setMonth(r.getMonth() - months); return r; };
                      return [
                        { label: "Last Week", start: formatDate(subDays(today, 7)), end: formatDate(today) },
                        { label: "Last Month", start: formatDate(subMonths(today, 1)), end: formatDate(today) },
                        { label: "Last 3 Months", start: formatDate(subMonths(today, 3)), end: formatDate(today) },
                        { label: "Last 6 Months", start: formatDate(subMonths(today, 6)), end: formatDate(today) },
                        { label: "Last Year", start: formatDate(subMonths(today, 12)), end: formatDate(today) },
                      ];
                    })().map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setBacktestConfig({ ...backtestConfig, startDate: preset.start, endDate: preset.end })}
                        className={`px-3 py-1.5 rounded-full text-sm transition ${backtestConfig.startDate === preset.start && backtestConfig.endDate === preset.end
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Presets */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">📅 By Year</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { label: "2024", start: "2024-01-01", end: "2024-12-31" },
                      { label: "2023", start: "2023-01-01", end: "2023-12-31" },
                      { label: "All (3 years)", start: "2023-01-01", end: "2025-12-10" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setBacktestConfig({ ...backtestConfig, startDate: preset.start, endDate: preset.end })}
                        className={`px-3 py-1.5 text-sm transition ${backtestConfig.startDate === preset.start && backtestConfig.endDate === preset.end
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Start Date</label>
                      <input
                        type="date"
                        className="w-full h-10 px-3 rounded-lg border border-gray-200"
                        value={backtestConfig.startDate}
                        onChange={(e) => setBacktestConfig({ ...backtestConfig, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Date</label>
                      <input
                        type="date"
                        className="w-full h-10 px-3 rounded-lg border border-gray-200"
                        value={backtestConfig.endDate}
                        onChange={(e) => setBacktestConfig({ ...backtestConfig, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Initial Capital */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">💰 Initial Capital</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[1000, 5000, 10000, 50000, 100000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBacktestConfig({ ...backtestConfig, initialCapital: amount })}
                        className={`px-3 py-1.5 rounded-full text-sm transition ${backtestConfig.initialCapital === amount
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        ${amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    className="w-full h-10 px-3 rounded-lg border border-gray-200"
                    value={backtestConfig.initialCapital}
                    onChange={(e) => setBacktestConfig({ ...backtestConfig, initialCapital: parseInt(e.target.value) || 10000 })}
                    min="100"
                    placeholder="Enter custom amount"
                  />
                </div>

                {/* Trading Pairs - from config */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">📊 {isCryptoMode() ? "Trading Pairs" : (language === "uk" ? "Інструменти" : "Instruments")}</label>
                  {(() => {
                    const availablePairs = AVAILABLE_PAIRS;

                    return (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {availablePairs.map((pair) => {
                            const isSelected = backtestConfig.pairs.includes(pair);
                            return (
                              <button
                                key={pair}
                                onClick={() => {
                                  if (isSelected) {
                                    setBacktestConfig({ ...backtestConfig, pairs: backtestConfig.pairs.filter(p => p !== pair) });
                                  } else {
                                    setBacktestConfig({ ...backtestConfig, pairs: [...backtestConfig.pairs, pair] });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm transition ${isSelected
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {pair}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setBacktestConfig({ ...backtestConfig, pairs: availablePairs })}
                            className="text-xs text-emerald-600 hover:underline"
                          >
                            Select All
                          </button>
                          <button
                            onClick={() => setBacktestConfig({ ...backtestConfig, pairs: [] })}
                            className="text-xs text-gray-500 hover:underline"
                          >
                            Clear All
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {backtestConfig.pairs.length === 0
                            ? 'Select pairs to backtest (max active deals will match pairs count)'
                            : `${backtestConfig.pairs.length} pairs selected • Max active deals: ${backtestConfig.pairs.length}`}
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Validation Warning */}
                {(() => {
                  const start = new Date(backtestConfig.startDate);
                  const end = new Date(backtestConfig.endDate);
                  const dataStart = new Date('2023-01-01');
                  const dataEnd = new Date('2025-12-14');
                  const pairCount = backtestConfig.pairs.length;

                  const warnings = [];
                  if (start < dataStart) warnings.push(`Start date before available data (2023-01-01)`);
                  if (end > dataEnd) warnings.push(`End date after available data (2025-12-14)`);
                  if (end <= start) warnings.push(`End date must be after start date`);
                  if (pairCount === 0) warnings.push(`Please select at least 1 pair`);

                  return warnings.length > 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                      <div className="font-medium text-yellow-800 mb-1">⚠️ Warnings:</div>
                      {warnings.map((w, i) => (
                        <div key={i} className="text-yellow-700">• {w}</div>
                      ))}
                    </div>
                  ) : null;
                })()}

                {/* Run Button */}
                <Button
                  className="w-full h-12 text-lg"
                  onClick={async () => {
                    setRunningBacktest(true);
                    setBacktestResult(null);
                    setBacktestProgress({ stage: 'Starting...', percent: 5 });

                    // Progress simulation with messages
                    const progressMessages = [
                      { msg: '📡 Connecting to backtest server...', pct: 10 },
                      { msg: '📥 Loading historical data...', pct: 20 },
                      { msg: '🔄 Processing price data...', pct: 35 },
                      { msg: '📊 Calculating indicators (RSI, MA, BB)...', pct: 50 },
                      { msg: '🎯 Finding entry signals...', pct: 65 },
                      { msg: '📈 Simulating trades...', pct: 80 },
                      { msg: '📋 Calculating metrics...', pct: 90 },
                    ];

                    let progressIdx = 0;
                    const progressInterval = setInterval(() => {
                      if (progressIdx < progressMessages.length) {
                        setBacktestProgress(progressMessages[progressIdx]);
                        progressIdx++;
                      }
                    }, 3000);

                    try {
                      // Build payload with strategy's RSI/EMA/BB configuration
                      const payload = {
                        strategy_name: strategy.name || 'RSI MA BB Rerun',
                        entry_conditions: strategy.config?.entry_conditions || [],
                        exit_conditions: strategy.config?.exit_conditions || [],
                        max_active_deals: 5,
                        trading_fee: 0.1,
                        base_order_size: 1000,
                        initial_balance: backtestConfig.initialCapital,
                        start_date: backtestConfig.startDate,
                        end_date: backtestConfig.endDate,
                        pairs: backtestConfig.pairs,
                        conditions_active: true,
                        price_change_active: false,
                        safety_order_toggle: false,
                        reinvest_profit: 100,
                      };

                      // Add to queue for proper execution on Contabo
                      const queueResponse = await apiFetch('/backtest/queue', {
                        method: 'POST',
                        body: {
                          payload,
                          notifyVia: 'email',
                        },
                      });

                      clearInterval(progressInterval);
                      setBacktestProgress(null);
                      setRunningBacktest(false);

                      // Show queue confirmation
                      setSuccessModal({
                        open: true,
                        type: "backtest",
                        data: {
                          position: queueResponse.queuePosition || 1,
                          wait: queueResponse.estimatedWaitMinutes || 10
                        }
                      });

                      // Clear the result to prevent showing old data
                      setBacktestResult(null);
                    } catch (e) {
                      clearInterval(progressInterval);
                      setBacktestProgress(null);
                      setBacktestResult({ status: 'error', error: e.message });
                      setRunningBacktest(false);
                    }
                  }}
                  disabled={runningBacktest || new Date(backtestConfig.endDate) <= new Date(backtestConfig.startDate)}
                >
                  {runningBacktest ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Running Backtest...
                    </>
                  ) : (
                    <>🚀 Run Backtest</>
                  )}
                </Button>

                {/* Progress Indicator */}
                {runningBacktest && backtestProgress && (
                  <div className="bg-gray-50 border-2 border-gray-200 p-4" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">{backtestProgress.stage || backtestProgress.msg}</span>
                      <span className="text-sm text-emerald-600 font-bold">{backtestProgress.percent || backtestProgress.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2" style={{ clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))' }}>
                      <div
                        className="bg-emerald-500 h-2 transition-all duration-500"
                        style={{ width: `${backtestProgress.percent || backtestProgress.pct}%`, clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px))' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Backtests typically take 30-120 seconds depending on date range and pairs selected
                    </p>
                  </div>
                )}

                {/* Results */}
                {backtestResult && (
                  <div className={`p-4 ${backtestResult.status === 'success'
                      ? 'bg-emerald-50 border-2 border-emerald-200'
                      : backtestResult.status === 'error'
                        ? 'bg-red-50 border-2 border-red-200'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`} style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                    <h4 className={`font-bold mb-2 ${backtestResult.status === 'success' ? 'text-emerald-800' :
                        backtestResult.status === 'error' ? 'text-red-800' : 'text-gray-800'
                      }`}>
                      {backtestResult.status === 'success' ? '✅ Backtest Complete' :
                        backtestResult.status === 'error' ? '❌ Error' : '📊 Results'}
                    </h4>

                    {backtestResult.error && (
                      <p className="text-red-700 text-sm">{backtestResult.error}</p>
                    )}

                    {backtestResult.metrics && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-gray-500">Net Profit</div>
                            <div className={`font-bold text-lg ${backtestResult.metrics.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {backtestResult.metrics.net_profit >= 0 ? '+' : ''}{backtestResult.metrics.net_profit?.toFixed(2)}%
                            </div>
                            {backtestResult.metrics.net_profit_usd && (
                              <div className="text-xs text-gray-400">{backtestResult.metrics.net_profit_usd}</div>
                            )}
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-gray-500">Total Trades</div>
                            <div className="font-bold text-lg">{backtestResult.metrics.total_trades}</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-gray-500">Win Rate</div>
                            <div className="font-bold text-lg">{(backtestResult.metrics.win_rate * 100)?.toFixed(1)}%</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-gray-500">Max Drawdown</div>
                            <div className="font-bold text-lg text-red-600">{backtestResult.metrics.max_drawdown?.toFixed(2)}%</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-gray-500">Sharpe Ratio</div>
                            <div className="font-bold text-lg">{backtestResult.metrics.sharpe_ratio?.toFixed(2)}</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="text-xs text-gray-500">Profit Factor</div>
                            <div className="font-bold text-lg">{typeof backtestResult.metrics.profit_factor === 'number' ? backtestResult.metrics.profit_factor.toFixed(2) : backtestResult.metrics.profit_factor}</div>
                          </div>
                        </div>

                        {/* Equity Curve */}
                        {backtestResult.chartData?.balanceHistory && backtestResult.chartData.balanceHistory.length > 0 && (
                          <div className="mt-4 p-4 bg-white rounded-lg">
                            <h5 className="font-medium mb-3">📈 Equity Curve</h5>
                            <div className="h-48 relative">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={backtestResult.chartData.balanceHistory}>
                                  <defs>
                                    <linearGradient id="rerunGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                  <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                                  <Tooltip formatter={(v) => [`$${v?.toLocaleString()}`, 'Balance']} />
                                  <Area type="monotone" dataKey="balance" stroke="#10b981" fill="url(#rerunGradient)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        {/* Recent Trades */}
                        {backtestResult.trades && backtestResult.trades.length > 0 && (
                          <div className="mt-4 p-4 bg-white rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium">📋 Latest Trades ({Math.min(showAllTrades ? backtestResult.trades.length : 20, backtestResult.trades.length)} of {backtestResult.totalTrades || backtestResult.trades.length})</h5>
                              {backtestResult.trades.length > 20 && (
                                <button
                                  onClick={() => setShowAllTrades(!showAllTrades)}
                                  className="text-sm text-emerald-600 hover:underline"
                                >
                                  {showAllTrades ? 'Show Less' : 'Show All'}
                                </button>
                              )}
                            </div>
                            <div className={`overflow-x-auto ${showAllTrades ? 'max-h-96' : 'max-h-64'} overflow-y-auto`}>
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                  <tr>
                                    <th className="text-left py-2 px-2">Date</th>
                                    <th className="text-left py-2 px-2">Pair</th>
                                    <th className="text-left py-2 px-2">Action</th>
                                    <th className="text-right py-2 px-2">Price</th>
                                    <th className="text-right py-2 px-2">P&L</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {backtestResult.trades
                                    .slice(-(showAllTrades ? backtestResult.trades.length : 20))
                                    .reverse()
                                    .map((trade, idx) => (
                                      <tr key={idx} className="border-t">
                                        <td className="py-2 px-2 text-xs">{trade.timestamp?.split(' ')[0] || trade.date}</td>
                                        <td className="py-2 px-2">{trade.symbol}</td>
                                        <td className={`py-2 px-2 font-medium ${trade.action === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                                          {trade.action}
                                        </td>
                                        <td className="py-2 px-2 text-right">${parseFloat(trade.price)?.toLocaleString()}</td>
                                        <td className={`py-2 px-2 text-right font-medium ${parseFloat(trade.profit_loss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {parseFloat(trade.profit_loss) > 0 ? '+' : ''}{parseFloat(trade.profit_loss)?.toFixed(2) || '0.00'}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {backtestResult.runTime && (
                      <p className="text-xs text-gray-500 mt-3">
                        {backtestResult.cached && <span className="text-green-600">⚡ Cached result • </span>}
                        Completed in {(backtestResult.runTime < 1 ? backtestResult.runTime : backtestResult.runTime / 1000).toFixed(1)}s
                        {backtestResult.pairsUsed && <span> • {backtestResult.pairsUsed} pairs</span>}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Start Trading */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>{t.startLiveTrading}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coming Soon for Stocks Mode */}
              {!isCryptoMode() ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border-2 border-amber-200 p-4" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold" style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
                        {language === "uk" ? "НЕЗАБАРОМ" : "COMING SOON"}
                      </span>
                    </div>
                    <p className="text-amber-800 font-medium text-sm">
                      {language === "uk" ? "Жива торгівля акціями" : "Live Stock Trading"}
                    </p>
                    <p className="text-amber-700 text-xs mt-1">
                      {language === "uk"
                        ? "Інтеграція з брокерами в розробці. Поки що ви можете використовувати бектестинг для аналізу стратегій."
                        : "Broker integration is in development. In the meantime, you can use backtesting to analyze strategies."}
                    </p>
                  </div>

                  <div className="bg-gray-50 border-2 border-gray-200 p-4" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                    <p className="text-gray-700 font-medium text-sm mb-2">
                      {language === "uk" ? "✓ Що доступно зараз:" : "✓ What's available now:"}
                    </p>
                    <ul className="text-gray-600 text-xs space-y-1">
                      <li>• {language === "uk" ? "Бектестинг з історичними даними Yahoo Finance" : "Backtesting with Yahoo Finance historical data"}</li>
                      <li>• {language === "uk" ? "Аналіз стратегій на акціях, ETF, товарах" : "Strategy analysis on stocks, ETFs, commodities"}</li>
                      <li>• {language === "uk" ? "Повний доступ до всіх індикаторів" : "Full access to all indicators"}</li>
                    </ul>
                  </div>

                  <Link href="/backtest" className="block">
                    <Button className="w-full btn-primary">
                      {language === "uk" ? "Перейти до бектесту" : "Go to Backtest"}
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-400 text-center">
                    {language === "uk"
                      ? "Для живої торгівлі криптовалютами перейдіть в режим Crypto"
                      : "For live crypto trading, switch to Crypto mode"}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    {t.connectFirst}{" "}
                    <Link href="/connect" className="text-emerald-600 underline">
                      {t.connectPage}
                    </Link>
                    {language === "uk" ? "." : " first."}
                  </p>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">{isCryptoMode() ? t.exchange : (language === "uk" ? "Брокер" : "Broker")}</label>
                    <select
                      className="w-full h-11 px-4 rounded-lg border border-gray-200"
                      value={exchange}
                      onChange={(e) => setExchange(e.target.value)}
                    >
                      {EXCHANGES.map((ex) => {
                        const isConnected = connectedExchanges.some(c => c.exchange === ex.id || c === ex.id);
                        return (
                          <option key={ex.id} value={ex.id}>
                            {ex.name} {isConnected ? `✓ ${t.connected}` : ""}
                          </option>
                        );
                      })}
                    </select>
                    {!connectedExchanges.some(c => c.exchange === exchange || c === exchange) && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{t.notConnected}</span>
                        <Link href="/connect" className="text-emerald-600 hover:underline">{t.connectNow}</Link>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">{t.tradingPair}</label>
                    <select
                      className="w-full h-11 px-4 rounded-lg border border-gray-200"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                    >
                      {AVAILABLE_PAIRS.slice(0, 10).map((pair) => (
                        <option key={pair} value={pair}>{pair}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">{t.timeframe}</label>
                    <select
                      className="w-full h-11 px-4 rounded-lg border border-gray-200"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <option value="1m">1m</option>
                      <option value="5m">5m</option>
                      <option value="15m">15m</option>
                      <option value="1h">1h</option>
                      <option value="4h">4h</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">{t.orderSize}</label>
                      <input
                        type="number"
                        className="w-full h-11 px-4 rounded-lg border border-gray-200"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        placeholder={t.perTrade}
                      />
                      <span className="text-xs text-gray-400">{t.perTrade}</span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">{t.maxRisk}</label>
                      <input
                        type="number"
                        className="w-full h-11 px-4 rounded-lg border border-gray-200"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        min="1"
                        placeholder={language === "uk" ? "Макс. втрата" : "Max loss allowed"}
                      />
                      <span className="text-xs text-gray-400">{t.closesIfLoss}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                    <p className="font-medium text-yellow-800">⚠️ {t.riskWarning}</p>
                    <p className="text-yellow-700 text-xs mt-1">
                      {t.riskWarningText} ${maxBudget || 0}{t.allPositionsClose}
                    </p>
                  </div>

                  <Button className="w-full" disabled={starting} onClick={startLive}>
                    {starting ? t.starting : t.startLive}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    {t.tradingRisk}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.quickStats}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.winRate}</span>
                <span className="font-medium">{(strategy.winRate || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.totalTrades}</span>
                <span className="font-medium">{strategy.totalTrades || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.profitFactor}</span>
                <span className="font-medium">{(strategy.profitFactor || 0).toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.maxDrawdown}</span>
                <span className="font-medium text-red-600">-{(strategy.maxDD || strategy.maxDrawdown || 0).toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  const colors = {
    emerald: "bg-emerald-500 text-white",
    black: "bg-black text-white",
    gray: "bg-gray-800 text-white",
    red: "bg-red-500 text-white",
    green: "bg-emerald-500 text-white",
    blue: "bg-black text-white",
    purple: "bg-gray-800 text-white",
  };

  return (
    <div
      className={`p-4 ${colors[color] || colors.black} shadow-lg hover:shadow-xl transition-all`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

function ConditionGroup({ title, conditions }) {
  return (
    <div>
      <h4 className="font-bold mb-3">{title}</h4>
      <div className="space-y-2">
        {conditions.map((cond, i) => (
          <div key={i} className="p-3 bg-gray-50 border-2 border-gray-100" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
            <div className="font-bold text-black">{cond.indicator}</div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              {Object.entries(cond.subfields || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500">{key}:</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
