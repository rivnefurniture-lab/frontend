"use client";

import Link from 'next/link';

export default function HeroSection({ language }) {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large angular shape top-right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gray-50" style={{clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)'}}></div>
        {/* Small accent shape */}
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-500 opacity-10" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>
      </div>
      
      <div className="container relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Value Proposition */}
          <div className="space-y-8 lg:space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {language === "uk" ? "SaaS Платформа" : "SaaS Platform"}
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
              <span className="text-black">{language === "uk" ? "Автоматизуй" : "Automate"}</span>
              <br/>
              <span className="text-black">{language === "uk" ? "Свій" : "Your"}</span>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-emerald-600">{language === "uk" ? "Аналіз" : "Market"}</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-emerald-100 -z-0"></span>
              </span>
              <br/>
              <span className="text-black">{language === "uk" ? "Ринку" : "Analysis"}</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              {language === "uk" 
                ? "Створюй, тестуй та запускай аналітичні моделі на історичних даних. Без програмування."
                : "Build, test, and deploy analytical models on historical data. No coding required."}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/auth?mode=signup">
                <button className="px-8 py-4 bg-black hover:bg-gray-900 text-white font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-3" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                  {language === "uk" ? "Почати безкоштовно" : "Start Free"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              <Link href="/strategies">
                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-black font-bold border-2 border-black hover:shadow-xl transition-all flex items-center gap-2" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                  {language === "uk" ? "Переглянути моделі" : "View Models"}
                </button>
              </Link>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t-2 border-gray-100">
              <div className="group">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-sm font-bold text-black">{language === "uk" ? "5 років даних" : "5 Years Data"}</div>
              </div>
              <div className="group">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-sm font-bold text-black">{language === "uk" ? "Безпечно" : "Secure"}</div>
              </div>
              <div className="group">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-sm font-bold text-black">{language === "uk" ? "Швидко" : "Fast"}</div>
              </div>
            </div>
          </div>
          
          {/* Right - Platform Preview */}
          <div className="relative">
            {/* Main card */}
            <div className="bg-white p-8 shadow-2xl border-2 border-gray-100" style={{clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))'}}>
              {/* Window Controls */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black"></div>
                  <div className="w-3 h-3 bg-gray-300"></div>
                  <div className="w-3 h-3 bg-gray-200"></div>
                </div>
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  {language === "uk" ? "Панель аналітики" : "Analytics Dashboard"}
                </span>
              </div>
              
              {/* Platform Features Preview */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-black hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{language === "uk" ? "Створення моделей" : "Model Builder"}</div>
                    <div className="text-sm text-gray-500">{language === "uk" ? "Візуальний конструктор" : "Visual constructor"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-emerald-500 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-500 text-white flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{language === "uk" ? "Симуляція" : "Simulation"}</div>
                    <div className="text-sm text-gray-500">{language === "uk" ? "Тестування на історії" : "Historical testing"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{language === "uk" ? "Звіти" : "Reports"}</div>
                    <div className="text-sm text-gray-500">{language === "uk" ? "Детальна аналітика" : "Detailed analytics"}</div>
                  </div>
                </div>
              </div>
              
              {/* Info Note */}
              <div className="p-4 bg-gray-900 text-white" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                <p className="text-sm font-medium">
                  {language === "uk" 
                    ? "⚠️ Минулі результати не гарантують майбутніх. Це інструмент для аналізу."
                    : "⚠️ Past results don't guarantee future performance. This is an analysis tool."}
                </p>
              </div>
            </div>
            
            {/* Floating Decorations */}
            <div className="hidden lg:block absolute -top-8 -right-8 w-32 h-32 bg-emerald-500 opacity-20" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%)'}}></div>
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-40 h-40 bg-black opacity-5" style={{clipPath: 'polygon(0 0, 100% 100%, 0 100%)'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
