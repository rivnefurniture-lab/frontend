"use client";

import { useMemo, useState } from "react";
import { strategies } from "./mock";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";

export default function Page() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("cagr");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = strategies.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
    list.sort((a, b) => (b[sort] ?? 0) - (a[sort] ?? 0));
    return list;
  }, [query, sort]);

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Strategies</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <Input
            placeholder="Search by name or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            value={sort}
            onChange={setSort}
            options={[
              { value: "cagr", label: "Sort: CAGR" },
              { value: "sharpe", label: "Sort: Sharpe" },
              { value: "maxDD", label: "Sort: Lowest Drawdown" },
            ]}
          />
        </div>
      </div>
      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <Card key={s.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{s.name}</span>
                <span className="text-sm text-gray-500">{s.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">CAGR</div>
                  <div className="font-semibold">{s.cagr}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Sharpe</div>
                  <div className="font-semibold">{s.sharpe}</div>
                </div>
                <div>
                  <div className="text-gray-500">Max DD</div>
                  <div className="font-semibold">{s.maxDD}%</div>
                </div>
              </div>
              <div className="h-32 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={s.history}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip />
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
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/strategies/${s.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View details →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
