"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Metric from "@/components/Metric";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t, language } = useLanguage();
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
        {t("hero.title")}{" "}
        <span className="text-blue-600">{t("hero.titleHighlight")}</span>
      </motion.h1>
      <p className="mt-4 text-gray-600 max-w-xl">
        {t("hero.subtitle")}
      </p>
      <div className="mt-6 flex gap-3 flex-wrap">
        <Link href="/strategies">
          <Button size="lg">{t("hero.ctaSecondary")}</Button>
        </Link>
        <Link href="/backtest">
          <Button size="lg" variant="secondary">
            {language === "uk" ? "Створити власну" : "Build Your Own"}
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Metric 
          label={language === "uk" ? "Стратегій" : "Strategies"} 
          value={metrics.strategies} 
        />
        <Metric 
          label={language === "uk" ? "Сер. Sharpe" : "Avg. Sharpe"} 
          value={metrics.avgSharpe} 
        />
        <Metric 
          label={language === "uk" ? "Найкращий ROI" : "Best Return/yr"} 
          value={metrics.bestReturn} 
        />
      </div>
    </div>
  );
}
