"use client";

import { useMemo, useState } from "react";
import { strategies } from "./mock";
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

export default function StrategiesPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("cagr");

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
  }, [query, sort]);

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
                {s.id === "golden-balance" && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Returns */}
              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-sm font-semibold text-green-600">+{s.returns?.daily || 0.05}%</div>
                  <div className="text-xs text-gray-500">Daily</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-sm font-semibold text-green-600">+{s.returns?.weekly || 0.35}%</div>
                  <div className="text-xs text-gray-500">Weekly</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-sm font-semibold text-green-600">+{s.returns?.monthly || 1.5}%</div>
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
    </div>
  );
}
