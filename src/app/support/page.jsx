"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SupportPage() {
  const { language } = useLanguage();
  const [form, setForm] = useState({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = {
    title: language === "uk" ? "Як ми можемо допомогти?" : "How Can We Help?",
    subtitle:
      language === "uk"
        ? "Наша команда тут, щоб допомогти вам досягти успіху в алгоритмічній торгівлі."
        : "Our team is here to help you succeed with algorithmic trading.",
    faqTitle: language === "uk" ? "FAQ" : "FAQ",
    faqDesc:
      language === "uk"
        ? "Знайдіть відповіді на поширені питання про торгівлю, безпеку та оплату."
        : "Find answers to common questions about trading, security, and billing.",
    browseFaq: language === "uk" ? "Переглянути FAQ →" : "Browse FAQ →",
    telegramTitle: "Telegram",
    telegramDesc:
      language === "uk"
        ? "Приєднуйтесь до нашої спільноти для допомоги в реальному часі."
        : "Join our community for real-time help and discussions.",
    joinTelegram: language === "uk" ? "Приєднатись до Telegram →" : "Join Telegram →",
    emailTitle: language === "uk" ? "Email" : "Email",
    emailDesc:
      language === "uk"
        ? "Для детальних запитів зв'яжіться з нами напряму."
        : "For detailed inquiries, reach us directly via email.",
    sendMessage: language === "uk" ? "Надіслати повідомлення" : "Send Us a Message",
    yourEmail: language === "uk" ? "Ваш Email" : "Your Email",
    subject: language === "uk" ? "Тема" : "Subject",
    selectTopic: language === "uk" ? "Виберіть тему..." : "Select a topic...",
    message: language === "uk" ? "Повідомлення" : "Message",
    messagePlaceholder:
      language === "uk"
        ? "Опишіть вашу проблему або питання детально..."
        : "Describe your issue or question in detail...",
    send: language === "uk" ? "Надіслати" : "Send Message",
    sending: language === "uk" ? "Надсилання..." : "Sending...",
    messageSent: language === "uk" ? "Повідомлення надіслано!" : "Message Sent!",
    willReply:
      language === "uk"
        ? "Ми відповімо протягом 24 годин."
        : "We'll get back to you within 24 hours.",
    sendAnother:
      language === "uk" ? "Надіслати ще одне повідомлення" : "Send Another Message",
    responseTime:
      language === "uk"
        ? "⏱ Час відповіді: Зазвичай ми відповідаємо протягом 24 годин. Для термінових питань, будь ласка, перегляньте наш FAQ."
        : "⏱ Response Time: We typically respond within 24 hours. For urgent trading issues, please check our FAQ first.",
    topics: {
      account: language === "uk" ? "Акаунт та вхід" : "Account & Login",
      exchange: language === "uk" ? "Підключення біржі" : "Exchange Connection",
      strategy: language === "uk" ? "Стратегії та бектестинг" : "Strategies & Backtesting",
      trading: language === "uk" ? "Жива торгівля" : "Live Trading",
      billing: language === "uk" ? "Оплата та підписка" : "Billing & Subscription",
      bug: language === "uk" ? "Повідомлення про баг" : "Bug Report",
      feature: language === "uk" ? "Запит функції" : "Feature Request",
      other: language === "uk" ? "Інше" : "Other",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending (in production, this would hit an API)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setForm({ email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-16 text-white">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">{t.title}</h1>
          <p className="text-gray-300 text-lg">{t.subtitle}</p>
        </div>
      </section>

      <div className="container max-w-5xl py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Help Options */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border-2 border-gray-100 p-5 hover:border-black transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
              <div className="w-10 h-10 bg-black flex items-center justify-center mb-3" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">{t.faqTitle}</h3>
              <p className="text-sm text-gray-600 mb-3">{t.faqDesc}</p>
              <Link href="/faq" className="text-black font-medium text-sm hover:underline">
                {t.browseFaq}
              </Link>
            </div>

            <div className="bg-white border-2 border-gray-100 p-5 hover:border-black transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
              <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center mb-3" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">{t.telegramTitle}</h3>
              <p className="text-sm text-gray-600 mb-3">{t.telegramDesc}</p>
              <a
                href="https://t.me/algotcha"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-medium text-sm hover:underline"
              >
                {t.joinTelegram}
              </a>
            </div>

            <div className="bg-white border-2 border-gray-100 p-5 hover:border-black transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
              <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mb-3" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">{t.emailTitle}</h3>
              <p className="text-sm text-gray-600 mb-3">{t.emailDesc}</p>
              <a
                href="mailto:support@algotcha.com"
                className="text-black font-medium text-sm hover:underline"
              >
                support@algotcha.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white border-2 border-gray-100 p-6 shadow-xl" style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              <h2 className="text-xl font-bold mb-6">{t.sendMessage}</h2>

              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center mx-auto mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.messageSent}</h3>
                  <p className="text-gray-600 mb-4">{t.willReply}</p>
                  <Button onClick={() => setStatus(null)} className="btn-secondary">
                    {t.sendAnother}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      {t.yourEmail}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      {t.subject}
                    </label>
                    <select
                      id="subject"
                      className="w-full"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      aria-required="true"
                    >
                      <option value="">{t.selectTopic}</option>
                      <option value="account">{t.topics.account}</option>
                      <option value="exchange">{t.topics.exchange}</option>
                      <option value="strategy">{t.topics.strategy}</option>
                      <option value="trading">{t.topics.trading}</option>
                      <option value="billing">{t.topics.billing}</option>
                      <option value="bug">{t.topics.bug}</option>
                      <option value="feature">{t.topics.feature}</option>
                      <option value="other">{t.topics.other}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      {t.message}
                    </label>
                    <textarea
                      id="message"
                      className="w-full h-40 p-4 border-2 border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder={t.messagePlaceholder}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>

                  <Button type="submit" className="w-full btn-primary" disabled={loading}>
                    {loading ? t.sending : t.send}
                  </Button>
                </form>
              )}
            </div>

            {/* Response Time */}
            <div className="mt-6 p-4 bg-gray-900 text-white text-sm" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
              {t.responseTime.split("FAQ").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <Link href="/faq" className="underline text-emerald-400">
                      FAQ
                    </Link>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
