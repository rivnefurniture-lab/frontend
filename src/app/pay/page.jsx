"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";

function PayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();
  const { language } = useLanguage();

  const plan = params.get("plan") || "pro";
  const billing = params.get("billing") || "monthly";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = {
    checkout: language === "uk" ? "Оформлення замовлення" : "Checkout",
    selectPayment: language === "uk" ? "Виберіть спосіб оплати для:" : "Select payment method for:",
    payWith: language === "uk" ? "Оплатити через" : "Pay with",
    securePayment: language === "uk" ? "Безпечна оплата через ПриватБанк" : "Secure payment via PrivatBank",
    processingFee: language === "uk" ? "Комісія не стягується" : "No processing fees",
    instantAccess: language === "uk" ? "Миттєвий доступ" : "Instant access",
    backToPricing: language === "uk" ? "Назад до тарифів" : "Back to pricing",
    processing: language === "uk" ? "Обробка..." : "Processing...",
    redirecting: language === "uk" ? "Перенаправлення на LiqPay..." : "Redirecting to LiqPay...",
    planFeatures: language === "uk" ? "Що включено:" : "What's included:",
    moneyBack: language === "uk" ? "14-денна гарантія повернення" : "14-day money-back guarantee",
  };

  const planDetails = {
    free: {
      name: language === "uk" ? "Безкоштовний" : "Free",
      price: 0,
      priceYearly: 0,
      features: language === "uk" ? [
        "3 бектести на день",
        "1 активна стратегія",
        "Базові індикатори",
      ] : [
        "3 backtests per day",
        "1 active strategy",
        "Basic indicators",
      ],
    },
    pro: {
      name: "Pro",
      price: 29,
      priceYearly: 23,
      features: language === "uk" ? [
        "Необмежені бектести",
        "5 активних стратегій",
        "Всі 20+ індикаторів",
        "Пріоритетна підтримка",
        "Експорт звітів",
      ] : [
        "Unlimited backtests",
        "5 active strategies",
        "All 20+ indicators",
        "Priority support",
        "Report exports",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: 99,
      priceYearly: 79,
      features: language === "uk" ? [
        "Все з Pro",
        "Необмежені стратегії",
        "Виділений сервер",
        "Персональний менеджер",
        "API доступ",
      ] : [
        "Everything in Pro",
        "Unlimited strategies",
        "Dedicated server",
        "Personal manager",
        "API access",
      ],
    },
  };

  const currentPlan = planDetails[plan] || planDetails.pro;
  const price = billing === "yearly" ? currentPlan.priceYearly : currentPlan.price;
  const totalPrice = price;
  const savings = billing === "yearly" ? (currentPlan.price - currentPlan.priceYearly) * 12 : 0;

  const payWithLiqPay = async () => {
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call backend to create LiqPay payment
      const result = await publicFetch("/pay/liqpay/create", {
        method: "POST",
        body: JSON.stringify({ 
          planId: plan, 
          billing: billing,
          email: user?.email,
          amount: totalPrice,
        }),
      });

      if (result.checkoutUrl) {
        // Redirect to LiqPay checkout
        window.location.href = result.checkoutUrl;
      } else if (result.formHtml) {
        // LiqPay returns HTML form - render and auto-submit it
        const formContainer = document.createElement('div');
        formContainer.innerHTML = result.formHtml;
        document.body.appendChild(formContainer);
        formContainer.querySelector('form')?.submit();
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (e) {
      setError(e.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Order Summary */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                {language === "uk" ? "Деталі замовлення" : "Order Summary"}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{currentPlan.name}</div>
                    <div className="text-sm text-gray-500">
                      {billing === "yearly" 
                        ? (language === "uk" ? "Щорічна оплата" : "Annual billing") 
                        : (language === "uk" ? "Щомісячна оплата" : "Monthly billing")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${price}</div>
                    <div className="text-sm text-gray-500">
                      /{language === "uk" ? "міс" : "mo"}
                    </div>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm text-green-800">
                      💰 {language === "uk" ? "Економія" : "Save"} <strong>${savings}/year</strong> {language === "uk" ? "з річною підпискою" : "with annual billing"}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">{t.planFeatures}</h3>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{language === "uk" ? "Підсумок" : "Subtotal"}</span>
                    <span>${price}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{language === "uk" ? "Разом" : "Total"}</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span>
                    {t.moneyBack}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Payment Method */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-2xl font-semibold mb-1">{t.checkout}</h1>
              <p className="text-gray-600 mb-6">
                {language === "uk" ? "Безпечна оплата" : "Secure payment"}
              </p>

              {/* LiqPay Payment Button */}
              <div className="space-y-4">
                <Button
                  onClick={payWithLiqPay}
                  disabled={loading}
                  className="w-full h-16 bg-gradient-to-r from-[#7BC928] to-[#5FA319] hover:from-[#6AB020] hover:to-[#4F9214] text-white font-medium text-lg relative overflow-hidden"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
                      {t.processing}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="white">
                        <path d="M20 0C9 0 0 9 0 20s9 20 20 20 20-9 20-20S31 0 20 0zm8 25h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z"/>
                      </svg>
                      <span>{t.payWith} LiqPay</span>
                    </div>
                  )}
                </Button>

                {/* LiqPay Features */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {t.securePayment}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t.instantAccess}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.processingFee}
                  </div>
                </div>

                {/* Accepted Cards */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    {language === "uk" ? "Приймаємо картки" : "We accept"}
                  </p>
                  <div className="flex justify-center gap-3 opacity-60">
                    {/* Visa */}
                    <div className="w-12 h-8 bg-white rounded border flex items-center justify-center text-blue-900 font-bold text-xs">
                      VISA
                    </div>
                    {/* Mastercard */}
                    <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                      <div className="flex gap-[-2px]">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-orange-500 rounded-full -ml-2"></div>
                      </div>
                    </div>
                    {/* PrivatBank */}
                    <div className="w-12 h-8 bg-white rounded border flex items-center justify-center text-[#7BC928] font-bold text-xs">
                      P24
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>

              <Button
                className="w-full mt-6"
                variant="ghost"
                onClick={() => router.push("/pricing")}
              >
                {t.backToPricing}
              </Button>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              {language === "uk" ? "Безпечна оплата" : "Secure Payment"}
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PCI DSS
            </div>
            <div className="flex items-center gap-1">
              🇺🇦 {language === "uk" ? "Українська компанія" : "Ukrainian Company"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Pay() {
  return (
    <Suspense fallback={
      <div className="container py-10 max-w-xl text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    }>
      <PayContent />
    </Suspense>
  );
}
