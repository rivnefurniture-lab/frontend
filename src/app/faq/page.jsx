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
          a: "Algotcha is an analytical platform that lets you automate your market research using proven models. You can browse pre-built analytical models, simulate your own ideas, and run them 24/7 with your data sources.",
        },
        {
          q: "How do I get started?",
          a: "1. Create a free account. 2. Browse our featured models or build your own using the simulation tool. 3. Connect your data source with API keys. 4. Select a model and start live analysis. That's it!",
        },
        {
          q: "Is it free to use?",
          a: "You can browse models, run simulations, and explore the platform for free. Live analysis requires a subscription plan. We offer different tiers based on your needs.",
        },
        {
          q: "Which data sources are supported?",
          a: "We currently support multiple data providers including TradingView, Polygon.io, and others. More integrations will be added based on user demand.",
        },
      ],
    },
    {
      category: "Security & Safety",
      items: [
        {
          q: "Is my data safe?",
          a: "Your data never leaves your control. We only use API keys with read-only permissions — never write access. You maintain full control of your data at all times.",
        },
        {
          q: "How are my API keys protected?",
          a: "API keys are encrypted using industry-standard encryption before storage. They are only decrypted on our secure server when accessing data. We recommend enabling IP whitelisting for additional security.",
        },
        {
          q: "What IP should I whitelist?",
          a: "Our server IP is 46.224.99.27. Whitelisting this IP on your data provider ensures only our server can access data with your API keys, adding an extra layer of security.",
        },
        {
          q: "Can you modify my data?",
          a: "No. When creating API keys, you should ONLY enable read-only permissions. Never enable write access. This is a fundamental security practice we strongly recommend.",
        },
      ],
    },
    {
      category: "Models & Simulations",
      items: [
        {
          q: "How accurate are the simulations?",
          a: "Our simulations use real 1-minute OHLCV data going back to 2020. We account for realistic conditions. However, past performance doesn't guarantee future results — market conditions vary.",
        },
        {
          q: "What indicators are available?",
          a: "We support 20+ technical indicators including RSI, MACD, Bollinger Bands, Moving Averages, Stochastic, ATR, CCI, ADX, Ichimoku, and more. Each indicator can be customized with your preferred parameters.",
        },
        {
          q: "Can I create my own model?",
          a: "Yes! Use our visual simulation builder to combine indicators and create custom entry/exit conditions. Test your model against 5 years of data before going live.",
        },
        {
          q: "How often are model results updated?",
          a: "Featured models are recalculated every hour using the latest market data. This ensures the performance metrics you see reflect current market conditions.",
        },
      ],
    },
    {
      category: "Analysis & Processing",
      items: [
        {
          q: "How quickly is data processed?",
          a: "Data is processed on a dedicated server with a static IP, ensuring low-latency connections to data sources. Analysis is typically completed within seconds.",
        },
        {
          q: "What happens if the server goes down?",
          a: "Your analysis history remains accessible. We have monitoring and auto-restart systems in place. If extended downtime occurs, you can access your data from your account.",
        },
        {
          q: "Can I set alerts and notifications?",
          a: "Yes. Our platform supports email and Telegram notifications. You can configure alerts for each model based on your preferences.",
        },
        {
          q: "What assets are available?",
          a: "We support analysis for multiple asset classes including stocks, indices, commodities, and more. 17+ assets with full historical data.",
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
          a: "We accept payments through LiqPay including Visa, Mastercard, and PrivatBank cards. All payments are processed securely.",
        },
        {
          q: "Is there a free trial?",
          a: "Yes! You can explore the platform, run simulations, and analyze models without any payment. Only live analysis requires a subscription.",
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
          a: "Algotcha — це аналітична платформа, яка дозволяє автоматизувати ваші дослідження ринку за допомогою перевірених моделей. Ви можете переглядати готові аналітичні моделі, симулювати власні ідеї та запускати їх 24/7 з вашими джерелами даних.",
        },
        {
          q: "Як почати?",
          a: "1. Створіть безкоштовний акаунт. 2. Перегляньте наші популярні моделі або створіть власну за допомогою симулятора. 3. Підключіть джерело даних за допомогою API ключів. 4. Виберіть модель та почніть живий аналіз. Це все!",
        },
        {
          q: "Це безкоштовно?",
          a: "Ви можете переглядати моделі, запускати симуляції та досліджувати платформу безкоштовно. Живий аналіз вимагає підписки. Ми пропонуємо різні тарифи залежно від ваших потреб.",
        },
        {
          q: "Які джерела даних підтримуються?",
          a: "Наразі ми підтримуємо кілька постачальників даних, включаючи TradingView, Polygon.io та інші. Більше інтеграцій буде додано за запитом користувачів.",
        },
      ],
    },
    {
      category: "Безпека",
      items: [
        {
          q: "Чи в безпеці мої дані?",
          a: "Ваші дані ніколи не покидають ваш контроль. Ми використовуємо лише API ключі з правами на читання — ніколи на запис. Ви завжди зберігаєте повний контроль над своїми даними.",
        },
        {
          q: "Як захищені мої API ключі?",
          a: "API ключі шифруються за допомогою стандартного шифрування перед збереженням. Вони розшифровуються лише на нашому захищеному сервері під час доступу до даних. Рекомендуємо увімкнути білий список IP для додаткової безпеки.",
        },
        {
          q: "Яку IP-адресу додати в білий список?",
          a: "IP нашого сервера: 46.224.99.27. Додавання цієї IP у провайдера даних гарантує, що тільки наш сервер може отримувати дані з вашими API ключами.",
        },
        {
          q: "Чи можете ви змінити мої дані?",
          a: "Ні. При створенні API ключів ви повинні увімкнути ТІЛЬКИ права на читання. Ніколи не вмикайте права на запис. Це фундаментальна практика безпеки.",
        },
      ],
    },
    {
      category: "Моделі та симуляції",
      items: [
        {
          q: "Наскільки точні симуляції?",
          a: "Наші симуляції використовують реальні хвилинні OHLCV дані з 2020 року. Ми враховуємо реалістичні умови. Однак минулі результати не гарантують майбутніх — ринкові умови варіюються.",
        },
        {
          q: "Які індикатори доступні?",
          a: "Ми підтримуємо 20+ технічних індикаторів, включаючи RSI, MACD, Bollinger Bands, Moving Averages, Stochastic, ATR, CCI, ADX, Ichimoku та інші. Кожен індикатор можна налаштувати.",
        },
        {
          q: "Чи можу я створити власну модель?",
          a: "Так! Використовуйте наш візуальний симулятор для комбінування індикаторів та створення умов входу/виходу. Протестуйте модель на 5 роках даних перед запуском.",
        },
        {
          q: "Як часто оновлюються результати моделей?",
          a: "Популярні моделі перераховуються щогодини з використанням найновіших ринкових даних. Це гарантує, що показники відображають поточні ринкові умови.",
        },
      ],
    },
    {
      category: "Аналіз та обробка",
      items: [
        {
          q: "Як швидко обробляються дані?",
          a: "Дані обробляються на виділеному сервері зі статичним IP, що забезпечує з'єднання з низькою затримкою. Аналіз зазвичай завершується за секунди.",
        },
        {
          q: "Що буде, якщо сервер впаде?",
          a: "Ваша історія аналізу залишається доступною. Ми маємо системи моніторингу та автоматичного перезапуску. При тривалому простої ви можете отримати доступ до даних з акаунта.",
        },
        {
          q: "Чи можу я встановити сповіщення?",
          a: "Так. Наша платформа підтримує сповіщення через email та Telegram. Ви можете налаштувати алерти для кожної моделі за вашими вподобаннями.",
        },
        {
          q: "Які активи доступні?",
          a: "Ми підтримуємо аналіз для різних класів активів, включаючи акції, індекси, товари та інше. 17+ активів з повними історичними даними.",
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
          a: "Ми приймаємо платежі через LiqPay, включаючи Visa, Mastercard та картки ПриватБанку. Всі платежі обробляються безпечно.",
        },
        {
          q: "Чи є безкоштовний пробний період?",
          a: "Так! Ви можете досліджувати платформу, запускати симуляції та аналізувати моделі без оплати. Тільки живий аналіз вимагає підписки.",
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
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 0)'}}></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5" style={{clipPath: 'polygon(0 100%, 100% 100%, 0 0)'}}></div>
        
        <div className="container max-w-3xl text-center relative">
          <h1 className="text-4xl font-bold mb-4">
            {language === "uk" ? "Часті запитання" : "Frequently Asked Questions"}
          </h1>
          <p className="text-gray-600 text-lg">
            {language === "uk"
              ? "Все, що вам потрібно знати про Algotcha. Не знайшли відповідь?"
              : "Everything you need to know about Algotcha. Can't find what you're looking for?"}{" "}
            <Link href="/support" className="text-black font-bold hover:underline">
              {language === "uk" ? "Зв'яжіться з підтримкою" : "Contact support"}
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="container max-w-3xl py-12">
        {faqs.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-black flex items-center justify-center text-white text-xs font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                {sectionIndex + 1}
              </div>
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq, itemIndex) => {
                const currentIndex = globalIndex++;
                const isOpen = openIndex === currentIndex;

                return (
                  <div
                    key={itemIndex}
                    className="bg-white border-2 border-gray-100 overflow-hidden shadow-sm hover:border-black transition-all"
                    style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}
                  >
                    <button
                      onClick={() => toggle(currentIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${currentIndex}`}
                    >
                      <span className="font-bold pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-answer-${currentIndex}`}
                        className="px-6 pb-4 text-gray-600 leading-relaxed border-t-2 border-gray-100 bg-gray-50"
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
      <section className="bg-gray-900 py-12">
        <div className="container max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {language === "uk" ? "Ще маєте питання?" : "Still have questions?"}
          </h2>
          <p className="text-gray-300 mb-6">
            {language === "uk"
              ? "Наша команда підтримки готова допомогти. Зверніться до нас і ми відповімо якнайшвидше."
              : "Our support team is here to help. Reach out and we'll get back to you as soon as possible."}
          </p>
          <Link href="/support">
            <button className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-100 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
              {language === "uk" ? "Зв'язатися з підтримкою" : "Contact Support"}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
