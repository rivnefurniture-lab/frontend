"use client";

import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const generateEquityCurve = () => {
  const data = [];
  let value = 10000;
  for (let i = 0; i < 52; i++) {
    value *= 1 + (Math.random() * 0.08 - 0.02);
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

export default function HeroSection({ language }) {
  const chartData = generateEquityCurve();
  
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
              {language === "uk" ? "Перевірено аналітиками" : "Trusted by Analysts"}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">{language === "uk" ? "Автоматизуй" : "Automate Your"}</span><br/>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {language === "uk" ? "Аналіз Ринку" : "Market Analysis"}
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              {language === "uk" 
                ? "Створюй, тестуй та запускай аналітичні моделі. Без програмування."
                : "Build, simulate, and deploy analytical models. No coding required."}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/strategies">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2">
                  {language === "uk" ? "Переглянути моделі" : "View Models"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <Link href="/backtest">
                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-indigo-300 transition-all flex items-center gap-2">
                  {language === "uk" ? "Створити власну" : "Build Your Own"}
                </button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-indigo-600">1</div>
                <div className="text-sm text-gray-600 mt-1">{language === "uk" ? "Моделі" : "Models"}</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-indigo-600">2.05</div>
                <div className="text-sm text-gray-600 mt-1">{language === "uk" ? "Сер. Шарп" : "Avg. Sharpe"}</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-indigo-600">386%</div>
                <div className="text-sm text-gray-600 mt-1 whitespace-nowrap">{language === "uk" ? "Макс./рік" : "Best/yr"}</div>
              </div>
            </div>
          </div>
          
          {/* Right - Visual Demo */}
          <div className="relative">
            <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-2xl border border-gray-100">
              {/* Window Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm font-semibold text-green-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  +127% {language === "uk" ? "річних" : "yearly"}
                </span>
              </div>
              
              {/* Chart */}
              <div className="h-48 lg:h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" hide />
                    <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '8px 12px' }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio']}
                      labelFormatter={(label) => `Week ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <div className="text-center p-3 lg:p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">{language === "uk" ? "Початок" : "Starting"}</div>
                  <div className="text-base lg:text-lg font-bold text-gray-900">$10K</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-green-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">{language === "uk" ? "Фінал" : "Final"}</div>
                  <div className="text-base lg:text-lg font-bold text-green-600">$22.7K</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-red-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Max DD</div>
                  <div className="text-base lg:text-lg font-bold text-red-600">-12%</div>
                </div>
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
