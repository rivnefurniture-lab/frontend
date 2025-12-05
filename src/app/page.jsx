"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Hero from "@/app/hero";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Star, Quote } from "lucide-react";

// Testimonial avatar with photo
function TestimonialAvatar({ testimonial }) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
      {testimonial.photo ? (
        <img 
          src={testimonial.photo}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-lg border-2 border-white"
        />
      ) : (
        <div 
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg`}
        >
          {testimonial.initials}
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>
    </div>
  );
}

// Generate sample equity curve data
const generateEquityCurve = () => {
  const data = [];
  let value = 10000;
  for (let i = 0; i < 365; i++) {
    const dailyReturn = 0.002 + Math.random() * 0.008 - 0.003;
    value = value * (1 + dailyReturn);
    if (i % 7 === 0) {
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
  const { t, language } = useLanguage();
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData] = useState(generateEquityCurve);

  // Testimonials data with photos
  const testimonials = [
    {
      id: 1,
      name: "Олег К.",
      role: language === "uk" ? "Активний трейдер" : "Active Trader",
      initials: "ОК",
      photo: "/testimonials/oleg.jpeg",
      gradient: "from-blue-500 to-cyan-500",
      rating: 5,
      text: t("testimonialContent.oleg"),
    },
    {
      id: 2,
      name: "Назар Г.",
      role: language === "uk" ? "Фінансовий аналітик" : "Financial Analyst",
      initials: "НГ",
      photo: "/testimonials/nazar.jpeg",
      gradient: "from-purple-500 to-pink-500",
      rating: 5,
      text: t("testimonialContent.nazar"),
    },
    {
      id: 3,
      name: "Дмитро С.",
      role: language === "uk" ? "Криптоентузіаст" : "Crypto Enthusiast",
      initials: "ДС",
      gradient: "from-amber-500 to-orange-500",
      rating: 5,
      text: t("testimonialContent.dmytro"),
    },
    {
      id: 4,
      name: "Каріна Г.",
      role: language === "uk" ? "Приватний інвестор" : "Private Investor",
      initials: "КГ",
      gradient: "from-green-500 to-emerald-500",
      rating: 5,
      text: t("testimonialContent.karina"),
    },
  ];

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const data = await apiFetch("/backtest/strategies");
      setStrategies((data || []).slice(0, 6));
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
            <h3 className="font-semibold text-gray-700">{t("landing.sampleGrowth")}</h3>
            <span className="text-green-600 text-sm font-medium">+127% {t("landing.yearly")}</span>
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
              <div className="text-gray-500">{t("landing.starting")}</div>
              <div className="font-semibold">$10,000</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="text-gray-500">{t("landing.final")}</div>
              <div className="font-semibold text-green-600">$22,700</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="text-gray-500">{t("landing.maxDD")}</div>
              <div className="font-semibold text-red-600">-12%</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{t("landing.featuredStrategies")}</h2>
          <Link href="/strategies" className="text-blue-600 hover:underline">
            {t("landing.viewAll")}
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
                    {t("landing.live")}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-green-600">⚡ +{s.cagr?.toFixed(1) || 0}%{t("landing.yr")}</span>
                  <span className="text-red-600">📉 -{s.maxDD?.toFixed(1) || 0}%</span>
                  <span>📈 {s.sharpe?.toFixed(2) || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{t("landing.loadingStrategies")}</p>
            <p className="text-sm mt-2">{t("landing.checkBackSoon")}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
          {t("landing.metricsNote")}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">{t("landing.howItWorks")}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("landing.howItWorksSubtitle")}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/strategies" className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-blue-200 transition">
                1️⃣
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("landing.step1Title")}</h3>
              <p className="text-gray-600 text-sm">
                {t("landing.step1Text")}
              </p>
              <span className="inline-block mt-3 text-blue-600 text-sm group-hover:underline">
                {language === "uk" ? "Переглянути стратегії →" : "Browse Strategies →"}
              </span>
            </Link>
            
            <Link href="/connect" className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-green-200 transition">
                2️⃣
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("landing.step2Title")}</h3>
              <p className="text-gray-600 text-sm">
                {t("landing.step2Text")}
              </p>
              <span className="inline-block mt-3 text-green-600 text-sm group-hover:underline">
                {language === "uk" ? "Підключити біржу →" : "Connect Exchange →"}
              </span>
            </Link>
            
            <Link href="/dashboard" className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-purple-200 transition">
                3️⃣
              </div>
              <h3 className="font-semibold text-lg mb-2">{t("landing.step3Title")}</h3>
              <p className="text-gray-600 text-sm">
                {t("landing.step3Text")}
              </p>
              <span className="inline-block mt-3 text-purple-600 text-sm group-hover:underline">
                {language === "uk" ? "Перейти до панелі →" : "Go to Dashboard →"}
              </span>
            </Link>
          </div>

          <div className="text-center mt-10">
            <Link href="/auth?mode=signup">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition">
                {t("landing.getStartedFree")}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Algotcha */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t("landing.whyAlgotcha")}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">{t("landing.realData")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.realDataText")}
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">{t("landing.secure")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.secureText")}
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">{t("landing.fastExecution")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.fastExecutionText")}
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">{t("landing.transparent")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.transparentText")}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("landing.testimonials")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("landing.testimonialsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative"
              >
                <div className="absolute top-4 right-4 text-blue-100">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <TestimonialAvatar testimonial={testimonial} />
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <span className="text-sm">{t("landing.ssl")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-sm">{t("landing.verifiedReviews")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇺🇦</span>
              <span className="text-sm">{t("landing.ukrainianPlatform")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-16 border-t border-gray-100">
        <div className="container">
          <p className="text-center text-gray-500 mb-10">
            {language === "uk" 
              ? "Інтегровано з провідними платформами та постачальниками даних" 
              : "Integrated with leading platforms and data providers"}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Exchanges */}
            <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
              <svg className="w-8 h-8" viewBox="0 0 126 126" fill="currentColor">
                <path d="M63 0L78.75 25.2H47.25L63 0Z"/>
                <path d="M63 126L47.25 100.8H78.75L63 126Z"/>
                <path d="M31.5 37.8L0 63L31.5 88.2V63V37.8Z"/>
                <path d="M94.5 37.8V63V88.2L126 63L94.5 37.8Z"/>
                <path d="M31.5 63L63 37.8L94.5 63L63 88.2L31.5 63Z"/>
              </svg>
              <span>Binance</span>
            </div>
            
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Bybit</span>
            </div>
            
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <span className="text-blue-500">OKX</span>
            </div>

            <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
            
            {/* Data Providers */}
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
              </svg>
              <span className="text-xl font-semibold text-purple-600">Polygon</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-purple-700">Y!</span>
              <span className="text-xl font-semibold text-gray-700">Finance</span>
            </div>

            <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
            
            {/* Tech Partners */}
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <span className="text-lg font-semibold text-gray-700">TradingView</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-lg font-semibold text-gray-700">CoinGecko</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold text-orange-500">CoinMarketCap</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t("landing.readyToAutomate")}</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            {t("landing.ctaSubtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
                {t("landing.createFreeAccount")}
              </button>
            </Link>
            <Link href="/strategies">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition">
                {t("landing.viewStrategies")}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
