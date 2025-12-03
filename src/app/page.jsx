"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Hero from "@/app/hero";
import { apiFetch } from "@/lib/api";

export default function Page() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const data = await apiFetch("/backtest/strategies");
      setStrategies((data || []).slice(0, 6)); // Show top 6
    } catch (err) {
      console.error("Failed to fetch strategies:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="container pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <Hero />
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
          <img
            src="https://dummyimage.com/800x480/edf2f7/1a202c&text=Performance+Overview"
            alt="preview"
            className="rounded-xl w-full"
          />
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Strategies</h2>
          <Link href="/strategies" className="text-blue-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-5 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : strategies.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {strategies.map((s) => (
              <Link
                key={s.id}
                href={`/strategies/${s.id}`}
                className="block bg-white p-5 rounded-2xl shadow-soft border border-gray-100 hover:-translate-y-0.5 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-sm text-gray-500">{s.category}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Live
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-green-600">⚡ +{s.cagr?.toFixed(1) || 0}%/yr</span>
                  <span className="text-red-600">📉 -{s.maxDD?.toFixed(1) || 0}%</span>
                  <span>📈 {s.sharpe?.toFixed(2) || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Loading strategies from real market data...</p>
            <p className="text-sm mt-2">Please check back soon.</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
          📊 All metrics are calculated from real historical market data and updated hourly.
        </div>
      </section>
    </div>
  );
}
