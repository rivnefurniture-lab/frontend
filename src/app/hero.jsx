"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Metric from "@/components/Metric";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export default function Hero() {
  const [metrics, setMetrics] = useState({
    strategies: "...",
    avgSharpe: "...",
    bestReturn: "..."
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const strategies = await apiFetch("/backtest/strategies");
      if (strategies && strategies.length > 0) {
        const avgSharpe = (strategies.reduce((a, s) => a + (s.sharpe || 0), 0) / strategies.length).toFixed(2);
        const bestReturn = Math.max(...strategies.map(s => s.cagr || 0)).toFixed(0);
        setMetrics({
          strategies: strategies.length.toString(),
          avgSharpe,
          bestReturn: `${bestReturn}%`
        });
      }
    } catch (e) {
      console.log("Failed to fetch metrics");
    }
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold leading-tight"
      >
        Automate your{" "}
        <span className="text-blue-600">crypto trading</span>
      </motion.h1>
      <p className="mt-4 text-gray-600 max-w-xl">
        Copy proven trading strategies or build your own. Real-time backtesting 
        on 5 years of data. Connect your exchange and let algorithms trade 24/7.
      </p>
      <div className="mt-6 flex gap-3 flex-wrap">
        <Link href="/strategies">
          <Button size="lg">Explore Strategies</Button>
        </Link>
        <Link href="/backtest">
          <Button size="lg" variant="secondary">
            Build Your Own
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Metric label="Strategies" value={metrics.strategies} />
        <Metric label="Avg. Sharpe" value={metrics.avgSharpe} />
        <Metric label="Best Return/yr" value={metrics.bestReturn} />
      </div>
    </div>
  );
}
