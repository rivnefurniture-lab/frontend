"use client";

import { useState, Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import Link from "next/link";

function PricingContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [billing, setBilling] = useState("monthly");

  const plans = [
    {
      id: "free",
      name: language === "uk" ? "Безкоштовний" : "Free",
      price: 0,
      priceYearly: 0,
      description: language === "uk" ? "Почніть з базових функцій" : "Get started with basic features",
      icon: Zap,
      color: "from-gray-400 to-gray-500",
      features: language === "uk" ? [
        "3 симуляції на день",
        "1 активна модель",
        "Базові індикатори (RSI, MACD, MA)",
        "Підтримка спільноти",
        "Доступ до публічних моделей",
      ] : [
        "3 simulations per day",
        "1 active model",
        "Basic indicators (RSI, MACD, MA)",
        "Community support",
        "Access to public models",
      ],
      buttonText: language === "uk" ? "Поточний план" : "Current Plan",
      isCurrent: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      priceYearly: 23,
      description: language === "uk" ? "Для професійних аналітиків" : "For professional analysts",
      icon: Crown,
      color: "from-black to-gray-800",
      popular: true,
      features: language === "uk" ? [
        "Необмежені симуляції",
        "5 активних моделей",
        "Всі 20+ індикаторів",
        "Пріоритетна підтримка",
        "Розширене управління ризиками",
        "Експорт звітів PDF/CSV",
        "Сповіщення Telegram/Email",
      ] : [
        "Unlimited simulations",
        "5 active models",
        "All 20+ indicators",
        "Priority support",
        "Advanced risk management",
        "PDF/CSV report export",
        "Telegram/Email notifications",
      ],
      buttonText: language === "uk" ? "Почати Pro" : "Start Pro",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      priceYearly: 79,
      description: language === "uk" ? "Для дослідницьких команд" : "For research teams",
      icon: Building2,
      color: "from-purple-500 to-pink-500",
      features: language === "uk" ? [
        "Все з Pro",
        "Необмежені моделі",
        "Виділений сервер обробки",
        "Кастомні індикатори",
        "Персональний менеджер",
        "API доступ",
        "White-label опції",
      ] : [
        "Everything in Pro",
        "Unlimited models",
        "Dedicated processing server",
        "Custom indicators",
        "Personal account manager",
        "API access",
        "White-label options",
      ],
      buttonText: language === "uk" ? "Зв'язатися" : "Contact Us",
    },
  ];

  const pay = (planId) => {
    if (planId === "free") return;
    if (planId === "enterprise") {
      router.push("/support");
      return;
    }
    router.push(`/pay?plan=${planId}&redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 0)'}}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5" style={{clipPath: 'polygon(0 100%, 100% 100%, 0 0)'}}></div>
        
        <div className="container max-w-4xl text-center relative">
          <h1 className="text-4xl font-bold mb-4">
            {language === "uk" ? "Тарифні плани" : "Pricing Plans"}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {language === "uk" 
              ? "Оберіть план, який підходить саме вам. Скасуйте будь-коли."
              : "Choose the plan that's right for you. Cancel anytime."}
          </p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2.5 font-bold transition ${
                billing === "monthly"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
            >
              {language === "uk" ? "Щомісяця" : "Monthly"}
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2.5 font-bold transition flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
            >
              {language === "uk" ? "Щорічно" : "Yearly"}
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                -20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="container py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billing === "yearly" ? plan.priceYearly : plan.price;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white border-2 p-6 transition-all hover:shadow-2xl ${
                  plan.popular ? "border-black scale-105 shadow-xl" : "border-gray-100 hover:border-black"
                }`}
                style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-black text-white text-xs px-4 py-1.5 font-bold" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%)'}}>
                    {language === "uk" ? "Популярний" : "Popular"}
                  </div>
                )}
                <div className="pb-4">
                  <div className={`w-12 h-12 ${plan.popular ? 'bg-black' : 'bg-gray-800'} flex items-center justify-center mb-4`} style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
                <div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${price}</span>
                    {price > 0 && (
                      <span className="text-gray-500">
                        /{language === "uk" ? "міс" : "mo"}
                      </span>
                    )}
                    {billing === "yearly" && price > 0 && (
                      <p className="text-sm text-emerald-600 mt-1 font-medium">
                        {language === "uk" 
                          ? `Економія $${(plan.price - plan.priceYearly) * 12}/рік`
                          : `Save $${(plan.price - plan.priceYearly) * 12}/year`}
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className={`w-full px-4 py-3 font-bold transition-all ${
                      plan.popular
                        ? "bg-black text-white hover:bg-gray-800"
                        : plan.isCurrent
                        ? "bg-gray-100 text-gray-500 cursor-default"
                        : "bg-white border-2 border-black text-black hover:bg-black hover:text-white"
                    }`}
                    style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
                    onClick={() => pay(plan.id)}
                    disabled={plan.isCurrent}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="bg-gray-50 py-12">
        <div className="container max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === "uk" ? "Маєте питання?" : "Have questions?"}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === "uk"
              ? "Перегляньте наші FAQ або зв'яжіться з підтримкою."
              : "Check out our FAQ or contact support."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/faq">
              <button className="px-6 py-3 border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                {language === "uk" ? "Переглянути FAQ" : "View FAQ"}
              </button>
            </Link>
            <Link href="/support">
              <button className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                {language === "uk" ? "Зв'язатися" : "Contact Us"}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Money-back guarantee */}
      <section className="container py-12 max-w-2xl text-center">
        <div className="bg-emerald-50 border-2 border-emerald-200 p-8" style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
          <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-xl font-bold mb-2">
            {language === "uk" ? "14-денна гарантія повернення" : "14-Day Money-Back Guarantee"}
          </h3>
          <p className="text-gray-600">
            {language === "uk"
              ? "Не задоволені? Повне повернення коштів протягом 14 днів, без питань."
              : "Not satisfied? Get a full refund within 14 days, no questions asked."}
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Pricing() {
  return (
    <Suspense
      fallback={
        <div className="container py-10 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}></div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
