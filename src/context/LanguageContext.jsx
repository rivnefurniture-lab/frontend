"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Translations
const translations = {
  en: {
    // Navbar
    nav: {
      dashboard: "Dashboard",
      strategies: "Strategies",
      backtest: "Backtest",
      connect: "Connect",
      pricing: "Pricing",
      signIn: "Sign in",
      getStarted: "Get started",
      myProfile: "My Profile",
      achievements: "Achievements",
      myStrategies: "My Strategies",
      connectExchange: "Connect Exchange",
      upgradePlan: "Upgrade Plan",
      settings: "Settings",
      logOut: "Log Out",
    },
    
    // Hero
    hero: {
      title: "Automate Your",
      titleHighlight: "Crypto Trading",
      subtitle: "Build, backtest, and deploy algorithmic trading strategies. No coding required.",
      cta: "Start Trading",
      ctaSecondary: "View Strategies",
      stats: {
        users: "Active Traders",
        strategies: "Strategies",
        volume: "Trading Volume",
      },
    },
    
    // Landing page
    landing: {
      sampleGrowth: "Sample Portfolio Growth",
      yearly: "yearly",
      starting: "Starting",
      final: "Final",
      maxDD: "Max DD",
      featuredStrategies: "Featured Strategies",
      viewAll: "View all →",
      live: "Live",
      yr: "/yr",
      loadingStrategies: "Loading strategies from real market data...",
      checkBackSoon: "Please check back soon.",
      metricsNote: "📊 All metrics are calculated from real historical market data and updated hourly.",
      
      // How it works
      howItWorks: "How It Works",
      howItWorksSubtitle: "Start automated trading in 3 simple steps. No coding required.",
      step1Title: "Choose a Strategy",
      step1Text: "Browse our curated strategies with real performance data, or build your own using our visual backtester.",
      step2Title: "Connect Exchange",
      step2Text: "Link your Binance, Bybit, or OKX account with API keys. We only need trading permissions, never withdrawals.",
      step3Title: "Start Trading",
      step3Text: "Activate your strategy and let it trade 24/7. Monitor performance in real-time from your dashboard.",
      getStartedFree: "Get Started Free →",
      
      // Why Algotcha
      whyAlgotcha: "Why Algotcha?",
      realData: "Real Data",
      realDataText: "5 years of minute-by-minute historical data. No fake backtests.",
      secure: "Secure",
      secureText: "Your API keys are encrypted. Trading only — never withdrawals.",
      fastExecution: "Fast Execution",
      fastExecutionText: "Dedicated trading server with static IP for reliable order execution.",
      transparent: "Transparent",
      transparentText: "See every trade with indicator proof. No black box algorithms.",
      
      // Testimonials
      testimonials: "What Our Users Say",
      testimonialsSubtitle: "Real reviews from traders who have automated their trading with Algotcha",
      ssl: "256-bit SSL",
      verifiedReviews: "Verified Reviews",
      ukrainianPlatform: "Ukrainian Platform",
      
      // CTA
      readyToAutomate: "Ready to automate your trading?",
      ctaSubtitle: "Join thousands of traders using algorithmic strategies to grow their portfolios.",
      createFreeAccount: "Create Free Account",
      viewStrategies: "View Strategies",
    },
    
    // Account page
    account: {
      overview: "Overview",
      achievements: "Achievements",
      settings: "Settings",
      backtestsRun: "Backtests Run",
      totalAnalyses: "Total analyses",
      activeStrategies: "Active Strategies",
      runningNow: "Running now",
      totalProfit: "Total Profit",
      allTime: "All time",
      winRate: "Win Rate",
      trades: "trades",
      recentAchievements: "Recent Achievements",
      viewAllAchievements: "View All",
      runBacktest: "Run Backtest",
      runBacktestText: "Test your strategy against historical data",
      browseStrategies: "Browse Strategies",
      browseStrategiesText: "Explore top-performing strategies",
      connectExchangeText: "Start live trading with your API",
      memberSince: "Member since",
      unlocked: "Unlocked",
      xpEarned: "XP earned",
      level: "Level",
      progress: "Progress",
      profileSettings: "Profile Settings",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      email: "Email",
      country: "Country",
      phone: "Phone",
      socialLinks: "Social Links",
      saveChanges: "Save Changes",
      saving: "Saving...",
      subscription: "Subscription",
      freePlan: "Free Plan",
      freePlanText: "Basic features • 3 backtests/day",
      upgrade: "Upgrade",
    },
    
    // Achievements
    achievements: {
      firstSteps: "First Steps",
      firstStepsDesc: "Run your first backtest",
      strategyCreator: "Strategy Creator",
      strategyCreatorDesc: "Save your first strategy",
      liveTrader: "Live Trader",
      liveTraderDesc: "Start your first live strategy",
      profitMaker: "Profit Maker",
      profitMakerDesc: "Achieve your first profitable trade",
      backtesterPro: "Backtester Pro",
      backtesterProDesc: "Run 10 backtests",
      diversified: "Diversified",
      diversifiedDesc: "Trade 5 different pairs",
      consistent: "Consistent",
      consistentDesc: "Maintain a 60%+ win rate over 50 trades",
      whale: "Whale",
      whaleDesc: "Achieve $10,000+ in total profit",
    },
    
    // Footer
    footer: {
      description: "Automate your crypto trading with powerful algorithmic strategies. Built for traders, by traders.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      about: "About Us",
      faq: "FAQ",
      support: "Support",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      risk: "Risk Disclosure",
      allRightsReserved: "All rights reserved.",
    },
    
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      back: "Back",
      next: "Next",
      submit: "Submit",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      noResults: "No results found",
      tryAgain: "Try again",
    },
    
    // Testimonials content
    testimonialContent: {
      oleg: "I've been using Algotcha for 3 months to automate my trading. The results are impressive — stable profit without constant market monitoring. Highly recommend!",
      nazar: "Finally found a platform that actually works. Backtests on real data convinced me. Now I trade stress-free.",
      dmytro: "Started from zero, with no trading experience. Thanks to ready-made strategies, I already have my first results. Support responds quickly and helps figure things out.",
      karina: "As an analyst, I value transparency. Here I see every trade with indicator proof. No black boxes — everything is honest and clear.",
    },
  },
  
  uk: {
    // Navbar
    nav: {
      dashboard: "Панель",
      strategies: "Стратегії",
      backtest: "Бектест",
      connect: "Підключення",
      pricing: "Тарифи",
      signIn: "Увійти",
      getStarted: "Почати",
      myProfile: "Мій профіль",
      achievements: "Досягнення",
      myStrategies: "Мої стратегії",
      connectExchange: "Підключити біржу",
      upgradePlan: "Покращити план",
      settings: "Налаштування",
      logOut: "Вийти",
    },
    
    // Hero
    hero: {
      title: "Автоматизуй свою",
      titleHighlight: "Крипто-торгівлю",
      subtitle: "Створюй, тестуй та запускай алгоритмічні торгові стратегії. Без програмування.",
      cta: "Почати торгувати",
      ctaSecondary: "Переглянути стратегії",
      stats: {
        users: "Активних трейдерів",
        strategies: "Стратегій",
        volume: "Обсяг торгів",
      },
    },
    
    // Landing page
    landing: {
      sampleGrowth: "Приклад зростання портфеля",
      yearly: "на рік",
      starting: "Початок",
      final: "Кінець",
      maxDD: "Макс. просадка",
      featuredStrategies: "Популярні стратегії",
      viewAll: "Всі →",
      live: "Активна",
      yr: "/рік",
      loadingStrategies: "Завантаження стратегій з реальних ринкових даних...",
      checkBackSoon: "Будь ласка, перевірте пізніше.",
      metricsNote: "📊 Всі метрики розраховані на основі реальних історичних даних ринку та оновлюються щогодини.",
      
      // How it works
      howItWorks: "Як це працює",
      howItWorksSubtitle: "Почни автоматичну торгівлю за 3 простих кроки. Без програмування.",
      step1Title: "Обери стратегію",
      step1Text: "Переглянь готові стратегії з реальними показниками, або створи власну за допомогою візуального бектестера.",
      step2Title: "Підключи біржу",
      step2Text: "Зв'яжи свій Binance, Bybit або OKX акаунт через API. Нам потрібні лише права на торгівлю, ніколи на виведення.",
      step3Title: "Почни торгувати",
      step3Text: "Активуй стратегію і дозволь їй торгувати 24/7. Слідкуй за результатами в реальному часі з панелі управління.",
      getStartedFree: "Почати безкоштовно →",
      
      // Why Algotcha
      whyAlgotcha: "Чому Algotcha?",
      realData: "Реальні дані",
      realDataText: "5 років хвилинних історичних даних. Жодних фейкових бектестів.",
      secure: "Безпечно",
      secureText: "Ваші API ключі зашифровані. Тільки торгівля — ніколи виведення.",
      fastExecution: "Швидке виконання",
      fastExecutionText: "Виділений торговий сервер зі статичним IP для надійного виконання ордерів.",
      transparent: "Прозоро",
      transparentText: "Бачте кожну угоду з доказами по індикаторах. Жодних чорних ящиків.",
      
      // Testimonials
      testimonials: "Що кажуть наші користувачі",
      testimonialsSubtitle: "Реальні відгуки від трейдерів, які вже автоматизували свою торгівлю з Algotcha",
      ssl: "256-bit SSL",
      verifiedReviews: "Верифіковані відгуки",
      ukrainianPlatform: "Українська платформа",
      
      // CTA
      readyToAutomate: "Готові автоматизувати торгівлю?",
      ctaSubtitle: "Приєднуйтесь до тисяч трейдерів, які використовують алгоритмічні стратегії для зростання своїх портфелів.",
      createFreeAccount: "Створити безкоштовний акаунт",
      viewStrategies: "Переглянути стратегії",
    },
    
    // Account page
    account: {
      overview: "Огляд",
      achievements: "Досягнення",
      settings: "Налаштування",
      backtestsRun: "Бектестів запущено",
      totalAnalyses: "Всього аналізів",
      activeStrategies: "Активних стратегій",
      runningNow: "Зараз працюють",
      totalProfit: "Загальний прибуток",
      allTime: "За весь час",
      winRate: "Відсоток виграшу",
      trades: "угод",
      recentAchievements: "Останні досягнення",
      viewAllAchievements: "Переглянути всі",
      runBacktest: "Запустити бектест",
      runBacktestText: "Протестуй стратегію на історичних даних",
      browseStrategies: "Переглянути стратегії",
      browseStrategiesText: "Досліджуй найкращі стратегії",
      connectExchangeText: "Почни живу торгівлю зі своїм API",
      memberSince: "Учасник з",
      unlocked: "Відкрито",
      xpEarned: "Зароблено XP",
      level: "Рівень",
      progress: "Прогрес",
      profileSettings: "Налаштування профілю",
      personalInfo: "Особиста інформація",
      fullName: "Повне ім'я",
      email: "Електронна пошта",
      country: "Країна",
      phone: "Телефон",
      socialLinks: "Соціальні мережі",
      saveChanges: "Зберегти зміни",
      saving: "Збереження...",
      subscription: "Підписка",
      freePlan: "Безкоштовний план",
      freePlanText: "Базові функції • 3 бектести/день",
      upgrade: "Покращити",
    },
    
    // Achievements
    achievements: {
      firstSteps: "Перші кроки",
      firstStepsDesc: "Запусти свій перший бектест",
      strategyCreator: "Творець стратегій",
      strategyCreatorDesc: "Збережи свою першу стратегію",
      liveTrader: "Живий трейдер",
      liveTraderDesc: "Запусти свою першу живу стратегію",
      profitMaker: "Прибуткотворець",
      profitMakerDesc: "Здійсни свою першу прибуткову угоду",
      backtesterPro: "Бектестер Про",
      backtesterProDesc: "Запусти 10 бектестів",
      diversified: "Диверсифікований",
      diversifiedDesc: "Торгуй 5 різними парами",
      consistent: "Послідовний",
      consistentDesc: "Підтримуй 60%+ відсоток виграшу на 50 угодах",
      whale: "Кит",
      whaleDesc: "Досягни $10,000+ загального прибутку",
    },
    
    // Footer
    footer: {
      description: "Автоматизуй свою крипто-торгівлю за допомогою потужних алгоритмічних стратегій. Створено трейдерами для трейдерів.",
      product: "Продукт",
      company: "Компанія",
      legal: "Правова інформація",
      about: "Про нас",
      faq: "Питання та відповіді",
      support: "Підтримка",
      terms: "Умови використання",
      privacy: "Політика конфіденційності",
      risk: "Розкриття ризиків",
      allRightsReserved: "Всі права захищені.",
    },
    
    // Common
    common: {
      loading: "Завантаження...",
      error: "Помилка",
      success: "Успішно",
      cancel: "Скасувати",
      save: "Зберегти",
      delete: "Видалити",
      edit: "Редагувати",
      close: "Закрити",
      back: "Назад",
      next: "Далі",
      submit: "Надіслати",
      search: "Пошук",
      filter: "Фільтр",
      sort: "Сортувати",
      noResults: "Результатів не знайдено",
      tryAgain: "Спробуй ще раз",
    },
    
    // Testimonials content
    testimonialContent: {
      oleg: "Вже 3 місяці використовую Algotcha для автоматизації торгівлі. Результати вражають — стабільний прибуток без постійного моніторингу ринку. Рекомендую всім!",
      nazar: "Нарешті знайшов платформу, яка реально працює. Бектести на реальних даних — це те, що мене переконало. Тепер торгую без стресу.",
      dmytro: "Почав з нуля, без досвіду в трейдингу. Завдяки готовим стратегіям вже маю перші результати. Підтримка відповідає швидко і допомагає розібратися.",
      karina: "Як аналітик, ціную прозорість. Тут бачу кожну угоду з доказами по індикаторах. Жодних чорних ящиків — все чесно і зрозуміло.",
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("uk"); // Default to Ukrainian

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem("algotcha-language");
    if (saved && (saved === "en" || saved === "uk")) {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "uk" : "en";
    setLanguage(newLang);
    localStorage.setItem("algotcha-language", newLang);
  };

  const setLang = (lang) => {
    if (lang === "en" || lang === "uk") {
      setLanguage(lang);
      localStorage.setItem("algotcha-language", lang);
    }
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

