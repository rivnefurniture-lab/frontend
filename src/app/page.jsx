"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { Star, Quote } from "lucide-react";
import { isCryptoMode, isStocksMode, getExchanges } from "@/config/tradingMode";

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

export default function Page() {
  const { t, language } = useLanguage();
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Testimonials data - rebranded roles (photos removed for privacy)
  const testimonials = [
    {
      id: 1,
      name: language === "uk" ? "Олег К." : "Oleg K.",
      role: language === "uk" ? "Бізнес-аналітик" : "Business Analyst",
      initials: language === "uk" ? "ОК" : "OK",
      gradient: "from-gray-700 to-gray-900",
      rating: 5,
      text: t("testimonialContent.oleg"),
    },
    {
      id: 2,
      name: language === "uk" ? "Назар Г." : "Nazar H.",
      role: language === "uk" ? "Фінансовий аналітик" : "Financial Analyst",
      initials: language === "uk" ? "НГ" : "NH",
      gradient: "from-purple-500 to-pink-500",
      rating: 5,
      text: t("testimonialContent.nazar"),
    },
    {
      id: 3,
      name: language === "uk" ? "Дмитро С." : "Dmytro S.",
      role: language === "uk" ? "Дослідник даних" : "Data Researcher",
      initials: language === "uk" ? "ДС" : "DS",
      gradient: "from-amber-500 to-orange-500",
      rating: 5,
      text: t("testimonialContent.dmytro"),
    },
    {
      id: 4,
      name: language === "uk" ? "Каріна Г." : "Karina H.",
      role: language === "uk" ? "Приватний аналітик" : "Private Analyst",
      initials: language === "uk" ? "КГ" : "KH",
      gradient: "from-green-500 to-emerald-500",
      rating: 5,
      text: t("testimonialContent.karina"),
    },
    {
      id: 5,
      name: language === "uk" ? "Максим Р." : "Maxim R.",
      role: language === "uk" ? "Трейдер" : "Trader",
      initials: language === "uk" ? "МР" : "MR",
      gradient: "from-blue-500 to-cyan-500",
      rating: 5,
      text: t("testimonialContent.maxim"),
    },
    {
      id: 6,
      name: language === "uk" ? "Анна Л." : "Anna L.",
      role: language === "uk" ? "Інвестор" : "Investor",
      initials: language === "uk" ? "АЛ" : "AL",
      gradient: "from-pink-500 to-rose-500",
      rating: 5,
      text: t("testimonialContent.anna"),
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
      <HeroSection language={language} />

      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{t("landing.featuredStrategies")}</h2>
          <Link href="/strategies" className="text-black font-bold hover:text-emerald-600 transition-colors flex items-center gap-1">
            {t("landing.viewAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-5 h-32 animate-pulse" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}} />
            ))}
          </div>
        ) : strategies.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {strategies.map((s) => (
            <Link
              key={s.id}
              href={`/strategies/${s.id}`}
              className="block bg-white p-5 shadow-lg border-2 border-gray-100 hover:border-black hover:-translate-y-1 hover:shadow-2xl transition-all"
              style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}
            >
                <div className="flex items-start justify-between">
                  <div>
              <h3 className="font-bold text-gray-900">{s.name}</h3>
              <p className="text-sm text-gray-500">{s.category}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-black text-white text-xs font-bold uppercase tracking-wider" style={{clipPath: 'polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px)'}}>
                    {language === "uk" ? "Модель" : "Model"}
                  </span>
                </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="font-semibold">{language === "uk" ? "Шарп" : "Sharpe"}: {s.sharpe?.toFixed(2) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span className="font-semibold">DD: {s.maxDD?.toFixed(1) || 0}%</span>
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

        <div className="mt-6 p-4 bg-gray-900 text-white text-sm flex items-start gap-3" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t("landing.metricsNote")}</span>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-black opacity-5" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500 opacity-5" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}}></div>
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-black">
              {t("landing.howItWorks")}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("landing.howItWorksSubtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Link href="/strategies" className="relative group">
              <div className="bg-white p-8 shadow-lg border-2 border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-300" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black flex items-center justify-center shadow-xl group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <div className="mb-4 w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mt-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{t("landing.step1Title")}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("landing.step1Text")}
                </p>
                <span className="inline-flex items-center gap-2 text-black font-bold group-hover:gap-3 transition-all">
                  {language === "uk" ? "Переглянути" : "Browse"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
            
            <Link href="/connect" className="relative group">
              <div className="bg-white p-8 shadow-lg border-2 border-gray-100 hover:border-emerald-500 hover:shadow-2xl transition-all duration-300" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-500 flex items-center justify-center shadow-xl group-hover:bg-black transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <div className="mb-4 w-16 h-16 bg-emerald-50 flex items-center justify-center mx-auto mt-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{t("landing.step2Title")}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("landing.step2Text")}
                </p>
                <span className="inline-flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-3 transition-all">
                  {language === "uk" ? "Підключити" : "Connect"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
            
            <Link href="/dashboard" className="relative group">
              <div className="bg-white p-8 shadow-lg border-2 border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-300" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-800 flex items-center justify-center shadow-xl group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <div className="mb-4 w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mt-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                  <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{t("landing.step3Title")}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("landing.step3Text")}
                </p>
                <span className="inline-flex items-center gap-2 text-black font-bold group-hover:gap-3 transition-all">
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
              <button className="bg-black hover:bg-gray-900 text-white px-10 py-4 font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
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
          <div className="p-6 bg-white border-2 border-gray-100 shadow-lg hover:border-black hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="w-12 h-12 bg-black flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">{t("landing.realData")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.realDataText")}
            </p>
          </div>
          
          <div className="p-6 bg-white border-2 border-gray-100 shadow-lg hover:border-emerald-500 hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="w-12 h-12 bg-emerald-500 flex items-center justify-center mb-3 group-hover:bg-black transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">{t("landing.secure")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.secureText")}
            </p>
          </div>
          
          <div className="p-6 bg-white border-2 border-gray-100 shadow-lg hover:border-black hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="w-12 h-12 bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">{t("landing.fastExecution")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.fastExecutionText")}
            </p>
          </div>
          
          <div className="p-6 bg-white border-2 border-gray-100 shadow-lg hover:border-black hover:shadow-2xl transition-all group" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
            <div className="w-12 h-12 bg-black flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">{t("landing.transparent")}</h3>
            <p className="text-sm text-gray-600">
              {t("landing.transparentText")}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 opacity-5" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 0)'}}></div>
        <div className="container relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("landing.testimonials")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("landing.testimonialsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 shadow-lg border-2 border-gray-100 hover:border-black hover:shadow-2xl transition-all relative group"
                style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}
              >
                <div className="absolute top-4 right-4 text-gray-100 group-hover:text-emerald-100 transition-colors">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
                  {testimonial.photo ? (
                    <img 
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-12 h-12 object-cover flex-shrink-0 shadow-lg border-2 border-white"
                      style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 bg-black flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg"
                      style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}
                    >
                      {testimonial.initials}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500 flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">{t("landing.ssl")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">{t("landing.verifiedReviews")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-black text-white text-xs font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>UA</div>
              <span className="text-sm font-medium">{t("landing.ukrainianPlatform")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners - Two-row sliding logos */}
      <section className="py-16 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white overflow-hidden group/partners">
        <p className="text-center text-gray-400 mb-10 text-sm uppercase tracking-widest font-medium">
          {language === "uk" 
            ? "Інтегровано з провідними платформами" 
            : "Integrated with leading platforms"}
        </p>
        
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Row 1 - slides left */}
          <div className="overflow-hidden mb-8">
            <div 
              className="flex items-center group-hover/partners:[animation-play-state:paused]"
              style={{
                animation: 'slideLeft 35s linear infinite',
                width: 'max-content'
              }}
            >
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center">
                  {[
                    { name: "tradingview", ext: "png", url: "https://www.tradingview.com", h: 48 },
                    { name: "coingecko", ext: "png", url: "https://www.coingecko.com", h: 48 },
                    { name: "coinmarketcap", ext: "svg", url: "https://coinmarketcap.com", h: 40 },
                    { name: "glassnode", ext: "png", url: "https://glassnode.com", h: 36 },
                    { name: "messari", ext: "webp", url: "https://messari.io", h: 40 },
                    { name: "dune", ext: "png", url: "https://dune.com", h: 40 },
                    { name: "defillama", ext: "webp", url: "https://defillama.com", h: 40 },
                    { name: "nansen", ext: "png", url: "https://nansen.ai", h: 40 },
                  ].map((p) => (
                    <a 
                      key={`${p.name}-${setIdx}`} 
                      href={p.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mx-10 flex-shrink-0 opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                    >
                      <img 
                        src={`/logos/partners/${p.name}.${p.ext}`} 
                        alt={p.name} 
                        style={{ height: `${p.h}px`, width: 'auto' }}
                        className="object-contain"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2 - slides right */}
          <div className="overflow-hidden">
            <div 
              className="flex items-center group-hover/partners:[animation-play-state:paused]"
              style={{
                animation: 'slideRight 40s linear infinite',
                width: 'max-content'
              }}
            >
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center">
                  {[
                    { name: "santiment", ext: "png", url: "https://santiment.net", h: 36 },
                    { name: "cryptoquant", ext: "jpg", url: "https://cryptoquant.com", h: 40 },
                    { name: "blockchain", ext: "webp", url: "https://www.blockchain.com", h: 32 },
                    { name: "polygon", ext: "png", url: "https://polygon.io", h: 40 },
                    { name: "alpha-vantage", ext: "png", url: "https://www.alphavantage.co", h: 40 },
                    { name: "yahoo-finance", ext: "png", url: "https://finance.yahoo.com", h: 40 },
                    { name: "quandl", ext: "png", url: "https://www.quandl.com", h: 40 },
                  ].map((p) => (
                    <a 
                      key={`${p.name}-${setIdx}`} 
                      href={p.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mx-10 flex-shrink-0 opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                    >
                      <img 
                        src={`/logos/partners/${p.name}.${p.ext}`} 
                        alt={p.name} 
                        style={{ height: `${p.h}px`, width: 'auto' }}
                        className="object-contain"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Inline keyframes for animation */}
        <style jsx>{`
          @keyframes slideLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes slideRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* CTA */}
      <section className="relative bg-black py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-10" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 0)'}}></div>
        <div className="container text-center text-white relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("landing.readyToAutomate")}</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            {t("landing.ctaSubtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <button className="bg-white text-black px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-0.5" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                {t("landing.createFreeAccount")}
              </button>
            </Link>
            <Link href="/strategies">
              <button className="border-2 border-white text-white px-10 py-4 font-bold text-lg hover:bg-white hover:text-black transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                {t("landing.viewStrategies")}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
