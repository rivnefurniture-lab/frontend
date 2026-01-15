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
      label: language === "uk" ? "Активів" : "Assets",
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
          ? "Жодних гіпотетичних симуляцій. Всі показники розраховані на хвилинних історичних даних з 2020 року."
          : "No hypothetical simulations. All performance metrics come from minute-by-minute historical data going back to 2020.",
    },
    {
      icon: "🔍",
      title: language === "uk" ? "Повна прозорість" : "Full Transparency",
      description:
        language === "uk"
          ? "Бачте кожен сигнал, кожне значення індикатора, кожне рішення. Жодних чорних ящиків. Розумійте, чому саме такий результат."
          : "See every signal, every indicator value, every decision. No black boxes. Understand exactly why each result occurred.",
    },
    {
      icon: "🔒",
      title: language === "uk" ? "Безпека перш за все" : "Security First",
      description:
        language === "uk"
          ? "Ваші API ключі зашифровані. Тільки читання — ніколи запис. Виділений сервер зі статичним IP для надійної обробки."
          : "Your API keys are encrypted. Read-only access — never write permissions. Dedicated server with static IP for reliable processing.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 0)'}}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5" style={{clipPath: 'polygon(0 100%, 100% 100%, 0 0)'}}></div>
        
        <div className="container max-w-4xl text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {language === "uk" ? "Аналітика ринку," : "Market Analytics,"}{" "}
            <span className="text-emerald-600">
              {language === "uk" ? "просто" : "Made Simple"}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Algotcha надає аналітикам можливість автоматизувати свої дослідження за допомогою інструментів професійного рівня, прозорих даних та безпечної обробки."
              : "Algotcha empowers analysts to automate their research with professional-grade tools, transparent performance data, and secure processing."}
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
                ? "Ми віримо, що професійний аналіз ринку не повинен бути привілеєм великих компаній та інституцій. Наша місія — демократизувати кількісний аналіз, надаючи інструменти, дані та інфраструктуру, необхідні аналітикам для успіху."
                : "We believe that professional market analysis shouldn't be reserved for large companies and institutions. Our mission is to democratize quantitative analysis by providing the tools, data, and infrastructure that analysts need to succeed."}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {language === "uk"
                ? "Кожна модель на Algotcha тестується на реальних історичних даних, з прозорими метриками, які допомагають зрозуміти справжній ризик та потенційний результат."
                : "Every model on Algotcha is tested against real historical data, with transparent metrics that help you understand the true risk and potential outcome."}
            </p>
          </div>
          <div className="bg-black p-8" style={{clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))'}}>
            <div className="grid grid-cols-2 gap-6 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 bg-white/10" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                  <div className="text-4xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
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
              <div key={i} className="bg-white p-6 border-2 border-gray-100 hover:border-black transition-all shadow-sm" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
                <div className="w-12 h-12 bg-black flex items-center justify-center text-2xl mb-4" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
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
            ? "Створено аналітиками для аналітиків"
            : "Built by Analysts, for Analysts"}
        </h2>
        <div className="bg-white border rounded-2xl p-8 text-center">
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {language === "uk"
              ? "Наша команда поєднує роки досвіду в кількісному аналізі, розробці програмного забезпечення та фінансових технологіях. Ми створили Algotcha, щоб вирішити проблеми, з якими стикалися самі: ненадійні симуляції, непрозорі моделі та розрізнені інструменти."
              : "Our team combines years of experience in quantitative analysis, software engineering, and financial technology. We've built Algotcha to solve the problems we faced ourselves: unreliable simulations, opaque models, and fragmented tools."}
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
                  ? "Ми показуємо все — кожен сигнал, кожне рішення, кожен індикатор. Жодних прихованих алгоритмів."
                  : "We show everything — every signal, every decision, every indicator. No hidden algorithms."}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                🛡️ {language === "uk" ? "Безпека" : "Security"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "uk"
                  ? "Ваші дані та ключі завжди під вашим контролем. Ми використовуємо найсучасніше шифрування."
                  : "Your data and keys are always under your control. We use state-of-the-art encryption."}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                🚀 {language === "uk" ? "Простота" : "Simplicity"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "uk"
                  ? "Складні алгоритми, простий інтерфейс. Вам не потрібно бути програмістом, щоб аналізувати як професіонал."
                  : "Complex algorithms, simple interface. You don't need to be a programmer to analyze like a pro."}
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
      <section className="bg-black py-16">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {language === "uk" ? "Готові почати?" : "Ready to Get Started?"}
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            {language === "uk"
              ? "Приєднуйтесь до аналітиків, які довіряють Algotcha для автоматизованого, прозорого та безпечного аналізу ринку."
              : "Join analysts who trust Algotcha for automated, transparent, and secure market analysis."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <Button className="bg-white text-black hover:bg-gray-100 font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                {language === "uk" ? "Створити безкоштовний акаунт" : "Create Free Account"}
              </Button>
            </Link>
            <Link href="/strategies">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {language === "uk" ? "Переглянути моделі" : "Browse Models"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
