"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function RefundPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const t = {
    title: language === "uk" ? "Політика повернення коштів" : "Refund Policy",
    subtitle: language === "uk" 
      ? "Ми віримо в прозорість та справедливість" 
      : "We believe in transparency and fairness",
    
    // Policy sections
    guaranteeTitle: language === "uk" ? "💯 100% Гарантія задоволення" : "💯 100% Satisfaction Guarantee",
    guaranteeText: language === "uk" 
      ? "Ми впевнені в якості нашого продукту. Якщо ви не задоволені, ми повернемо ваші кошти — без питань." 
      : "We're confident in our product quality. If you're not satisfied, we'll refund your money — no questions asked.",
    
    periodTitle: language === "uk" ? "⏰ 14-денний період повернення" : "⏰ 14-Day Refund Period",
    periodText: language === "uk" 
      ? "У вас є 14 днів з моменту оплати, щоб запросити повне повернення коштів. Жодних прихованих умов." 
      : "You have 14 days from the date of payment to request a full refund. No hidden conditions.",
    
    processTitle: language === "uk" ? "⚡ Швидка обробка" : "⚡ Fast Processing",
    processText: language === "uk" 
      ? "Ми обробляємо запити на повернення протягом 3-5 робочих днів. Кошти повертаються тим же способом, яким було здійснено оплату." 
      : "We process refund requests within 3-5 business days. Funds are returned via the same payment method used.",
    
    eligibilityTitle: language === "uk" ? "Умови повернення" : "Eligibility",
    eligibilityItems: language === "uk" ? [
      "Запит подано протягом 14 днів після оплати",
      "Обліковий запис не порушував умови використання",
      "Не було зловживань системою повернень"
    ] : [
      "Request submitted within 14 days of payment",
      "Account hasn't violated terms of service",
      "No abuse of the refund system"
    ],
    
    // Request form
    requestTitle: language === "uk" ? "Запросити повернення коштів" : "Request a Refund",
    reasonLabel: language === "uk" ? "Причина повернення" : "Reason for refund",
    reasonPlaceholder: language === "uk" 
      ? "Поясніть, чому ви хочете повернути кошти..." 
      : "Please explain why you want a refund...",
    submitButton: language === "uk" ? "Надіслати запит" : "Submit Request",
    submitting: language === "uk" ? "Надсилання..." : "Submitting...",
    
    successTitle: language === "uk" ? "Запит надіслано!" : "Request Submitted!",
    successText: language === "uk" 
      ? "Ми отримали ваш запит на повернення коштів. Наша команда розгляне його протягом 3-5 робочих днів та зв'яжеться з вами електронною поштою." 
      : "We've received your refund request. Our team will review it within 3-5 business days and contact you via email.",
    
    loginRequired: language === "uk" ? "Увійдіть для запиту повернення" : "Login to request a refund",
    loginButton: language === "uk" ? "Увійти" : "Login",
    
    contactTitle: language === "uk" ? "Потрібна допомога?" : "Need Help?",
    contactText: language === "uk" 
      ? "Якщо у вас є питання щодо повернення коштів, зв'яжіться з нами:" 
      : "If you have questions about refunds, contact us:",
    
    fairnessNote: language === "uk" 
      ? "🤝 Ми — українська компанія, яка цінує довіру. Ми ніколи не будемо утримувати ваші кошти несправедливо." 
      : "🤝 We're a Ukrainian company that values trust. We'll never hold your money unfairly.",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await apiFetch("/refund/request", {
        method: "POST",
        body: { reason },
      });
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600">{t.subtitle}</p>
      </div>

      {/* Policy Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="font-bold text-lg mb-2">{t.guaranteeTitle.replace("💯 ", "")}</h3>
            <p className="text-gray-600 text-sm">{t.guaranteeText}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="font-bold text-lg mb-2">{t.periodTitle.replace("⏰ ", "")}</h3>
            <p className="text-gray-600 text-sm">{t.periodText}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-lg mb-2">{t.processTitle.replace("⚡ ", "")}</h3>
            <p className="text-gray-600 text-sm">{t.processText}</p>
          </CardContent>
        </Card>
      </div>

      {/* Eligibility */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t.eligibilityTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {t.eligibilityItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Refund Request Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t.requestTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">{t.loginRequired}</p>
              <Link href="/auth">
                <Button>{t.loginButton}</Button>
              </Link>
            </div>
          ) : submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">{t.successTitle}</h3>
              <p className="text-gray-600">{t.successText}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.reasonLabel}</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t.reasonPlaceholder}
                  className="w-full p-3 border rounded-lg min-h-[120px] resize-none"
                  required
                />
              </div>
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t.submitting : t.submitButton}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Fairness Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-8">
        <p className="text-blue-800 font-medium">{t.fairnessNote}</p>
      </div>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>{t.contactTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{t.contactText}</p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:support@algotcha.com" className="flex items-center gap-2 text-blue-600 hover:underline">
              📧 support@algotcha.com
            </a>
            <a href="https://t.me/algotcha_support" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
              💬 Telegram Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

