"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const { language } = useLanguage();

  const stats = [
    {
      value: "5+",
      label: language === "uk" ? "Років даних" : "Years of Data",
    },
    {
      value: "17",
      label: language === "uk" ? "Криптопар" : "Crypto Pairs",
    },
    {
      value: "20+",
      label: language === "uk" ? "Індикаторів" : "Indicators",
    },
    {
      value: "24/7",
      label: language === "uk" ? "Автоматизація" : "Automation",
    },
  ];

  const features = [
    {
      icon: "📊",
      title: language === "uk" ? "Тільки реальні дані" : "Real Data Only",
      description:
        language === "uk"
          ? "Жодних гіпотетичних бектестів. Всі показники розраховані на хвилинних історичних даних з 2020 року."
          : "No hypothetical backtests. All performance metrics come from minute-by-minute historical data going back to 2020.",
    },
    {
      icon: "🔍",
      title: language === "uk" ? "Повна прозорість" : "Full Transparency",
      description:
        language === "uk"
          ? "Бачте кожну угоду, кожне значення індикатора, кожне рішення. Жодних чорних ящиків. Розумійте, чому саме така угода."
          : "See every trade, every indicator value, every decision. No black boxes. Understand exactly why each trade was made.",
    },
    {
      icon: "🔒",
      title: language === "uk" ? "Безпека перш за все" : "Security First",
      description:
        language === "uk"
          ? "Ваші API ключі зашифровані. Тільки торгівля — ніколи виведення. Виділений сервер зі статичним IP для надійного виконання."
          : "Your API keys are encrypted. Trading only permissions — never withdrawals. Dedicated server with static IP for reliable execution.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {language === "uk" ? "Алгоритмічна торгівля," : "Algorithmic Trading,"}{" "}
            <span className="text-blue-600">
              {language === "uk" ? "просто" : "Made Simple"}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Algotcha надає трейдерам можливість автоматизувати свої стратегії за допомогою інструментів інституційного рівня, прозорих даних та безпечного виконання."
              : "Algotcha empowers traders to automate their strategies with institutional-grade tools, transparent performance data, and secure execution."}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-16 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              {language === "uk" ? "Наша місія" : "Our Mission"}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {language === "uk"
                ? "Ми віримо, що алгоритмічна торгівля не повинна бути привілеєм хедж-фондів та інституцій. Наша місія — демократизувати кількісну торгівлю, надаючи інструменти, дані та інфраструктуру, необхідні роздрібним трейдерам для успіху."
                : "We believe that algorithmic trading shouldn't be reserved for hedge funds and institutions. Our mission is to democratize quantitative trading by providing the tools, data, and infrastructure that retail traders need to succeed."}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {language === "uk"
                ? "Кожна стратегія на Algotcha тестується на реальних історичних даних, з прозорими метриками, які допомагають зрозуміти справжній ризик та потенційну винагороду."
                : "Every strategy on Algotcha is backtested against real historical data, with transparent metrics that help you understand the true risk and potential reward."}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">
            {language === "uk" ? "Чим ми відрізняємось" : "How We're Different"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container py-16 max-w-4xl">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {language === "uk"
            ? "Створено трейдерами для трейдерів"
            : "Built by Traders, for Traders"}
        </h2>
        <div className="bg-white border rounded-2xl p-8 text-center">
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {language === "uk"
              ? "Наша команда поєднує роки досвіду в кількісній торгівлі, розробці програмного забезпечення та фінансових технологіях. Ми створили Algotcha, щоб вирішити проблеми, з якими стикалися самі: ненадійні бектести, непрозорі стратегії та розрізнені інструменти."
              : "Our team combines years of experience in quantitative trading, software engineering, and financial technology. We've built Algotcha to solve the problems we faced ourselves: unreliable backtests, opaque strategies, and fragmented tools."}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">
            {language === "uk" ? "Наші цінності" : "Our Values"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                🎯 {language === "uk" ? "Прозорість" : "Transparency"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "uk"
                  ? "Ми показуємо все — кожну угоду, кожне рішення, кожен індикатор. Жодних прихованих алгоритмів."
                  : "We show everything — every trade, every decision, every indicator. No hidden algorithms."}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                🛡️ {language === "uk" ? "Безпека" : "Security"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "uk"
                  ? "Ваші кошти та ключі завжди під вашим контролем. Ми використовуємо найсучасніше шифрування."
                  : "Your funds and keys are always under your control. We use state-of-the-art encryption."}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                🚀 {language === "uk" ? "Простота" : "Simplicity"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "uk"
                  ? "Складні алгоритми, простий інтерфейс. Вам не потрібно бути програмістом, щоб торгувати як професіонал."
                  : "Complex algorithms, simple interface. You don't need to be a programmer to trade like a pro."}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                💪 {language === "uk" ? "Підтримка" : "Support"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "uk"
                  ? "Наша команда завжди готова допомогти. Швидкі відповіді та детальна документація."
                  : "Our team is always ready to help. Fast responses and detailed documentation."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {language === "uk" ? "Готові почати?" : "Ready to Get Started?"}
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            {language === "uk"
              ? "Приєднуйтесь до трейдерів, які довіряють Algotcha для автоматизованої, прозорої та безпечної алгоритмічної торгівлі."
              : "Join traders who trust Algotcha for automated, transparent, and secure algorithmic trading."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                {language === "uk" ? "Створити безкоштовний акаунт" : "Create Free Account"}
              </Button>
            </Link>
            <Link href="/strategies">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {language === "uk" ? "Переглянути стратегії" : "Browse Strategies"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
