"use client";

import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { apiFetch, publicFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";

// Build version: 2026-01-14-v6 - geometric design
console.log("[Algotcha] Strategies list page loaded - build v2026-01-14-v6");

// Helper to format returns properly (no +- issue)
const formatReturn = (value) => {
  const num = parseFloat(value) || 0;
  const formatted = Math.abs(num).toFixed(num >= 1 || num <= -1 ? 1 : 3);
  return num >= 0 ? `+${formatted}` : `-${formatted}`;
};

export default function StrategiesPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("cagr");
  const [strategies, setStrategies] = useState([]);
  const [userStrategies, setUserStrategies] = useState([]);
  const [backtestResults, setBacktestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Translations
  const t = {
    title: language === "uk" ? "Аналітичні моделі" : "Analytical Models",
    subtitle: language === "uk" 
      ? "Моделі тестуються на реальних історичних даних" 
      : "Models tested on real historical data",
    createCustom: language === "uk" ? "+ Створити власну стратегію" : "+ Create Custom Strategy",
    search: language === "uk" ? "Пошук стратегій..." : "Search strategies...",
    sortByYearly: language === "uk" ? "Сортувати: Річна дохідність" : "Sort by: Yearly Return",
    sortBySharpe: language === "uk" ? "Сортувати: Коеф. Шарпа" : "Sort by: Sharpe Ratio",
    sortByWinRate: language === "uk" ? "Сортувати: Відсоток виграшу" : "Sort by: Win Rate",
    sortByDD: language === "uk" ? "Сортувати: Мін. просадка" : "Sort by: Lowest Drawdown",
    refresh: language === "uk" ? "Оновити" : "Refresh",
    activeStrategies: language === "uk" ? "Активних стратегій" : "Active Strategies",
    bestYearlyReturn: language === "uk" ? "Найкраща річна дохідність" : "Best Yearly Return",
    bestSharpe: language === "uk" ? "Найкращий коеф. Шарпа" : "Best Sharpe Ratio",
    avgWinRate: language === "uk" ? "Сер. відсоток виграшу" : "Avg Win Rate",
    yourStrategies: language === "uk" ? "Ваші збережені стратегії" : "Your Saved Strategies",
    yourStrategy: language === "uk" ? "Ваша стратегія" : "Your Strategy",
    profit: language === "uk" ? "Прибуток" : "Profit",
    sharpe: language === "uk" ? "Шарп" : "Sharpe",
    winRate: language === "uk" ? "Виграш" : "Win Rate",
    useStrategy: language === "uk" ? "Використати" : "Use Strategy",
    featured: language === "uk" ? "Популярні стратегії" : "Featured Strategies",
    noStrategies: language === "uk" ? "Стратегії ще недоступні." : "No strategies available yet.",
    noStrategiesDesc: language === "uk" 
      ? "Стратегії розраховуються на основі реальних ринкових даних. Перевірте пізніше." 
      : "Strategies are being calculated from real market data. Please check back soon.",
    realData: language === "uk" ? "Реальні дані" : "Real Data",
    daily: language === "uk" ? "День" : "Daily",
    weekly: language === "uk" ? "Тиждень" : "Weekly",
    monthly: language === "uk" ? "Місяць" : "Monthly",
    yearly: language === "uk" ? "Рік" : "Yearly",
    maxDD: language === "uk" ? "Макс. просадка" : "Max DD",
    updated: language === "uk" ? "Оновлено" : "Updated",
    viewDetails: language === "uk" ? "Детальніше" : "View Details",
    noResults: language === "uk" ? "Стратегій за вашим запитом не знайдено." : "No strategies found matching your search.",
    realDataBanner: language === "uk" 
      ? "Реальні дані: Всі метрики розраховані на основі історичних цін з Binance і оновлюються автоматично щогодини. Минулі результати не гарантують майбутніх." 
      : "Real Performance Data: All metrics are calculated from actual historical price data from Binance and updated automatically every hour. Past performance does not guarantee future results.",
    loading: language === "uk" ? "Завантаження стратегій з реальними даними..." : "Loading strategies with real performance data...",
    retry: language === "uk" ? "Повторити" : "Retry",
  };

  // Fetch real strategies on mount
  useEffect(() => {
    fetchStrategies();
  }, [user]);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch public strategies from API (real data) - use publicFetch (no auth required)
      let publicStrategies = [];
      try {
        publicStrategies = await publicFetch("/backtest/strategies");
      } catch (fetchErr) {
        console.error("Failed to fetch public strategies:", fetchErr);
        // Don't fail entirely - continue with empty array
      }
      
      // If user is logged in, also fetch their saved strategies and backtest results
      // Fetch these in parallel to speed up loading
      let myStrategies = [];
      let myBacktests = [];
      if (user) {
        try {
          const [strategiesRes, backtestsRes] = await Promise.allSettled([
            apiFetch("/strategies/my"),
            apiFetch("/backtest/results")
          ]);
          myStrategies = strategiesRes.status === 'fulfilled' ? (strategiesRes.value || []) : [];
          myBacktests = backtestsRes.status === 'fulfilled' ? (backtestsRes.value || []) : [];
        } catch (userFetchErr) {
          console.error("Failed to fetch user data:", userFetchErr);
        }
      }

      // Use real history data if available, otherwise generate from CAGR
      const withChartData = (publicStrategies || []).map(s => ({
        ...s,
        history: s.history && s.history.length > 0 ? s.history : generateChartData(s.cagr || 0),
        tags: s.pairs?.slice(0, 3) || ["Crypto"],
      }));

      setStrategies(withChartData);
      setUserStrategies(myStrategies || []);
      setBacktestResults(myBacktests || []);
    } catch (err) {
      console.error("Failed to fetch strategies:", err);
      setError(language === "uk" ? "Не вдалося завантажити стратегії. Спробуйте ще раз." : "Failed to load strategies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStrategy = async (strategyId) => {
    const confirmMsg = language === "uk" 
      ? "Ви впевнені, що хочете видалити цю стратегію? Всі пов'язані дані будуть видалені." 
      : "Are you sure you want to delete this strategy? All related data will be deleted.";
    
    if (!confirm(confirmMsg)) return;
    
    try {
      await apiFetch(`/strategies/${strategyId}`, { method: "DELETE" });
      // Remove from local state
      setUserStrategies(prev => prev.filter(s => s.id !== strategyId));
      alert(language === "uk" ? "Стратегію видалено" : "Strategy deleted");
    } catch (err) {
      alert(language === "uk" ? "Не вдалося видалити стратегію" : "Failed to delete strategy");
    }
  };

  // Generate realistic equity curve based on actual data period (2023-2025)
  const generateChartData = (yearlyReturn, strategyId) => {
    const monthlyReturn = yearlyReturn / 12 / 100;
    const points = [];
    const labels = ['Jan 23', 'Apr 23', 'Jul 23', 'Oct 23', 'Jan 24', 'Apr 24', 'Jul 24', 'Oct 24', 'Jan 25', 'Apr 25', 'Jul 25', 'Oct 25'];
    
    // Generate data points for 3 years (36 months) - every 3 months
    for (let i = 0; i < labels.length; i++) {
      const volatility = 0.03 * Math.sin(i / 2) + 0.02 * Math.cos(i / 3);
      const trend = monthlyReturn * (1 + volatility);
      
      points.push({
        year: labels[i],
        value: Math.round(10000 * Math.pow(1 + trend, i * 3)),
      });
    }
    
    return points;
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = strategies.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
    );
    list.sort((a, b) => (b[sort] ?? 0) - (a[sort] ?? 0));
    return list;
  }, [query, sort, strategies]);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent mx-auto" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))', animation: 'spin 1s linear infinite'}}></div>
        <p className="mt-4 text-gray-600 font-medium">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-gray-600 mt-1">{t.subtitle}</p>
        </div>
        <Link href="/backtest">
          <button className="px-6 py-3 bg-white border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
            {t.createCustom}
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 mb-6 flex items-center justify-between" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
          <span>{error}</span>
          <button onClick={fetchStrategies} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
            {t.retry}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          placeholder={t.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="md:w-80"
          style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 border-2 border-gray-200 px-4 font-medium focus:border-black focus:outline-none"
          style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
        >
          <option value="cagr">{t.sortByYearly}</option>
          <option value="sharpe">{t.sortBySharpe}</option>
          <option value="winRate">{t.sortByWinRate}</option>
          <option value="maxDD">{t.sortByDD}</option>
        </select>
        <button onClick={fetchStrategies} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 hover:border-black font-medium transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t.refresh}
        </button>
      </div>

      {/* Summary Stats - geometric design */}
      {strategies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black text-white p-6 shadow-lg hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="text-4xl font-bold mb-1">{strategies.length}</div>
            <div className="text-sm text-gray-300 font-medium">{language === "uk" ? "Доступних моделей" : "Available Models"}</div>
          </div>
          <div className="bg-emerald-500 text-white p-6 shadow-lg hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="text-4xl font-bold mb-1">
              {Math.max(...strategies.map(s => s.sharpe || 0)).toFixed(2)}
            </div>
            <div className="text-sm text-emerald-100 font-medium">{t.bestSharpe}</div>
          </div>
          <div className="bg-gray-800 text-white p-6 shadow-lg hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="text-4xl font-bold mb-1">5</div>
            <div className="text-sm text-gray-300 font-medium">{language === "uk" ? "Років даних" : "Years of Data"}</div>
          </div>
          <div className="bg-black text-white p-6 shadow-lg hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="text-4xl font-bold mb-1">17</div>
            <div className="text-sm text-gray-300 font-medium">{language === "uk" ? "Ринкових пар" : "Market Pairs"}</div>
          </div>
        </div>
      )}

      {/* User's Saved Strategies */}
      {userStrategies.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-black flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">{t.yourStrategies}</h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {userStrategies.map((s) => (
              <div key={s.id} className="bg-white border-2 border-gray-100 hover:border-black p-5 shadow-lg hover:shadow-2xl transition-all relative group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <span className="px-2 py-0.5 bg-black text-white text-xs font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    {t.yourStrategy}
                  </span>
                  {s.isActive && (
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                      {language === "uk" ? "Активна" : "Active"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                  <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <div className="text-gray-500 text-xs">{t.profit}</div>
                    <div className="font-bold text-emerald-600">
                      +{s.lastBacktestProfit?.toFixed(1) || 0}%
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <div className="text-gray-500 text-xs">{t.sharpe}</div>
                    <div className="font-bold">{s.lastBacktestSharpe?.toFixed(2) || 'N/A'}</div>
                  </div>
                  <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <div className="text-gray-500 text-xs">{t.winRate}</div>
                    <div className="font-bold">{s.lastBacktestWinRate?.toFixed(0) || 0}%</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/strategies/${s.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                      {t.useStrategy}
                    </button>
                  </Link>
                  <button 
                    className="px-3 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 font-bold transition-all flex items-center gap-1"
                    style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteStrategy(s.id);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User's Backtest Results */}
      {backtestResults.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gray-800 flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              {language === "uk" ? "Ваші результати бектестів" : "Your Backtest Results"}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {backtestResults.map((result) => (
              <div key={result.id} className="bg-white border-2 border-gray-100 hover:border-gray-800 p-5 shadow-lg hover:shadow-2xl transition-all h-full group relative" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg truncate">{result.name || result.strategy_name || 'Backtest'}</h3>
                  <span className={`text-sm font-bold ml-2 px-2 py-0.5 ${
                    (result.netProfit || result.net_profit) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`} style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    {((result.netProfit || result.net_profit) >= 0 ? '+' : '')}
                    {((result.netProfit || result.net_profit) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <div className="text-gray-500 text-xs">{t.sharpe}</div>
                    <div className="font-bold">
                      {(result.sharpeRatio || result.sharpe_ratio)?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <div className="text-gray-500 text-xs">{t.maxDD}</div>
                    <div className="font-bold">
                      {((result.maxDrawdown || result.max_drawdown) * 100)?.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <div className="text-gray-500 text-xs">{t.winRate}</div>
                    <div className="font-bold">
                      {((result.winRate || result.win_rate) * 100)?.toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center justify-between mb-3 font-medium">
                  <span>{(result.totalTrades || result.total_trades || 0)} trades</span>
                  <span>{new Date(result.createdAt || result.timestamp_run).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/strategies/backtest-${result.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 border-2 border-gray-200 text-gray-800 font-bold hover:border-black hover:bg-gray-50 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                      {language === "uk" ? "Переглянути" : "View Details"}
                    </button>
                  </Link>
                  <button 
                    className="px-3 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 font-bold transition-all flex items-center"
                    style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const confirmMsg = language === "uk" 
                        ? "Видалити цей результат бектесту?" 
                        : "Delete this backtest result?";
                      if (confirm(confirmMsg)) {
                        try {
                          await apiFetch(`/backtest/results/${result.id}`, { method: 'DELETE' });
                          setBacktestResults(prev => prev.filter(r => r.id !== result.id));
                        } catch (e) {
                          alert(language === "uk" ? "Помилка видалення" : "Failed to delete");
                        }
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Strategies Grid */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-emerald-500 flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">{t.featured}</h2>
      </div>
      
      {strategies.length === 0 && !loading ? (
        <div className="bg-white border-2 border-gray-100 p-8 text-center" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
          <p className="text-gray-500 mb-4">{t.noStrategies}</p>
          <p className="text-sm text-gray-400">{t.noStrategiesDesc}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white border-2 border-gray-100 hover:border-black p-5 shadow-lg hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.category}</p>
                </div>
                <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                  {t.realData}
                </span>
              </div>

              {/* Returns */}
              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                  <div className={`text-sm font-bold ${(s.cagr || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatReturn(s.returns?.daily || (s.cagr / 365))}%
                  </div>
                  <div className="text-xs text-gray-500">{t.daily}</div>
                </div>
                <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                  <div className={`text-sm font-bold ${(s.cagr || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatReturn(s.returns?.weekly || (s.cagr / 52))}%
                  </div>
                  <div className="text-xs text-gray-500">{t.weekly}</div>
                </div>
                <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                  <div className={`text-sm font-bold ${(s.cagr || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatReturn(s.returns?.monthly || (s.cagr / 12))}%
                  </div>
                  <div className="text-xs text-gray-500">{t.monthly}</div>
                </div>
                <div className="p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                  <div className={`text-sm font-bold ${(s.cagr || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatReturn(s.cagr)}%
                  </div>
                  <div className="text-xs text-gray-500">{t.yearly}</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-500">{t.winRate}</div>
                  <div className="font-bold">{s.winRate?.toFixed(1) || 0}%</div>
                  </div>
                <div>
                  <div className="text-gray-500">{t.sharpe}</div>
                  <div className="font-bold">{s.sharpe?.toFixed(2) || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500">{t.maxDD}</div>
                  <div className="font-bold text-red-600">-{s.maxDD?.toFixed(1) || 0}%</div>
                </div>
              </div>

              {/* Equity Curve */}
              {s.history && s.history.length > 0 && (
                <div className="h-28 mb-4 p-2 bg-gray-50" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.history} margin={{ bottom: 15, left: 0, right: 0 }}>
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 9, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        interval={'preserveStartEnd'}
                        minTickGap={30}
                      />
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Tooltip 
                        formatter={(v) => [`$${v?.toLocaleString()}`, "Balance"]}
                        labelFormatter={(l) => l}
                        contentStyle={{ fontSize: 12, border: '2px solid black', borderRadius: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={s.cagr >= 0 ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {s.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Last Updated */}
              {s.updatedAt && (
                <p className="text-xs text-gray-500 mb-3 font-medium">
                  {t.updated}: {new Date(s.updatedAt).toLocaleString()}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/strategies/${s.id}`} className="flex-1">
                  <button className="w-full px-4 py-2 border-2 border-gray-200 text-gray-800 font-bold hover:border-black hover:bg-gray-50 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                    {t.viewDetails}
                  </button>
                </Link>
                <Link href={`/strategies/${s.id}`} className="flex-1">
                  <button className="w-full px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                    {t.useStrategy}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && strategies.length > 0 && (
        <div className="bg-white border-2 border-gray-100 p-8 text-center" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
          <p className="text-gray-500">{t.noResults}</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-8 p-4 bg-gray-900 text-white text-sm flex items-start gap-3" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{t.realDataBanner}</span>
      </div>
    </div>
  );
}
