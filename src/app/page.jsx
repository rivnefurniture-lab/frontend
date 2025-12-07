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
              <div className="mt-3 flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>+{s.cagr?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span>{s.maxDD?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{s.sharpe?.toFixed(2) || 0}</span>
                  </div>
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

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t("landing.metricsNote")}</span>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gradient-to-b from-white via-gray-50 to-white py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {t("landing.howItWorks")}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("landing.howItWorksSubtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Link href="/strategies" className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-indigo-500 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <div className="mb-4 w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mt-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{t("landing.step1Title")}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("landing.step1Text")}
                </p>
                <span className="inline-flex items-center gap-2 text-indigo-600 font-medium group-hover:gap-3 transition-all">
                  {language === "uk" ? "Переглянути" : "Browse"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
            
            <Link href="/connect" className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-emerald-500 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <div className="mb-4 w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mt-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{t("landing.step2Title")}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("landing.step2Text")}
                </p>
                <span className="inline-flex items-center gap-2 text-emerald-600 font-medium group-hover:gap-3 transition-all">
                  {language === "uk" ? "Підключити" : "Connect"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
            
            <Link href="/dashboard" className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-violet-500 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <div className="mb-4 w-16 h-16 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mt-4">
                  <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{t("landing.step3Title")}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("landing.step3Text")}
                </p>
                <span className="inline-flex items-center gap-2 text-violet-600 font-medium group-hover:gap-3 transition-all">
                  {language === "uk" ? "Почати" : "Start"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/auth?mode=signup">
              <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
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
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">{t("landing.realData")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.realDataText")}
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">{t("landing.secure")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.secureText")}
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">{t("landing.fastExecution")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.fastExecutionText")}
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-md transition">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
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
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm">{t("landing.ssl")}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{t("landing.verifiedReviews")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">UA</div>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto">
            {/* Exchanges */}
            <a 
              href="https://www.binance.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-400 hover:shadow-md transition-all group"
            >
              <svg className="w-8 h-8 text-yellow-500 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 126 126" fill="currentColor">
                <path d="M63 0L78.75 25.2H47.25L63 0Z"/>
                <path d="M63 126L47.25 100.8H78.75L63 126Z"/>
                <path d="M31.5 37.8L0 63L31.5 88.2V63V37.8Z"/>
                <path d="M94.5 37.8V63V88.2L126 63L94.5 37.8Z"/>
                <path d="M31.5 63L63 37.8L94.5 63L63 88.2L31.5 63Z"/>
              </svg>
              <span className="text-xs font-medium text-gray-700">Binance</span>
            </a>
            
            <a 
              href="https://www.bybit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all group"
            >
              <svg className="w-8 h-8 text-gray-800 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2L2 9v7l14 7 14-7V9L16 2zm0 4l9 4.5-9 4.5-9-4.5L16 6z"/>
              </svg>
              <span className="text-xs font-medium text-gray-700">Bybit</span>
            </a>
            
            <a 
              href="https://www.okx.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <span className="text-lg font-black text-blue-600 group-hover:scale-110 transition-transform">OKX</span>
              </div>
              <span className="text-xs font-medium text-gray-700">OKX</span>
            </a>
            
            {/* Data Providers */}
            <a 
              href="https://www.coingecko.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition-all group"
            >
              <svg className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="9" cy="10" r="2" fill="white"/>
              </svg>
              <span className="text-xs font-medium text-gray-700">CoinGecko</span>
            </a>
            
            <a 
              href="https://www.tradingview.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <svg className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 13h4l3 7 4-14 3 7h4"/>
              </svg>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">Trading<br/>View</span>
            </a>
            
            <a 
              href="https://polygon.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <svg className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 22,8 22,16 12,22 2,16 2,8"/>
              </svg>
              <span className="text-xs font-medium text-gray-700">Polygon</span>
            </a>
            
            <a 
              href="https://coinmarketcap.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <svg className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 18l-8-4V8l8 4v8z"/>
              </svg>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">CoinMarket<br/>Cap</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="container text-center text-white relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("landing.readyToAutomate")}</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            {t("landing.ctaSubtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <button className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all shadow-2xl hover:shadow-xl hover:scale-105">
                {t("landing.createFreeAccount")}
              </button>
            </Link>
            <Link href="/strategies">
              <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 backdrop-blur transition-all">
                {t("landing.viewStrategies")}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
