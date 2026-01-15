"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function TradesPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30d");

  const t = {
    title: language === "uk" ? "Історія угод" : "Trade History",
    subtitle: language === "uk" 
      ? "Моніторинг усіх ваших угод в реальному часі" 
      : "Monitor all your trades in real-time",
    all: language === "uk" ? "Всі" : "All",
    buy: language === "uk" ? "Купівля" : "Buy",
    sell: language === "uk" ? "Продаж" : "Sell",
    profitable: language === "uk" ? "Прибуткові" : "Profitable",
    loss: language === "uk" ? "Збиткові" : "Loss",
    today: language === "uk" ? "Сьогодні" : "Today",
    week: language === "uk" ? "Тиждень" : "7 Days",
    month: language === "uk" ? "Місяць" : "30 Days",
    allTime: language === "uk" ? "Весь час" : "All Time",
    noTrades: language === "uk" ? "Ще немає угод" : "No trades yet",
    startTrading: language === "uk" 
      ? "Підключіть біржу та запустіть стратегію, щоб почати торгувати" 
      : "Connect an exchange and start a strategy to begin trading",
    connectExchange: language === "uk" ? "Підключити біржу" : "Connect Exchange",
    loading: language === "uk" ? "Завантаження..." : "Loading...",
    symbol: language === "uk" ? "Пара" : "Pair",
    side: language === "uk" ? "Тип" : "Type",
    price: language === "uk" ? "Ціна" : "Price",
    quantity: language === "uk" ? "Кількість" : "Quantity",
    total: language === "uk" ? "Сума" : "Total",
    pnl: language === "uk" ? "П/З" : "P&L",
    date: language === "uk" ? "Дата" : "Date",
    strategy: language === "uk" ? "Стратегія" : "Strategy",
    status: language === "uk" ? "Статус" : "Status",
    executed: language === "uk" ? "Виконано" : "Executed",
    pending: language === "uk" ? "Очікує" : "Pending",
    cancelled: language === "uk" ? "Скасовано" : "Cancelled",
    totalTrades: language === "uk" ? "Всього угод" : "Total Trades",
    totalProfit: language === "uk" ? "Загальний прибуток" : "Total Profit",
    winRate: language === "uk" ? "Відсоток виграшу" : "Win Rate",
    avgProfit: language === "uk" ? "Середній прибуток" : "Avg Profit",
    export: language === "uk" ? "Експорт CSV" : "Export CSV",
    loginRequired: language === "uk" ? "Потрібна авторизація" : "Login Required",
    loginText: language === "uk" 
      ? "Увійдіть, щоб переглянути історію угод" 
      : "Please log in to view your trade history",
  };

  useEffect(() => {
    if (!authLoading && !user) {
      return;
    }
    if (user) {
      fetchTrades();
    }
  }, [user, authLoading, filter, dateRange]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const result = await apiFetch(`/trades?filter=${filter}&range=${dateRange}`);
      setTrades(result || []);
    } catch (e) {
      console.error("Failed to fetch trades:", e);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (trades.length === 0) return;
    
    const headers = ["Date", "Symbol", "Side", "Price", "Quantity", "Total", "P&L", "Status"];
    const rows = trades.map(t => [
      new Date(t.createdAt).toISOString(),
      t.symbol,
      t.side,
      t.price,
      t.quantity,
      t.amount,
      t.profitLoss || 0,
      t.status
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trades_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Calculate stats
  const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
  const winningTrades = trades.filter(t => (t.profitLoss || 0) > 0).length;
  const winRate = trades.length > 0 ? ((winningTrades / trades.length) * 100).toFixed(1) : 0;
  const avgProfit = trades.length > 0 ? (totalProfit / trades.length).toFixed(2) : 0;

  if (!authLoading && !user) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-2">{t.loginRequired}</h2>
              <p className="text-gray-600 mb-6">{t.loginText}</p>
              <Link href="/auth">
                <Button className="w-full">{language === "uk" ? "Увійти" : "Login"}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <Button onClick={exportCSV} variant="outline" disabled={trades.length === 0}>
          📥 {t.export}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{t.totalTrades}</p>
            <p className="text-3xl font-bold">{trades.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{t.totalProfit}</p>
            <p className={`text-3xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{t.winRate}</p>
            <p className="text-3xl font-bold">{winRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">{t.avgProfit}</p>
            <p className={`text-3xl font-bold ${Number(avgProfit) >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${avgProfit}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {["all", "buy", "sell", "profitable", "loss"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}
            >
              {t[f] || f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {[
            { key: "1d", label: t.today },
            { key: "7d", label: t.week },
            { key: "30d", label: t.month },
            { key: "all", label: t.allTime },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setDateRange(r.key)}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                dateRange === r.key
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trades Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">{t.loading}</p>
            </div>
          ) : trades.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">{t.noTrades}</h3>
              <p className="text-gray-600 mb-6">{t.startTrading}</p>
              <Link href="/connect">
                <Button>{t.connectExchange}</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-4 font-medium">{t.date}</th>
                    <th className="p-4 font-medium">{t.symbol}</th>
                    <th className="p-4 font-medium">{t.side}</th>
                    <th className="p-4 font-medium">{t.price}</th>
                    <th className="p-4 font-medium">{t.quantity}</th>
                    <th className="p-4 font-medium">{t.total}</th>
                    <th className="p-4 font-medium">{t.pnl}</th>
                    <th className="p-4 font-medium">{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-sm">
                        {new Date(trade.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-gray-500 text-xs">
                          {new Date(trade.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{trade.symbol}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.side === "buy" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {trade.side === "buy" ? t.buy : t.sell}
                        </span>
                      </td>
                      <td className="p-4">${trade.price?.toFixed(2)}</td>
                      <td className="p-4">{trade.quantity?.toFixed(6)}</td>
                      <td className="p-4">${trade.amount?.toFixed(2)}</td>
                      <td className={`p-4 font-medium ${
                        (trade.profitLoss || 0) >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {(trade.profitLoss || 0) >= 0 ? "+" : ""}{trade.profitLoss?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.status === "executed" 
                            ? "bg-green-100 text-green-700" 
                            : trade.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {trade.status === "executed" ? t.executed : 
                           trade.status === "pending" ? t.pending : t.cancelled}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

