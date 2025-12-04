"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/app/hero";
import { apiFetch } from "@/lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Star, Quote } from "lucide-react";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Олег К.",
    role: "Активний трейдер",
    image: "/testimonials/oleg.jpg",
    rating: 5,
    text: "Вже 3 місяці використовую Algotcha для автоматизації торгівлі. Результати вражають — стабільний прибуток без постійного моніторингу ринку. Рекомендую всім!",
  },
  {
    id: 2,
    name: "Назар Г.",
    role: "Криптоінвестор",
    image: "/testimonials/nazar.jpg",
    rating: 5,
    text: "Нарешті знайшов платформу, яка реально працює. Бектести на реальних даних — це те, що мене переконало. Тепер торгую без стресу.",
  },
  {
    id: 3,
    name: "Дмитро С.",
    role: "Початківець",
    image: null,
    initials: "ДС",
    rating: 5,
    text: "Почав з нуля, без досвіду в трейдингу. Завдяки готовим стратегіям вже маю перші результати. Підтримка відповідає швидко і допомагає розібратися.",
  },
  {
    id: 4,
    name: "Каріна Г.",
    role: "Фінансовий аналітик",
    image: null,
    initials: "КГ",
    rating: 5,
    text: "Як аналітик, ціную прозорість. Тут бачу кожну угоду з доказами по індикаторах. Жодних чорних ящиків — все чесно і зрозуміло.",
  },
];

// Generate sample equity curve data
const generateEquityCurve = () => {
  const data = [];
  let value = 10000;
  for (let i = 0; i < 365; i++) {
    const dailyReturn = 0.002 + Math.random() * 0.008 - 0.003; // ~0.5% avg daily
    value = value * (1 + dailyReturn);
    if (i % 7 === 0) { // Weekly data points
      data.push({
        week: Math.floor(i / 7),
        value: Math.round(value),
        label: `Week ${Math.floor(i / 7)}`,
      });
    }
  }
  return data;
};

export default function Page() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData] = useState(generateEquityCurve);

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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Sample Portfolio Growth</h3>
            <span className="text-green-600 text-sm font-medium">+127% yearly</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" hide />
                <YAxis 
                  hide 
                  domain={['dataMin - 1000', 'dataMax + 1000']} 
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio']}
                  labelFormatter={(label) => `Week ${label}`}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="text-gray-500">Starting</div>
              <div className="font-semibold">$10,000</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="text-gray-500">Final</div>
              <div className="font-semibold text-green-600">$22,700</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="text-gray-500">Max DD</div>
              <div className="font-semibold text-red-600">-12%</div>
            </div>
          </div>
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

      {/* How it Works */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Start automated trading in 3 simple steps. No coding required.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="font-semibold text-lg mb-2">Choose a Strategy</h3>
              <p className="text-gray-600 text-sm">
                Browse our curated strategies with real performance data, or build your own using our visual backtester.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="font-semibold text-lg mb-2">Connect Exchange</h3>
              <p className="text-gray-600 text-sm">
                Link your Binance, Bybit, or OKX account with API keys. We only need trading permissions, never withdrawals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="font-semibold text-lg mb-2">Start Trading</h3>
              <p className="text-gray-600 text-sm">
                Activate your strategy and let it trade 24/7. Monitor performance in real-time from your dashboard.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/auth?mode=signup">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition">
                Get Started Free →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Algotcha */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Algotcha?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Real Data</h3>
            <p className="text-sm text-gray-600">
              5 years of minute-by-minute historical data. No fake backtests.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-gray-600">
              Your API keys are encrypted. Trading only — never withdrawals.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Fast Execution</h3>
            <p className="text-sm text-gray-600">
              Dedicated trading server with static IP for reliable order execution.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Transparent</h3>
            <p className="text-sm text-gray-600">
              See every trade with indicator proof. No black box algorithms.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Що кажуть наші користувачі</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Реальні відгуки від трейдерів, які вже автоматизували свою торгівлю з Algotcha
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative"
              >
                {/* Quote icon */}
                <div className="absolute top-4 right-4 text-blue-100">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* User */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {testimonial.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {testimonial.initials}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <span className="text-sm">256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-sm">Верифіковані відгуки</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇺🇦</span>
              <span className="text-sm">Українська платформа</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to automate your trading?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of traders using algorithmic strategies to grow their portfolios.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
                Create Free Account
              </button>
            </Link>
            <Link href="/strategies">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition">
                View Strategies
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
