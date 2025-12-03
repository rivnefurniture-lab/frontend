"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
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

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [strategies, setStrategies] = useState([]);
  const [runningStrategies, setRunningStrategies] = useState([]);
  const [backtestResults, setBacktestResults] = useState([]);
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
      
      // Load all data in parallel
      const [strategiesRes, runningRes, backtestsRes] = await Promise.allSettled([
        apiFetch("/strategies/my"),
        apiFetch("/strategies/running"),
        apiFetch("/backtest/results"),
      ]);

      if (strategiesRes.status === "fulfilled") {
        setStrategies(strategiesRes.value || []);
      }
      if (runningRes.status === "fulfilled") {
        setRunningStrategies(runningRes.value || []);
      }
      if (backtestsRes.status === "fulfilled") {
        setBacktestResults(backtestsRes.value || []);
      }
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
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalProfit = runningStrategies.reduce((sum, r) => sum + (r.totalProfit || 0), 0);
  const totalTrades = runningStrategies.reduce((sum, r) => sum + (r.totalTrades || 0), 0);
  const winRate = totalTrades > 0 
    ? (runningStrategies.reduce((sum, r) => sum + (r.winningTrades || 0), 0) / totalTrades * 100).toFixed(1)
    : 0;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name || user.email}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/connect">
            <Button variant="outline">
              {exchangeConnected ? "✓ Exchange Connected" : "Connect Exchange"}
            </Button>
          </Link>
          <Link href="/backtest">
            <Button>New Strategy</Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Active Strategies</p>
            <p className="text-3xl font-bold">{runningStrategies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Profit</p>
            <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Trades</p>
            <p className="text-3xl font-bold">{totalTrades}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Win Rate</p>
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
                <span>🚀 Running Strategies</span>
                <span className="text-sm font-normal text-gray-500">
                  {runningStrategies.length} active
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {runningStrategies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No strategies running</p>
                  <Link href="/backtest">
                    <Button>Create Your First Strategy</Button>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            run.status === 'running' ? 'bg-green-100 text-green-700' :
                            run.status === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {run.isLive ? '🟢 Live' : run.status}
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
                          <div className="space-y-1">
                            {run.trades.slice(0, 3).map((trade, i) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span className={trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}>
                                  {trade.side.toUpperCase()} {trade.symbol}
                                </span>
                                <span>${trade.amount?.toFixed(2)}</span>
                                <span className="text-gray-500">
                                  {new Date(trade.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            ))}
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
              <CardTitle>📁 Saved Strategies</CardTitle>
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
                <span>📊 Recent Backtests</span>
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
                    <div
                      key={result.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{result.strategy_name}</h4>
                        <span className={`text-sm font-medium ${
                          result.net_profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.net_profit >= 0 ? '+' : ''}{result.net_profit?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="block">Sharpe</span>
                          <span className="text-gray-900">{result.sharpe_ratio?.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block">Max DD</span>
                          <span className="text-gray-900">{result.max_drawdown?.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="block">Win Rate</span>
                          <span className="text-gray-900">{result.win_rate?.toFixed(0)}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(result.timestamp_run).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/backtest" className="block">
                <Button className="w-full" variant="outline">
                  📊 Create New Strategy
                </Button>
              </Link>
              <Link href="/connect" className="block">
                <Button className="w-full" variant="outline">
                  🔗 Connect Exchange
                </Button>
              </Link>
              <Link href="/strategies" className="block">
                <Button className="w-full" variant="outline">
                  📚 Browse Strategies
                </Button>
              </Link>
              <Link href="/pricing" className="block">
                <Button className="w-full" variant="outline">
                  💎 Upgrade Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
