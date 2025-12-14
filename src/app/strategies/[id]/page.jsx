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
import { apiFetch, publicFetch } from "@/lib/api";

export default function StrategyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchange, setExchange] = useState("binance");
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("1h");
  const [amount, setAmount] = useState(10); // $ per trade
  const [maxBudget, setMaxBudget] = useState(50); // Max loss before closing all
  const [starting, setStarting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [connectedExchanges, setConnectedExchanges] = useState([]);
  
  // Backtest rerun state
  const [backtestConfig, setBacktestConfig] = useState({
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    initialCapital: 10000,
    pairs: ["BTC/USDT", "ETH/USDT"], // Default to 2 most liquid pairs
  });
  const [runningBacktest, setRunningBacktest] = useState(false);
  const [backtestResult, setBacktestResult] = useState(null);
  const [backtestProgress, setBacktestProgress] = useState(null);
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(null);
  const [loadingAllTrades, setLoadingAllTrades] = useState(false);
  const [showAllStrategyTrades, setShowAllStrategyTrades] = useState(false);

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
            const transformed = {
              id: `backtest-${backtestId}`,
              name: result.name || result.strategy_name || 'Backtest Result',
              isBacktestResult: true,
              netProfit: (result.netProfit || result.net_profit || 0) * 100,
              netProfitUsd: result.netProfitUsd || result.net_profit_usd || 0,
              sharpeRatio: result.sharpeRatio || result.sharpe_ratio || 0,
              sortinoRatio: result.sortinoRatio || result.sortino_ratio || 0,
              maxDrawdown: (result.maxDrawdown || result.max_drawdown || 0) * 100,
              winRate: (result.winRate || result.win_rate || 0) * 100,
              totalTrades: result.totalTrades || result.total_trades || 0,
              profitFactor: result.profitFactor || result.profit_factor || 0,
              yearlyReturn: result.yearlyReturn || result.yearly_return || 0,
              cagr: (result.yearlyReturn || result.yearly_return || 0) * 100,
              startDate: result.startDate || result.start_date,
              endDate: result.endDate || result.end_date,
              initialBalance: result.initialBalance || result.initial_balance || 10000,
              pairs: result.pairs || [],
              history: result.chartData ? (typeof result.chartData === 'string' ? JSON.parse(result.chartData) : result.chartData) : [],
              trades: result.trades ? (typeof result.trades === 'string' ? JSON.parse(result.trades) : result.trades) : [],
              config: result.config ? (typeof result.config === 'string' ? JSON.parse(result.config) : result.config) : {},
              returns: {
                daily: ((result.yearlyReturn || 0) / 365).toFixed(3),
                weekly: ((result.yearlyReturn || 0) / 52).toFixed(2),
                monthly: ((result.yearlyReturn || 0) / 12).toFixed(1),
                yearly: (result.yearlyReturn || 0).toFixed(1),
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
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading strategy...</p>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Strategy Not Found</h2>
            <p className="text-gray-600 mb-4">The strategy you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/strategies">
              <Button>← Back to Strategies</Button>
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
      alert(`Please connect your ${exchange} account first on the Connect page.`);
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
        alert("Error: " + response.error);
        return;
      }
      
      alert(`✓ Live trading started!\n\nOrder size: $${amount}\nMax risk: $${maxBudget}\n\nGo to Dashboard to monitor.`);
      router.push("/dashboard");
    } catch (e) {
      console.error("Start trading error:", e);
      alert("Error: " + e.message);
    } finally {
      setStarting(false);
    }
  };

  const formatValue = (val, suffix = "") => {
    if (val === null || val === undefined || Number.isNaN(val)) return "—";
    return `${val}${suffix}`;
  };

  const formatSigned = (val) => {
    if (val === null || val === undefined || Number.isNaN(val)) return "—";
    const num = Number(val);
    const sign = num > 0 ? "+" : "";
    return `${sign}${num}`;
  };

  return (
    <div className="container py-8">
      {bannerMessage && (
        <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          {bannerMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/strategies" className="text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{strategy.name}</h1>
          <p className="text-gray-600">{strategy.category}</p>
        </div>
        <div className="flex gap-2">
          {strategy.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
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
            <MetricCard label="Yearly Return" value={`${formatValue(strategy.returns?.yearly || strategy.cagr, "%")}`} color="green" />
            <MetricCard label="Win Rate" value={`${formatValue(strategy.winRate, "%")}`} color="blue" />
            <MetricCard label="Sharpe Ratio" value={formatValue(strategy.sharpe)} color="purple" />
            <MetricCard label="Max Drawdown" value={`${formatValue(strategy.maxDD, "%")}`} color="red" />
          </div>

          {/* Returns Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Returns Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center mb-6">
                {[
                  { label: "Daily", val: strategy.returns?.daily },
                  { label: "Weekly", val: strategy.returns?.weekly },
                  { label: "Monthly", val: strategy.returns?.monthly },
                  { label: "Yearly", val: strategy.returns?.yearly || strategy.cagr },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {item.val !== null && item.val !== undefined ? `${formatSigned(Number(item.val))}%` : "—"}
                    </div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Yearly Performance History */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-medium text-gray-700">Historical Yearly Performance</h4>
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
                        className={`p-3 rounded-lg text-center ${
                          isPast ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                        }`}
                      >
                        <div className="text-xs text-gray-500 mb-1">{year}</div>
                        <div className={`font-bold ${
                          value === undefined || value === null
                            ? 'text-gray-400'
                            : isPositive
                              ? 'text-green-600'
                              : 'text-red-600'
                        }`}>
                          {value === undefined || value === null ? '—' : `${isPositive ? '+' : ''}${value.toFixed(1)}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Awaiting updated yearly breakdown from the latest backtest. Past performance does not guarantee future results.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 border-b">
            {["overview", "trades", "conditions", "backtest"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "backtest" ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Rerun Backtest
                  </span>
                ) : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{strategy.description}</p>
                {strategy.history && strategy.history.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={strategy.history}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(v) => [`$${v?.toLocaleString()}`, "Balance"]}
                        labelFormatter={(label) => label ? `Year ${label}` : ''}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
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
                    <div className="text-sm text-gray-500">Total Trades</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{strategy.profitFactor}x</div>
                    <div className="text-sm text-gray-500">Profit Factor</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">${strategy.minInvestment}</div>
                    <div className="text-sm text-gray-500">Min Investment</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "trades" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Backtest Trades</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {strategy.recentTrades?.length || 0} of {strategy.totalBacktestTrades || 0} trades
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
                      className="text-sm text-blue-600 hover:underline font-medium"
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
                      {strategy.recentTrades?.map((trade, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-blue-50/50 transition">
                          <td className="px-4 py-3">{trade.date}</td>
                          <td className="px-4 py-3 text-gray-500">{trade.time}</td>
                          <td className="px-4 py-3 font-medium">{trade.pair}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              trade.side === "BUY" || trade.side?.includes("Entry") 
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
                {!strategy.recentTrades?.length && (
                  <p className="text-center text-gray-500 py-4">No trades yet</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "conditions" && (
            <Card>
              <CardHeader>
                <CardTitle>Trading Conditions</CardTitle>
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
                <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded inline-flex">
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
                        className={`px-3 py-1.5 rounded-full text-sm transition ${
                          backtestConfig.startDate === preset.start && backtestConfig.endDate === preset.end
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
                        className={`px-3 py-1.5 rounded-full text-sm transition ${
                          backtestConfig.startDate === preset.start && backtestConfig.endDate === preset.end
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
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
                        className={`px-3 py-1.5 rounded-full text-sm transition ${
                          backtestConfig.initialCapital === amount
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

                {/* Trading Pairs - Max 5 pairs, 2 for long periods */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">📊 Trading Pairs (Max 5)</label>
                  {(() => {
                    // Calculate period to determine max pairs
                    const start = new Date(backtestConfig.startDate);
                    const end = new Date(backtestConfig.endDate);
                    const periodYears = (end - start) / (365 * 24 * 60 * 60 * 1000);
                    const maxPairs = periodYears > 3 ? 2 : 5;
                    const availablePairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT', 'DOT/USDT', 'LINK/USDT', 'LTC/USDT', 'NEAR/USDT', 'HBAR/USDT', 'TRX/USDT'];
                    
                    return (
                      <>
                        {periodYears > 3 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-700 mb-2">
                            ℹ️ Long period ({periodYears.toFixed(1)} years): Max 2 pairs allowed for memory efficiency
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {availablePairs.map((pair) => {
                            const isSelected = backtestConfig.pairs.includes(pair);
                            const atLimit = backtestConfig.pairs.length >= maxPairs && !isSelected;
                            return (
                              <button
                                key={pair}
                                disabled={atLimit}
                                onClick={() => {
                                  if (isSelected) {
                                    setBacktestConfig({ ...backtestConfig, pairs: backtestConfig.pairs.filter(p => p !== pair) });
                                  } else if (backtestConfig.pairs.length < maxPairs) {
                                    setBacktestConfig({ ...backtestConfig, pairs: [...backtestConfig.pairs, pair] });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm transition ${
                                  isSelected
                                    ? "bg-purple-600 text-white"
                                    : atLimit
                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {pair}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {backtestConfig.pairs.length === 0 
                            ? `Select up to ${maxPairs} pairs (max active deals will match pairs count)` 
                            : `${backtestConfig.pairs.length}/${maxPairs} pairs selected • Max active deals: ${backtestConfig.pairs.length}`}
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
                  const dataEnd = new Date('2025-12-10');
                  const pairCount = backtestConfig.pairs.length;
                  const periodYears = (end - start) / (365 * 24 * 60 * 60 * 1000);
                  const maxPairs = periodYears > 3 ? 2 : 5;
                  
                  const warnings = [];
                  if (start < dataStart) warnings.push(`Start date before available data (2023-01-01)`);
                  if (end > dataEnd) warnings.push(`End date after available data (2025-12-04)`);
                  if (end <= start) warnings.push(`End date must be after start date`);
                  if (pairCount === 0) warnings.push(`Please select at least 1 pair`);
                  if (periodYears > 3 && pairCount > 2) warnings.push(`Long period: Max 2 pairs for ${periodYears.toFixed(1)} year backtest`);
                  
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
                      alert(`✅ Backtest queued!\n\nPosition: #${queueResponse.queuePosition || 1}\nEstimated wait: ${queueResponse.estimatedWaitMinutes || 10} minutes\n\nWatch the floating monitor for live progress!\nYou'll receive an email when complete.`);

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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">{backtestProgress.stage || backtestProgress.msg}</span>
                      <span className="text-sm text-blue-600">{backtestProgress.percent || backtestProgress.pct}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${backtestProgress.percent || backtestProgress.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      ⏱️ Backtests typically take 30-120 seconds depending on date range and pairs selected
                    </p>
                  </div>
                )}

                {/* Results */}
                {backtestResult && (
                  <div className={`p-4 rounded-lg ${
                    backtestResult.status === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : backtestResult.status === 'error'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h4 className={`font-bold mb-2 ${
                      backtestResult.status === 'success' ? 'text-green-800' : 
                      backtestResult.status === 'error' ? 'text-red-800' : 'text-blue-800'
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
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{fontSize: 10}} />
                                <YAxis tick={{fontSize: 10}} domain={['auto', 'auto']} />
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
                                className="text-sm text-blue-600 hover:underline"
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
              <CardTitle>Start Live Trading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Connect your exchange on the{" "}
                <Link href="/connect" className="text-blue-600 underline">
                  Connect page
                </Link>{" "}
                first.
              </p>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Exchange</label>
                <select
                  className="w-full h-11 px-4 rounded-lg border border-gray-200"
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                >
                  {[
                    { id: "binance", name: "Binance" },
                    { id: "bybit", name: "Bybit" },
                    { id: "okx", name: "OKX" },
                    { id: "kraken", name: "Kraken" },
                    { id: "kucoin", name: "KuCoin" },
                    { id: "coinbase", name: "Coinbase Pro" },
                  ].map((ex) => {
                    const isConnected = connectedExchanges.some(c => c.exchange === ex.id || c === ex.id);
                    return (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} {isConnected ? "✓ Connected" : ""}
                      </option>
                    );
                  })}
                </select>
                {!connectedExchanges.some(c => c.exchange === exchange || c === exchange) && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Not connected.</span>
                    <Link href="/connect" className="text-blue-600 hover:underline">Connect now →</Link>
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Trading Pair</label>
                <select
                  className="w-full h-11 px-4 rounded-lg border border-gray-200"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                  <option value="BNB/USDT">BNB/USDT</option>
                  <option value="XRP/USDT">XRP/USDT</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Timeframe</label>
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
                  <label className="text-sm text-gray-600 block mb-1">Order Size ($)</label>
                  <input
                    type="number"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    placeholder="$ per trade"
                  />
                  <span className="text-xs text-gray-400">$ per trade</span>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Max Risk ($)</label>
                  <input
                    type="number"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    min="1"
                    placeholder="Max loss allowed"
                  />
                  <span className="text-xs text-gray-400">Closes all if loss exceeds</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <p className="font-medium text-yellow-800">⚠️ Risk Warning</p>
                <p className="text-yellow-700 text-xs mt-1">
                  This trades REAL money. If unrealized loss reaches ${maxBudget || 0}, all positions close automatically.
                </p>
              </div>

              <Button className="w-full" disabled={starting} onClick={startLive}>
                {starting ? "Starting..." : "🚀 Start Live Trading"}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Trading involves risk. Only trade with money you can afford to lose.
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Win Rate</span>
                <span className="font-medium">{strategy.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Trades</span>
                <span className="font-medium">{strategy.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Profit Factor</span>
                <span className="font-medium">{strategy.profitFactor}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Max Drawdown</span>
                <span className="font-medium text-red-600">-{strategy.maxDD}%</span>
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
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color] || colors.blue}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-75">{label}</div>
    </div>
  );
}

function ConditionGroup({ title, conditions }) {
  return (
    <div>
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="space-y-2">
        {conditions.map((cond, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-blue-600">{cond.indicator}</div>
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

