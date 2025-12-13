"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";
import { Zap, BarChart3, Link2, BookOpen, Sparkles, Folder } from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  
  // Translations
  const t = {
    title: language === "uk" ? "Панель управління" : "Dashboard",
    welcome: language === "uk" ? "З поверненням" : "Welcome back",
    portfolioValue: language === "uk" ? "Вартість портфеля" : "Portfolio Value",
    todayPnL: language === "uk" ? "Сьогоднішній P&L" : "Today's P&L",
    activeStrategies: language === "uk" ? "Активних стратегій" : "Active Strategies",
    totalTrades: language === "uk" ? "Всього угод" : "Total Trades",
    myStrategies: language === "uk" ? "Мої стратегії" : "My Strategies",
    savedStrategies: language === "uk" ? "Збережені стратегії" : "Saved Strategies",
    runningStrategies: language === "uk" ? "Запущені стратегії" : "Running Strategies",
    recentBacktests: language === "uk" ? "Останні бектести" : "Recent Backtests",
    noStrategies: language === "uk" ? "Немає збережених стратегій" : "No saved strategies yet",
    createNew: language === "uk" ? "Створити нову стратегію" : "Create your first strategy",
    goToBacktest: language === "uk" ? "Перейти до бектестера" : "Go to Backtester",
    start: language === "uk" ? "Запустити" : "Start",
    stop: language === "uk" ? "Зупинити" : "Stop",
    delete: language === "uk" ? "Видалити" : "Delete",
    running: language === "uk" ? "Працює" : "Running",
    profit: language === "uk" ? "Прибуток" : "Profit",
    trades: language === "uk" ? "Угод" : "Trades",
    sharpe: language === "uk" ? "Шарп" : "Sharpe",
    loading: language === "uk" ? "Завантаження..." : "Loading...",
    noRunning: language === "uk" ? "Немає запущених стратегій" : "No running strategies",
    noBacktests: language === "uk" ? "Немає бектестів" : "No backtests yet",
    connectExchange: language === "uk" ? "Підключити біржу" : "Connect Exchange",
    viewDetails: language === "uk" ? "Детальніше" : "View Details",
    performance: language === "uk" ? "Показники" : "Performance",
    quickActions: language === "uk" ? "Швидкі дії" : "Quick Actions",
    newBacktest: language === "uk" ? "Новий бектест" : "New Backtest",
    browseStrategies: language === "uk" ? "Переглянути стратегії" : "Browse Strategies",
  };

  const [strategies, setStrategies] = useState([]);
  const [runningStrategies, setRunningStrategies] = useState([]);
  const [backtestResults, setBacktestResults] = useState([]);
  const [tradeStats, setTradeStats] = useState({ totalTrades: 0, totalProfit: 0, winningTrades: 0, winRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeConnected, setExchangeConnected] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Helper to add timeout to fetch
      const fetchWithTimeout = (url, timeout = 10000) => {
        return Promise.race([
          apiFetch(url),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]).catch(err => {
          console.log(`${url} error:`, err.message);
          return [];
        });
      };
      
      // Load all data in parallel with timeouts
      const [strategiesRes, runningRes, backtestsRes, statsRes] = await Promise.all([
        fetchWithTimeout("/strategies/my"),
        fetchWithTimeout("/strategies/running"),
        fetchWithTimeout("/backtest/results"),
        fetchWithTimeout("/trades/stats"),
      ]);

      setStrategies(Array.isArray(strategiesRes) ? strategiesRes : []);
      setRunningStrategies(Array.isArray(runningRes) ? runningRes : []);
      setBacktestResults(Array.isArray(backtestsRes) ? backtestsRes : []);
      setTradeStats(statsRes || { totalTrades: 0, totalProfit: 0, winningTrades: 0, winRate: 0 });
    } catch (e) {
      console.error("Dashboard load error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const startStrategy = async (strategyId) => {
    try {
      const result = await apiFetch(`/strategies/${strategyId}/start`, {
        method: "POST",
        body: JSON.stringify({ initialBalance: 5000 }),
      });
      
      if (result.error) {
        alert(result.error);
      } else {
        alert("Strategy started!");
        loadDashboardData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const stopStrategy = async (runId) => {
    try {
      await apiFetch(`/strategies/runs/${runId}/stop`, { method: "POST" });
      alert("Strategy stopped");
      loadDashboardData();
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteStrategy = async (strategyId) => {
    if (!confirm("Are you sure you want to delete this strategy?")) return;
    
    try {
      await apiFetch(`/strategies/${strategyId}`, { method: "DELETE" });
      loadDashboardData();
    } catch (e) {
      alert(e.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">{t.loading}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Use trade stats from all trades (not just running strategies)
  const totalProfit = tradeStats.totalProfit || 0;
  const totalTrades = tradeStats.totalTrades || 0;
  const winRate = tradeStats.winRate?.toFixed(1) || 0;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-gray-600">{t.welcome}, {user.name || user.email}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/connect">
            <Button variant="outline" className="flex items-center gap-2">
              {exchangeConnected ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {t.connectExchange}
            </Button>
          </Link>
          <Link href="/backtest">
            <Button className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.newBacktest}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{t.activeStrategies}</p>
            <p className="text-3xl font-bold">{runningStrategies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{t.profit}</p>
            <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{t.totalTrades}</p>
            <p className="text-3xl font-bold">{totalTrades}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{language === "uk" ? "Виграш" : "Win Rate"}</p>
            <p className="text-3xl font-bold">{winRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Running Strategies */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t.runningStrategies}
                </span>
                <span className="text-sm font-normal text-gray-500">
                  {runningStrategies.length} active
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {runningStrategies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">{t.noRunning}</p>
                  <Link href="/backtest">
                    <Button>{t.newBacktest}</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {runningStrategies.map((run) => (
                    <div
                      key={run.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{run.strategy?.name || 'Strategy'}</h4>
                          <p className="text-sm text-gray-500">
                            {run.pairs?.length || 0} pairs • Started {new Date(run.startedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                            run.status === 'running' ? 'bg-green-100 text-green-700' :
                            run.status === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {run.isLive && (
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            )}
                            {run.isLive ? 'Live' : run.status}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => stopStrategy(run.id)}
                          >
                            Stop
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Balance</p>
                          <p className="font-medium">${run.currentBalance?.toFixed(2) || run.initialBalance}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Profit</p>
                          <p className={`font-medium ${(run.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${(run.totalProfit || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Trades</p>
                          <p className="font-medium">{run.totalTrades || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Win Rate</p>
                          <p className="font-medium">
                            {run.totalTrades > 0 
                              ? ((run.winningTrades / run.totalTrades) * 100).toFixed(0) 
                              : 0}%
                          </p>
                        </div>
                      </div>

                      {/* Recent trades */}
                      {run.trades?.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-gray-500 mb-2">Recent Trades</p>
                          <div className="space-y-2">
                            {run.trades.slice(0, 3).map((trade, i) => {
                              const baseAsset = trade.symbol?.split('/')[0] || 'BTC';
                              return (
                                <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                                      trade.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                      {trade.side?.toUpperCase()}
                                    </span>
                                    <span className="font-medium">{trade.symbol}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-right">
                                    <div>
                                      <div className="text-gray-500">Price</div>
                                      <div className="font-medium">${trade.price?.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-500">{baseAsset}</div>
                                      <div className="font-medium">{trade.quantity?.toFixed(6)}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-500">USDT</div>
                                      <div className="font-medium">${(trade.price * trade.quantity)?.toFixed(2)}</div>
                                    </div>
                                    <div className="text-gray-400 text-[10px]">
                                      {new Date(trade.createdAt).toLocaleTimeString()}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-600" />
                Saved Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {strategies.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>No saved strategies yet</p>
                  <p className="text-sm">Run a backtest and save it as a strategy</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{strategy.name}</h4>
                        <p className="text-sm text-gray-500">
                          {strategy.lastBacktestProfit?.toFixed(1)}% profit • 
                          Sharpe {strategy.lastBacktestSharpe?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {strategy.isActive ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Running
                          </span>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => startStrategy(strategy.id)}
                          >
                            Start
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteStrategy(strategy.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Backtest Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Recent Backtests
                </span>
                <Link href="/backtest" className="text-sm text-blue-600 hover:underline">
                  Run New
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {backtestResults.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>No backtests yet</p>
                  <Link href="/backtest">
                    <Button size="sm" className="mt-2">Run Backtest</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {backtestResults.slice(0, 5).map((result) => (
                    <Link 
                      key={result.id} 
                      href={`/strategies/backtest-${result.id}`}
                      className="block"
                    >
                      <div className="p-3 border rounded-lg hover:bg-gray-50 hover:border-blue-300 transition cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{result.strategy_name || result.name}</h4>
                          <span className={`text-sm font-medium ${
                            result.net_profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.net_profit >= 0 ? '+' : ''}{(result.net_profit * 100)?.toFixed(1)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                          <div>
                            <span className="block">Sharpe</span>
                            <span className="text-gray-900">{result.sharpe_ratio?.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="block">Max DD</span>
                            <span className="text-gray-900">{(result.max_drawdown * 100)?.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="block">Win Rate</span>
                            <span className="text-gray-900">{(result.win_rate * 100)?.toFixed(0)}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(result.createdAt || result.timestamp_run).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/backtest" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Create New Strategy
                </Button>
              </Link>
              <Link href="/connect" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect Exchange
                </Button>
              </Link>
              <Link href="/strategies" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Strategies
                </Button>
              </Link>
              <Link href="/pricing" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
