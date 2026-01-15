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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-16 text-white">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">{t.title}</h1>
          <p className="text-xl text-gray-300">{t.subtitle}</p>
        </div>
      </section>

      <div className="container py-10 max-w-4xl">
        {/* Policy Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-gray-100 text-center p-6 hover:border-black transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
            <div className="w-14 h-14 bg-emerald-500 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
              <span className="text-white text-2xl">💯</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{t.guaranteeTitle.replace("💯 ", "")}</h3>
            <p className="text-gray-600 text-sm">{t.guaranteeText}</p>
          </div>
          
          <div className="bg-white border-2 border-gray-100 text-center p-6 hover:border-black transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
            <div className="w-14 h-14 bg-black flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
              <span className="text-white text-2xl">⏰</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{t.periodTitle.replace("⏰ ", "")}</h3>
            <p className="text-gray-600 text-sm">{t.periodText}</p>
          </div>
          
          <div className="bg-white border-2 border-gray-100 text-center p-6 hover:border-black transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
            <div className="w-14 h-14 bg-gray-800 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{t.processTitle.replace("⚡ ", "")}</h3>
            <p className="text-gray-600 text-sm">{t.processText}</p>
          </div>
        </div>

        {/* Eligibility */}
        <Card className="mb-8 card-geometric">
          <CardHeader>
            <CardTitle>{t.eligibilityTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {t.eligibilityItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-500 flex items-center justify-center text-white text-xs" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Refund Request Form */}
        <Card className="mb-8 card-geometric">
          <CardHeader>
            <CardTitle>{t.requestTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">{t.loginRequired}</p>
                <Link href="/auth">
                  <Button className="btn-primary">{t.loginButton}</Button>
                </Link>
              </div>
            ) : submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
                  <span className="text-white text-3xl">✓</span>
                </div>
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
                    className="w-full p-3 border-2 border-gray-200 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                
                {error && (
                  <p className="text-red-600 text-sm p-3 bg-red-50 border-2 border-red-200" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>{error}</p>
                )}
                
                <Button type="submit" className="w-full btn-primary" disabled={submitting}>
                  {submitting ? t.submitting : t.submitButton}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Fairness Note */}
        <div className="bg-emerald-50 border-2 border-emerald-200 p-6 text-center mb-8" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
          <p className="text-emerald-800 font-medium">{t.fairnessNote}</p>
        </div>

        {/* Contact */}
        <Card className="card-geometric">
          <CardHeader>
            <CardTitle>{t.contactTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{t.contactText}</p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:support@algotcha.com" className="flex items-center gap-2 text-black font-medium hover:underline">
                📧 support@algotcha.com
              </a>
              <a href="https://t.me/algotcha_support" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black font-medium hover:underline">
                💬 Telegram Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

