"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const faqsData = {
  en: [
    {
      category: "Getting Started",
      items: [
        {
          q: "What is Algotcha?",
          a: "Algotcha is an algorithmic trading platform that lets you automate your crypto trading using proven strategies. You can browse pre-built strategies, backtest your own ideas, and run them 24/7 on your exchange account.",
        },
        {
          q: "How do I get started?",
          a: "1. Create a free account. 2. Browse our featured strategies or build your own using the backtest tool. 3. Connect your exchange (Binance, Bybit, or OKX) with API keys. 4. Select a strategy and start live trading. That's it!",
        },
        {
          q: "Is it free to use?",
          a: "You can browse strategies, run backtests, and explore the platform for free. Live trading requires a subscription plan. We offer different tiers based on your trading needs.",
        },
        {
          q: "Which exchanges are supported?",
          a: "We currently support Binance, Bybit, and OKX. More exchanges will be added based on user demand. All major spot trading pairs are available.",
        },
      ],
    },
    {
      category: "Security & Safety",
      items: [
        {
          q: "Is my money safe?",
          a: "Your funds never leave your exchange. We only use API keys with trading permissions — never withdrawal access. You maintain full custody of your assets at all times.",
        },
        {
          q: "How are my API keys protected?",
          a: "API keys are encrypted using industry-standard encryption before storage. They are only decrypted on our secure trading server when executing trades. We recommend enabling IP whitelisting on your exchange for additional security.",
        },
        {
          q: "What IP should I whitelist?",
          a: "Our trading server IP is 46.224.99.27. Whitelisting this IP on your exchange ensures only our server can execute trades with your API keys, adding an extra layer of security.",
        },
        {
          q: "Can you withdraw my funds?",
          a: "No. When creating API keys, you should ONLY enable trading permissions. Never enable withdrawals. This is a fundamental security practice we strongly recommend.",
        },
      ],
    },
    {
      category: "Strategies & Backtesting",
      items: [
        {
          q: "How accurate are the backtests?",
          a: "Our backtests use real 1-minute OHLCV data from Binance going back to 2020. We account for trading fees and realistic execution. However, past performance doesn't guarantee future results — slippage and market conditions vary.",
        },
        {
          q: "What indicators are available?",
          a: "We support 20+ technical indicators including RSI, MACD, Bollinger Bands, Moving Averages, Stochastic, ATR, CCI, ADX, Ichimoku, and more. Each indicator can be customized with your preferred parameters.",
        },
        {
          q: "Can I create my own strategy?",
          a: "Yes! Use our visual backtest builder to combine indicators and create custom entry/exit conditions. Test your strategy against 5 years of data before going live.",
        },
        {
          q: "How often are strategy results updated?",
          a: "Featured strategies are recalculated every hour using the latest market data. This ensures the performance metrics you see reflect current market conditions.",
        },
      ],
    },
    {
      category: "Trading & Execution",
      items: [
        {
          q: "How quickly are trades executed?",
          a: "Trades are executed on a dedicated server with a static IP, ensuring low-latency connections to exchanges. Market orders are typically filled within seconds.",
        },
        {
          q: "What happens if the server goes down?",
          a: "Your open positions remain on the exchange. We have monitoring and auto-restart systems in place. If extended downtime occurs, you can manually manage positions from your exchange.",
        },
        {
          q: "Can I set stop losses and take profits?",
          a: "Yes. Our backtest and live trading support stop loss, take profit, trailing stops, and safety orders (DCA). You can configure risk management for each strategy.",
        },
        {
          q: "What trading pairs are available?",
          a: "We support all major crypto pairs against USDT including BTC, ETH, SOL, XRP, ADA, DOGE, AVAX, LINK, DOT, NEAR, LTC, and more. 17 pairs with full historical data.",
        },
      ],
    },
    {
      category: "Account & Billing",
      items: [
        {
          q: "How do I cancel my subscription?",
          a: "You can cancel anytime from your account settings. Your subscription will remain active until the end of the billing period.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept Binance Pay and direct crypto payments (USDT). More payment options coming soon.",
        },
        {
          q: "Is there a free trial?",
          a: "Yes! You can explore the platform, run backtests, and analyze strategies without any payment. Only live trading requires a subscription.",
        },
        {
          q: "What is the refund policy?",
          a: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund — no questions asked.",
        },
      ],
    },
  ],
  uk: [
    {
      category: "Початок роботи",
      items: [
        {
          q: "Що таке Algotcha?",
          a: "Algotcha — це платформа для алгоритмічної торгівлі, яка дозволяє автоматизувати вашу крипто-торгівлю за допомогою перевірених стратегій. Ви можете переглядати готові стратегії, тестувати власні ідеї та запускати їх 24/7 на вашому біржовому акаунті.",
        },
        {
          q: "Як почати?",
          a: "1. Створіть безкоштовний акаунт. 2. Перегляньте наші популярні стратегії або створіть власну за допомогою бектестера. 3. Підключіть біржу (Binance, Bybit або OKX) за допомогою API ключів. 4. Виберіть стратегію та почніть живу торгівлю. Це все!",
        },
        {
          q: "Це безкоштовно?",
          a: "Ви можете переглядати стратегії, запускати бектести та досліджувати платформу безкоштовно. Жива торгівля вимагає підписки. Ми пропонуємо різні тарифи залежно від ваших потреб.",
        },
        {
          q: "Які біржі підтримуються?",
          a: "Наразі ми підтримуємо Binance, Bybit та OKX. Більше бірж буде додано за запитом користувачів. Доступні всі основні спотові торгові пари.",
        },
      ],
    },
    {
      category: "Безпека",
      items: [
        {
          q: "Чи в безпеці мої кошти?",
          a: "Ваші кошти ніколи не покидають біржу. Ми використовуємо лише API ключі з правами на торгівлю — ніколи на виведення. Ви завжди зберігаєте повний контроль над своїми активами.",
        },
        {
          q: "Як захищені мої API ключі?",
          a: "API ключі шифруються за допомогою стандартного шифрування перед збереженням. Вони розшифровуються лише на нашому захищеному торговому сервері під час виконання угод. Рекомендуємо увімкнути білий список IP на біржі для додаткової безпеки.",
        },
        {
          q: "Яку IP-адресу додати в білий список?",
          a: "IP нашого торгового сервера: 46.224.99.27. Додавання цієї IP на біржі гарантує, що тільки наш сервер може виконувати угоди з вашими API ключами.",
        },
        {
          q: "Чи можете ви вивести мої кошти?",
          a: "Ні. При створенні API ключів ви повинні увімкнути ТІЛЬКИ права на торгівлю. Ніколи не вмикайте виведення. Це фундаментальна практика безпеки.",
        },
      ],
    },
    {
      category: "Стратегії та бектестинг",
      items: [
        {
          q: "Наскільки точні бектести?",
          a: "Наші бектести використовують реальні хвилинні OHLCV дані з Binance з 2020 року. Ми враховуємо торгові комісії та реалістичне виконання. Однак минулі результати не гарантують майбутніх — проскок та ринкові умови варіюються.",
        },
        {
          q: "Які індикатори доступні?",
          a: "Ми підтримуємо 20+ технічних індикаторів, включаючи RSI, MACD, Bollinger Bands, Moving Averages, Stochastic, ATR, CCI, ADX, Ichimoku та інші. Кожен індикатор можна налаштувати.",
        },
        {
          q: "Чи можу я створити власну стратегію?",
          a: "Так! Використовуйте наш візуальний бектестер для комбінування індикаторів та створення умов входу/виходу. Протестуйте стратегію на 5 роках даних перед запуском.",
        },
        {
          q: "Як часто оновлюються результати стратегій?",
          a: "Популярні стратегії перераховуються щогодини з використанням найновіших ринкових даних. Це гарантує, що показники відображають поточні ринкові умови.",
        },
      ],
    },
    {
      category: "Торгівля та виконання",
      items: [
        {
          q: "Як швидко виконуються угоди?",
          a: "Угоди виконуються на виділеному сервері зі статичним IP, що забезпечує з'єднання з низькою затримкою. Ринкові ордери зазвичай виконуються за секунди.",
        },
        {
          q: "Що буде, якщо сервер впаде?",
          a: "Ваші відкриті позиції залишаються на біржі. Ми маємо системи моніторингу та автоматичного перезапуску. При тривалому простої ви можете керувати позиціями вручну з біржі.",
        },
        {
          q: "Чи можу я встановити stop loss і take profit?",
          a: "Так. Наш бектест та жива торгівля підтримують stop loss, take profit, trailing stop та safety orders (DCA). Ви можете налаштувати управління ризиками для кожної стратегії.",
        },
        {
          q: "Які торгові пари доступні?",
          a: "Ми підтримуємо всі основні криптопари до USDT, включаючи BTC, ETH, SOL, XRP, ADA, DOGE, AVAX, LINK, DOT, NEAR, LTC та інші. 17 пар з повними історичними даними.",
        },
      ],
    },
    {
      category: "Акаунт та оплата",
      items: [
        {
          q: "Як скасувати підписку?",
          a: "Ви можете скасувати будь-коли в налаштуваннях акаунта. Підписка залишиться активною до кінця оплаченого періоду.",
        },
        {
          q: "Які способи оплати приймаються?",
          a: "Ми приймаємо Binance Pay та прямі криптоплатежі (USDT). Більше способів оплати скоро.",
        },
        {
          q: "Чи є безкоштовний пробний період?",
          a: "Так! Ви можете досліджувати платформу, запускати бектести та аналізувати стратегії без оплати. Тільки жива торгівля вимагає підписки.",
        },
        {
          q: "Яка політика повернення коштів?",
          a: "Ми пропонуємо 14-денну гарантію повернення грошей для всіх платних планів. Якщо ви не задоволені, зверніться до підтримки для повного повернення — без питань.",
        },
      ],
    },
  ],
};

