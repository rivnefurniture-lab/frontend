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
import { apiFetch } from "@/lib/api";

export default function BacktestResultPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [trades, setTrades] = useState([]);
  const [showAllTrades, setShowAllTrades] = useState(false);

  useEffect(() => {
    fetchBacktestResult();
  }, [params.id]);

  const fetchBacktestResult = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract backtest ID from params (format: "backtest-123")
      const backtestId = params.id.replace('backtest-', '');
      
      // Fetch backtest result from API
      const data = await apiFetch(`/backtest/results/${backtestId}`);
      
      if (!data) {
        setError("Backtest result not found");
        return;
      }
      
      setResult(data);
      
      // Parse chart data if available
      if (data.chartData) {
        try {
          const parsed = typeof data.chartData === 'string' 
            ? JSON.parse(data.chartData) 
            : data.chartData;
          setChartData(parsed.history || parsed || []);
        } catch (e) {
          console.error("Failed to parse chart data:", e);
        }
      }
      
      // Parse trades if available
      if (data.trades) {
        const tradelist = typeof data.trades === 'string' 
          ? JSON.parse(data.trades) 
          : data.trades;
        setTrades(Array.isArray(tradelist) ? tradelist : []);
      }
      
    } catch (err) {
      console.error("Failed to fetch backtest result:", err);
      setError(err.message || "Failed to load backtest result");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading backtest result...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || "Backtest not found"}</p>
            <Link href="/strategies">
              <Button>← Back to Strategies</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayTrades = showAllTrades ? trades : trades.slice(0, 20);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/strategies" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
          ← Back to Strategies
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {result.name || result.strategy_name || 'Backtest Result'}
          <span className={`text-lg px-3 py-1 rounded-full ${
            (result.netProfit || result.net_profit) >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {((result.netProfit || result.net_profit) >= 0 ? '+' : '')}
            {((result.netProfit || result.net_profit) * 100).toFixed(2)}%
          </span>
        </h1>
        <p className="text-gray-600 mt-2">
          {result.startDate && result.endDate && (
            <>Period: {new Date(result.startDate).toLocaleDateString()} - {new Date(result.endDate).toLocaleDateString()}</>
          )}
          {result.pairs && (
            <> • Pairs: {Array.isArray(result.pairs) ? result.pairs.join(', ') : result.pairs}</>
          )}
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Net Profit</div>
            <div className={`text-2xl font-bold ${
              (result.netProfit || result.net_profit) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {((result.netProfit || result.net_profit) >= 0 ? '+' : '')}
              {((result.netProfit || result.net_profit) * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-gray-400">
              ${((result.netProfitUsd || result.net_profit_usd) || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Sharpe Ratio</div>
            <div className="text-2xl font-bold">
              {((result.sharpeRatio || result.sharpe_ratio) || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Max Drawdown</div>
            <div className="text-2xl font-bold text-red-600">
              {((result.maxDrawdown || result.max_drawdown) * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Win Rate</div>
            <div className="text-2xl font-bold">
              {((result.winRate || result.win_rate) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Total Trades</div>
            <div className="text-2xl font-bold">
              {(result.totalTrades || result.total_trades) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Profit Factor</div>
            <div className="text-2xl font-bold">
              {((result.profitFactor || result.profit_factor) || 0).toFixed(2)}x
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Sortino Ratio</div>
            <div className="text-2xl font-bold">
              {((result.sortinoRatio || result.sortino_ratio) || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-1">Yearly Return</div>
            <div className="text-2xl font-bold">
              {((result.yearlyReturn || result.yearly_return) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      {chartData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Trades Table */}
      {trades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Trade History ({trades.length} trades)</span>
              {trades.length > 20 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllTrades(!showAllTrades)}
                >
                  {showAllTrades ? 'Show Less' : 'Show All Trades'}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Pair</th>
                    <th className="text-left p-2">Action</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">P&L %</th>
                    <th className="text-right p-2">P&L $</th>
                    <th className="text-right p-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTrades.map((trade, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{trade.date || trade.timestamp}</td>
                      <td className="p-2 font-mono">{trade.pair || trade.symbol}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          (trade.action || trade.side) === 'BUY' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {trade.action || trade.side}
                        </span>
                      </td>
                      <td className="p-2 text-right font-mono">${(trade.price || 0).toFixed(2)}</td>
                      <td className={`p-2 text-right font-semibold ${
                        (trade.pnl || trade.profit_loss_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((trade.pnl || trade.profit_loss_percent || 0) >= 0 ? '+' : '')}
                        {((trade.pnl || trade.profit_loss_percent || 0) * 100).toFixed(2)}%
                      </td>
                      <td className={`p-2 text-right font-semibold ${
                        (trade.pnlUsd || trade.profit_loss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((trade.pnlUsd || trade.profit_loss || 0) >= 0 ? '+' : '')}
                        ${(trade.pnlUsd || trade.profit_loss || 0).toFixed(2)}
                      </td>
                      <td className="p-2 text-right font-mono">
                        ${(trade.balance || trade.equity || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Initial Balance:</span>
              <span className="ml-2 font-semibold">${(result.initialBalance || result.initial_balance || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 font-semibold">{new Date(result.createdAt || result.timestamp_run).toLocaleString()}</span>
            </div>
            {result.pairs && (
              <div className="col-span-2">
                <span className="text-gray-500">Trading Pairs:</span>
                <span className="ml-2 font-semibold">{Array.isArray(result.pairs) ? result.pairs.join(', ') : result.pairs}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

