"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { strategies } from "../strategies/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { api, isSubscribed } from "@/lib/utils";

export default function StrategyDetailPage() {
  const { id } = useParams(); // dynamic param from folder name [id]
  const router = useRouter();
  const s = strategies.find((x) => x.id === id);

  const [exchange, setExchange] = useState("binance");
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("1m");
  const [amount, setAmount] = useState(50);
  const [starting, setStarting] = useState(false);

  if (!s) return <div className="container py-10">Not found</div>;

  const startLive = async () => {
    if (!isSubscribed()) {
      router.push(
        `/pricing?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    try {
      setStarting(true);
      await api("/strategies/start", {
        body: {
          strategyId: id,
          exchange,
          symbol,
          timeframe,
          amountUSDT: Number(amount),
        },
      });
      alert("Live trading started. Check the Live page for logs.");
      router.push("/live");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
        <div className="flex-1 w-full">
          <h1 className="text-3xl font-bold">{s.name}</h1>
          <p className="text-gray-600">{s.category}</p>
          <p className="mt-3 text-gray-700">{s.description}</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <Stat label="CAGR" value={`${s.cagr}%`} />
            <Stat label="Sharpe" value={s.sharpe} />
            <Stat label="Max Drawdown" value={`${s.maxDD}%`} />
          </div>

          <Card className="mt-6">
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={s.history}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      fill="url(#grad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="w-full lg:w-96">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-semibold">Go live</h3>
              <p className="text-sm text-gray-500 mt-1">
                Connect an exchange first on the{" "}
                <Link href="/connect" className="text-blue-600 underline">
                  Connect
                </Link>{" "}
                page.
              </p>

              <div>
                <label className="text-sm text-gray-600">Exchange</label>
                <select
                  className="w-full h-11 px-4 rounded-xl border border-gray-200"
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                >
                  <option value="binance">Binance</option>
                  <option value="bybit">Bybit</option>
                  <option value="okx">OKX</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Symbol</label>
                <input
                  className="w-full h-11 px-4 rounded-xl border border-gray-200"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g., BTC/USDT"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Timeframe</label>
                  <select
                    className="w-full h-11 px-4 rounded-xl border border-gray-200"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <option>1m</option>
                    <option>5m</option>
                    <option>15m</option>
                    <option>1h</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Order size (USDT)
                  </label>
                  <input
                    type="number"
                    className="w-full h-11 px-4 rounded-xl border border-gray-200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                disabled={starting}
                onClick={startLive}
              >
                {starting ? "Starting..." : "Start live trading"}
              </Button>

              <p className="text-xs text-gray-500">
                Dev demo only. Trading involves risk.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-soft">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