export default function FAQPage() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = faqsData[language] || faqsData.en;

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">
            {language === "uk" ? "Часті запитання" : "Frequently Asked Questions"}
          </h1>
          <p className="text-gray-600 text-lg">
            {language === "uk"
              ? "Все, що вам потрібно знати про Algotcha. Не знайшли відповідь?"
              : "Everything you need to know about Algotcha. Can't find what you're looking for?"}{" "}
            <Link href="/support" className="text-blue-600 hover:underline">
              {language === "uk" ? "Зв'яжіться з підтримкою" : "Contact support"}
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="container max-w-3xl py-12">
        {faqs.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq, itemIndex) => {
                const currentIndex = globalIndex++;
                const isOpen = openIndex === currentIndex;

                return (
                  <div
                    key={itemIndex}
                    className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggle(currentIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${currentIndex}`}
                    >
                      <span className="font-medium pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-answer-${currentIndex}`}
                        className="px-6 pb-4 text-gray-600 leading-relaxed border-t bg-gray-50"
                      >
                        <p className="pt-4">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Still have questions */}
      <section className="bg-blue-50 py-12">
        <div className="container max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === "uk" ? "Ще маєте питання?" : "Still have questions?"}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === "uk"
              ? "Наша команда підтримки готова допомогти. Зверніться до нас і ми відповімо якнайшвидше."
              : "Our support team is here to help. Reach out and we'll get back to you as soon as possible."}
          </p>
          <Link href="/support">
            <Button>
              {language === "uk" ? "Зв'язатися з підтримкою" : "Contact Support"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
