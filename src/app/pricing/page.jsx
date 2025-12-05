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
        "3 бектести на день",
        "1 активна стратегія",
        "Базові індикатори (RSI, MACD, MA)",
        "Підтримка спільноти",
        "Доступ до публічних стратегій",
      ] : [
        "3 backtests per day",
        "1 active strategy",
        "Basic indicators (RSI, MACD, MA)",
        "Community support",
        "Access to public strategies",
      ],
      buttonText: language === "uk" ? "Поточний план" : "Current Plan",
      isCurrent: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      priceYearly: 23,
      description: language === "uk" ? "Для серйозних трейдерів" : "For serious traders",
      icon: Crown,
      color: "from-blue-500 to-indigo-600",
      popular: true,
      features: language === "uk" ? [
        "Необмежені бектести",
        "5 активних стратегій",
        "Всі 20+ індикаторів",
        "Пріоритетна підтримка",
        "Розширене управління ризиками",
        "Експорт звітів PDF/CSV",
        "Сповіщення Telegram/Email",
      ] : [
        "Unlimited backtests",
        "5 active strategies",
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
      description: language === "uk" ? "Для торгових компаній" : "For trading firms",
      icon: Building2,
      color: "from-purple-500 to-pink-500",
      features: language === "uk" ? [
        "Все з Pro",
        "Необмежені стратегії",
        "Виділений торговий сервер",
        "Кастомні індикатори",
        "Персональний менеджер",
        "API доступ",
        "Білайблінг (White-label)",
      ] : [
        "Everything in Pro",
        "Unlimited strategies",
        "Dedicated trading server",
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
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4">
            {language === "uk" ? "Тарифні плани" : "Pricing Plans"}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {language === "uk" 
              ? "Оберіть план, який підходить саме вам. Скасуйте будь-коли."
              : "Choose the plan that's right for you. Cancel anytime."}
          </p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                billing === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {language === "uk" ? "Щомісяця" : "Monthly"}
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {language === "uk" ? "Щорічно" : "Yearly"}
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
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
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all hover:shadow-xl ${
                  plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    {language === "uk" ? "Популярний" : "Popular"}
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${price}</span>
                    {price > 0 && (
                      <span className="text-gray-500">
                        /{language === "uk" ? "міс" : "mo"}
                      </span>
                    )}
                    {billing === "yearly" && price > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        {language === "uk" 
                          ? `Економія $${(plan.price - plan.priceYearly) * 12}/рік`
                          : `Save $${(plan.price - plan.priceYearly) * 12}/year`}
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : plan.isCurrent
                        ? "bg-gray-100 text-gray-500 cursor-default"
                        : ""
                    }`}
                    onClick={() => pay(plan.id)}
                    disabled={plan.isCurrent}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
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
              <Button variant="outline">
                {language === "uk" ? "Переглянути FAQ" : "View FAQ"}
              </Button>
            </Link>
            <Link href="/support">
              <Button>
                {language === "uk" ? "Зв'язатися" : "Contact Us"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Money-back guarantee */}
      <section className="container py-12 max-w-2xl text-center">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
          <div className="text-4xl mb-4">💰</div>
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
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
