"use client";

import { useMemo, useState, useEffect } from "react";
import { strategies as defaultStrategies } from "./mock";
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
import { apiFetch } from "@/lib/api";

export default function StrategiesPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("cagr");
  const [strategies, setStrategies] = useState(defaultStrategies);
  const [loading, setLoading] = useState(false);
  const [calculatingId, setCalculatingId] = useState(null);

  // Fetch real metrics on mount
  useEffect(() => {
    fetchRealMetrics();
  }, []);

  const fetchRealMetrics = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/backtest/preset-strategies");
      
      if (response && Array.isArray(response)) {
        // Merge real metrics with default strategies
        const updatedStrategies = defaultStrategies.map(defaultStrategy => {
          const realData = response.find(r => r.id === defaultStrategy.id);
          if (realData?.metrics) {
            return {
              ...defaultStrategy,
              cagr: realData.metrics.yearly_return || defaultStrategy.cagr,
              sharpe: realData.metrics.sharpe_ratio || defaultStrategy.sharpe,
              maxDD: realData.metrics.max_drawdown || defaultStrategy.maxDD,
              winRate: realData.metrics.win_rate || defaultStrategy.winRate,
              totalTrades: realData.metrics.total_trades || defaultStrategy.totalTrades,
              profitFactor: realData.metrics.profit_factor || defaultStrategy.profitFactor,
              returns: {
                daily: (realData.metrics.yearly_return / 365).toFixed(3),
                weekly: (realData.metrics.yearly_return / 52).toFixed(2),
                monthly: (realData.metrics.yearly_return / 12).toFixed(1),
                yearly: realData.metrics.yearly_return,
              },
              isRealData: true,
              needsCalculation: false,
            };
          }
          return {
            ...defaultStrategy,
            needsCalculation: realData?.needsCalculation ?? true,
          };
        });
        setStrategies(updatedStrategies);
      }
    } catch (error) {
      console.error("Failed to fetch real metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = async (strategyId) => {
    try {
      setCalculatingId(strategyId);
      const result = await apiFetch(`/backtest/preset-strategies/${strategyId}/calculate`);
      
      if (result?.metrics) {
        setStrategies(prev => prev.map(s => {
          if (s.id === strategyId) {
            return {
              ...s,
              cagr: result.metrics.yearly_return || s.cagr,
              sharpe: result.metrics.sharpe_ratio || s.sharpe,
              maxDD: result.metrics.max_drawdown || s.maxDD,
              winRate: result.metrics.win_rate || s.winRate,
              totalTrades: result.metrics.total_trades || s.totalTrades,
              profitFactor: result.metrics.profit_factor || s.profitFactor,
              returns: {
                daily: (result.metrics.yearly_return / 365).toFixed(3),
                weekly: (result.metrics.yearly_return / 52).toFixed(2),
                monthly: (result.metrics.yearly_return / 12).toFixed(1),
                yearly: result.metrics.yearly_return,
              },
              isRealData: true,
              needsCalculation: false,
            };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error("Failed to calculate metrics:", error);
      alert("Failed to calculate metrics. Please try again.");
    } finally {
      setCalculatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = strategies.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
    );
    list.sort((a, b) => (b[sort] ?? 0) - (a[sort] ?? 0));
    return list;
  }, [query, sort, strategies]);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Trading Strategies</h1>
          <p className="text-gray-600 mt-1">Choose a strategy to start automated trading</p>
        </div>
        <Link href="/backtest">
          <Button variant="outline">+ Create Custom Strategy</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          placeholder="Search strategies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="md:w-80"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 px-4 rounded-lg border border-gray-200 bg-white"
        >
          <option value="cagr">Sort by: Yearly Return</option>
          <option value="sharpe">Sort by: Sharpe Ratio</option>
          <option value="winRate">Sort by: Win Rate</option>
          <option value="maxDD">Sort by: Lowest Drawdown</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <div className="text-3xl font-bold">{strategies.length}</div>
          <div className="text-blue-100">Active Strategies</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
          <div className="text-3xl font-bold">
            {Math.max(...strategies.map(s => s.cagr))}%
          </div>
          <div className="text-green-100">Best Yearly Return</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="text-3xl font-bold">
            {Math.max(...strategies.map(s => s.sharpe))}
          </div>
          <div className="text-purple-100">Best Sharpe Ratio</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl">
          <div className="text-3xl font-bold">
            {Math.round(strategies.reduce((a, s) => a + s.winRate, 0) / strategies.length)}%
          </div>
          <div className="text-orange-100">Avg Win Rate</div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">
          Loading real performance data...
        </div>
      )}

      {/* Strategy Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <Card key={s.id} className="hover:shadow-lg transition group">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{s.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{s.category}</p>
                </div>
                <div className="flex gap-1">
                  {s.id === "golden-balance" && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                      ⭐ Featured
                    </span>
                  )}
                  {s.isRealData && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      ✓ Real Data
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Returns */}
              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-sm font-semibold text-green-600">+{s.returns?.daily || (s.cagr / 365).toFixed(3)}%</div>
                  <div className="text-xs text-gray-500">Daily</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-sm font-semibold text-green-600">+{s.returns?.weekly || (s.cagr / 52).toFixed(2)}%</div>
                  <div className="text-xs text-gray-500">Weekly</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-sm font-semibold text-green-600">+{s.returns?.monthly || (s.cagr / 12).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Monthly</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-sm font-semibold text-green-600">+{s.cagr}%</div>
                  <div className="text-xs text-gray-500">Yearly</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-500">Win Rate</div>
                  <div className="font-semibold">{s.winRate}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Sharpe</div>
                  <div className="font-semibold">{s.sharpe}</div>
                </div>
                <div>
                  <div className="text-gray-500">Max DD</div>
                  <div className="font-semibold text-red-600">-{s.maxDD}%</div>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="h-24 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={s.history}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      formatter={(v) => [`$${v.toFixed(0)}`, "Value"]}
                      labelFormatter={(l) => `Month ${l}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {s.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Calculate Real Metrics Button */}
              {s.needsCalculation && !s.isRealData && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mb-2"
                  onClick={() => calculateMetrics(s.id)}
                  disabled={calculatingId === s.id}
                >
                  {calculatingId === s.id ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Calculating real metrics...
                    </>
                  ) : (
                    "📊 Calculate Real Performance"
                  )}
                </Button>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/strategies/${s.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Link href={`/strategies/${s.id}`} className="flex-1">
                  <Button className="w-full">
                    Use Strategy
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No strategies found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <strong>⚠️ Disclaimer:</strong> Performance metrics marked with &quot;Real Data&quot; are calculated from actual historical price data from Binance. 
        Past performance does not guarantee future results. All trading involves risk.
      </div>
    </div>
  );
}
