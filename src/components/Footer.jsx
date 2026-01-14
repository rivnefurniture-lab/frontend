"use client";

import { useState } from "react";
import Link from 'next/link';
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    await new Promise(r => setTimeout(r, 800));
    setSubscribed(true);
    setEmail("");
    setSubscribing(false);
  };

  return (
    <footer className='bg-black text-white mt-16'>
      {/* Newsletter Section */}
      <div className="bg-white relative overflow-hidden border-t-2 border-gray-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-5" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}}></div>
        <div className="container py-16 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="text-center md:text-left flex-1">
              <h3 className="text-3xl font-bold mb-3 text-black">
                {language === "uk" ? "Підпишіться на новини" : "Stay Updated"}
              </h3>
              <p className="text-gray-600 text-lg">
                {language === "uk" 
                  ? "Отримуйте оновлення стратегій та новини ринку"
                  : "Get strategy updates and market insights"}
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-3 text-white bg-emerald-500 px-8 py-4 font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{language === "uk" ? "Підписано!" : "Subscribed!"}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto shadow-xl overflow-hidden border-2 border-black">
                <input
                  type="email"
                  placeholder={language === "uk" ? "example@mail.com" : "your@email.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-6 py-4 text-gray-900 w-full md:w-80 focus:outline-none bg-white placeholder-gray-400 font-medium"
                  aria-label={language === "uk" ? "Email для підписки" : "Email for newsletter"}
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-black hover:bg-gray-900 px-8 py-4 font-bold transition whitespace-nowrap disabled:opacity-50 text-white"
                >
                  {subscribing 
                    ? "..." 
                    : language === "uk" ? "Підписатись" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='container py-16'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-12'>
          {/* Brand */}
          <div className='col-span-2 md:col-span-1'>
            <Link href="/" className="inline-block">
              <img src="/logo-white.svg" alt="Algotcha" className="h-8 mb-6" />
            </Link>
            <p className='text-gray-400 text-sm leading-relaxed'>
              {language === "uk" 
                ? "Автоматизуй свій аналіз ринку за допомогою потужних аналітичних моделей. SaaS платформа для дослідження даних."
                : "Automate your market analysis with powerful analytical models. SaaS platform for data research."}
            </p>
            
            {/* Company Info */}
            <div className="mt-6 text-sm text-gray-500 space-y-1">
              <p className="font-bold text-gray-300">
                {language === "uk" ? "ТОВ \"Алготча\"" : "LLC \"Algotcha\""}
              </p>
              <p>{language === "uk" ? "Код: 46116338" : "Code: 46116338"}</p>
              <p className="leading-relaxed">
                {language === "uk" 
                  ? "вул. Лук'яненка Левка, 21, кв. 32"
                  : "21 Lukyanenka Levka St., apt. 32"}
                <br />
                {language === "uk" ? "м. Київ, 04212, Україна" : "Kyiv, 04212, Ukraine"}
              </p>
              <p>
                <a href="mailto:support@algotcha.com" className="hover:text-white transition">
                  support@algotcha.com
                </a>
              </p>
              <p>
                <a href="tel:+380977685724" className="hover:text-white transition">
                  +38 (097) 768-57-24
                </a>
              </p>
            </div>
            
            {/* Payment Partners */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">
                {language === "uk" ? "Приймаємо платежі" : "We accept"}
              </p>
              <a 
                href="https://www.liqpay.ua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition"
              >
                <img 
                  src="/liqpay-logo.svg" 
                  alt="LiqPay" 
                  className="h-6 opacity-90"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'inline-block';
                  }}
                />
                <span className="text-emerald-400 font-bold text-sm hidden">LiqPay</span>
              </a>
            </div>
            
            {/* Social Links */}
            <div className='flex gap-3 mt-6'>
              <a href="https://twitter.com/algotcha" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-emerald-500 flex items-center justify-center transition-all text-gray-400 hover:text-white" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://t.me/algotcha" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-emerald-500 flex items-center justify-center transition-all text-gray-400 hover:text-white" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="https://discord.gg/algotcha" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-emerald-500 flex items-center justify-center transition-all text-gray-400 hover:text-white" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className='font-bold mb-6 text-white uppercase tracking-wider text-sm'>{t("footer.product")}</h4>
            <nav className='flex flex-col gap-3 text-sm text-gray-400'>
              <Link href='/strategies' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("nav.strategies")}</Link>
              <Link href='/backtest' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("nav.backtest")}</Link>
              <Link href='/connect' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("nav.connectExchange")}</Link>
              <Link href='/pricing' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("nav.pricing")}</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className='font-bold mb-6 text-white uppercase tracking-wider text-sm'>{t("footer.company")}</h4>
            <nav className='flex flex-col gap-3 text-sm text-gray-400'>
              <Link href='/about' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("footer.about")}</Link>
              <Link href='/faq' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("footer.faq")}</Link>
              <Link href='/support' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("footer.support")}</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className='font-bold mb-6 text-white uppercase tracking-wider text-sm'>{t("footer.legal")}</h4>
            <nav className='flex flex-col gap-3 text-sm text-gray-400'>
              <Link href='/legal#terms' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("footer.terms")}</Link>
              <Link href='/legal#privacy' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("footer.privacy")}</Link>
              <Link href='/legal#risk' className='hover:text-white transition hover:translate-x-1 inline-block'>{t("footer.risk")}</Link>
              <Link href='/refund' className='hover:text-white transition hover:translate-x-1 inline-block'>
                {language === "uk" ? "Повернення коштів" : "Refund Policy"}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-800'>
        <div className='container py-6 flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-500'>
          <p className="font-medium">© {new Date().getFullYear()} Algotcha. {t("footer.allRightsReserved")}</p>
          <div className='flex gap-6'>
            <span className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
              <span className="font-medium">{language === "uk" ? "Всі системи працюють" : "All systems operational"}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
