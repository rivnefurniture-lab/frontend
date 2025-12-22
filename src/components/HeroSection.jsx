"use client";

import Link from 'next/link';

export default function HeroSection({ language }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 lg:py-28">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 lg:left-20 w-64 lg:w-96 h-64 lg:h-96 bg-indigo-200 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 lg:right-20 w-72 lg:w-[500px] h-72 lg:h-[500px] bg-blue-200 rounded-full filter blur-3xl" style={{animationDelay: '700ms'}}></div>
      </div>
      
      <div className="container relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Value Proposition */}
          <div className="space-y-8 lg:space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {language === "uk" ? "SaaS Платформа" : "SaaS Platform"}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">{language === "uk" ? "Автоматизуй" : "Automate Your"}</span><br/>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {language === "uk" ? "Аналіз Ринку" : "Market Analysis"}
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              {language === "uk" 
                ? "Створюй, тестуй та запускай аналітичні моделі на історичних даних. Без програмування."
                : "Build, test, and deploy analytical models on historical data. No coding required."}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/auth?mode=signup">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2">
                  {language === "uk" ? "Почати безкоштовно" : "Start Free"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <Link href="/strategies">
                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-indigo-300 transition-all flex items-center gap-2">
                  {language === "uk" ? "Переглянути моделі" : "View Models"}
                </button>
              </Link>
            </div>
            
            {/* Features instead of misleading stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-900">{language === "uk" ? "5 років даних" : "5 Years Data"}</div>
              </div>
              <div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-900">{language === "uk" ? "Безпечно" : "Secure"}</div>
              </div>
              <div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-900">{language === "uk" ? "Швидко" : "Fast"}</div>
              </div>
            </div>
          </div>
          
          {/* Right - Platform Preview */}
          <div className="relative">
            <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-2xl border border-gray-100">
              {/* Window Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {language === "uk" ? "Панель аналітики" : "Analytics Dashboard"}
                </span>
              </div>
              
              {/* Platform Features Preview */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{language === "uk" ? "Створення моделей" : "Model Builder"}</div>
                    <div className="text-xs text-gray-500">{language === "uk" ? "Візуальний конструктор" : "Visual constructor"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{language === "uk" ? "Симуляція" : "Simulation"}</div>
                    <div className="text-xs text-gray-500">{language === "uk" ? "Тестування на історії" : "Historical testing"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{language === "uk" ? "Звіти" : "Reports"}</div>
                    <div className="text-xs text-gray-500">{language === "uk" ? "Детальна аналітика" : "Detailed analytics"}</div>
                  </div>
                </div>
              </div>
              
              {/* Info Note */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700">
                  {language === "uk" 
                    ? "⚠️ Минулі результати не гарантують майбутніх. Це інструмент для аналізу, а не фінансова порада."
                    : "⚠️ Past results don't guarantee future performance. This is an analysis tool, not financial advice."}
                </p>
              </div>
            </div>
            
            {/* Floating Decorations */}
            <div className="hidden lg:block absolute -top-6 -right-6 w-24 h-24 bg-indigo-100 rounded-2xl opacity-50 rotate-12"></div>
            <div className="hidden lg:block absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-2xl opacity-50 -rotate-12"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
