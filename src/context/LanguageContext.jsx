"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Translations - Rebranded as SaaS Analytics Platform
const translations = {
  en: {
    // Navbar
    nav: {
      dashboard: "Dashboard",
      strategies: "Models",
      backtest: "Simulator",
      connect: "Integrations",
      pricing: "Pricing",
      signIn: "Sign in",
      getStarted: "Get started",
      myProfile: "My Profile",
      achievements: "Achievements",
      myStrategies: "My Models",
      connectExchange: "Connect Data Source",
      upgradePlan: "Upgrade Plan",
      settings: "Settings",
      logOut: "Log Out",
    },
    
    // Hero
    hero: {
      title: "Automate Your",
      titleHighlight: "Market Analysis",
      subtitle: "Build, simulate, and deploy analytical models. No coding required.",
      cta: "Start Analyzing",
      ctaSecondary: "View Models",
      stats: {
        users: "Active Users",
        strategies: "Models",
        volume: "Data Processed",
      },
    },
    
    // Landing page
    landing: {
      sampleGrowth: "Sample Performance Analysis",
      yearly: "yearly",
      starting: "Starting",
      final: "Final",
      maxDD: "Max DD",
      featuredStrategies: "Featured Models",
      viewAll: "View all →",
      live: "Active",
      yr: "/yr",
      loadingStrategies: "Loading models from real market data...",
      checkBackSoon: "Please check back soon.",
      metricsNote: "📊 All metrics are calculated from real historical market data and updated hourly.",
      
      // How it works
      howItWorks: "How It Works",
      howItWorksSubtitle: "Start automated analysis in 3 simple steps. No coding required.",
      step1Title: "Choose a Model",
      step1Text: "Browse our curated analytical models with real performance data, or build your own using our visual simulator.",
      step2Title: "Connect Data Source",
      step2Text: "Link your data source via API. We use read-only permissions for secure data access.",
      step3Title: "Start Analyzing",
      step3Text: "Activate your model and let it analyze 24/7. Monitor insights in real-time from your dashboard.",
      getStartedFree: "Get Started Free →",
      
      // Why Algotcha
      whyAlgotcha: "Why Algotcha?",
      realData: "Real Data",
      realDataText: "5 years of minute-by-minute historical data. No simulated datasets.",
      secure: "Secure",
      secureText: "Your API keys are encrypted. Read-only access — full data protection.",
      fastExecution: "Fast Processing",
      fastExecutionText: "Dedicated server with static IP for reliable data processing.",
      transparent: "Transparent",
      transparentText: "See every analysis with indicator proof. No black box algorithms.",
      
      // Testimonials
      testimonials: "What Our Users Say",
      testimonialsSubtitle: "Real reviews from analysts who have automated their research with Algotcha",
      ssl: "256-bit SSL",
      verifiedReviews: "Verified Reviews",
      ukrainianPlatform: "Ukrainian Platform",
      
      // CTA
      readyToAutomate: "Ready to automate your analysis?",
      ctaSubtitle: "Join thousands of users using analytical models to gain market insights.",
      createFreeAccount: "Create Free Account",
      viewStrategies: "View Models",
    },
    
    // Account page
    account: {
      overview: "Overview",
      achievements: "Achievements",
      settings: "Settings",
      backtestsRun: "Simulations Run",
      totalAnalyses: "Total analyses",
      activeStrategies: "Active Models",
      runningNow: "Running now",
      totalProfit: "Total Value",
      allTime: "All time",
      winRate: "Success Rate",
      trades: "analyses",
      recentAchievements: "Recent Achievements",
      viewAllAchievements: "View All",
      runBacktest: "Run Simulation",
      runBacktestText: "Test your model against historical data",
      browseStrategies: "Browse Models",
      browseStrategiesText: "Explore top-performing models",
      connectExchangeText: "Start live analysis with your API",
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
      freePlanText: "Basic features • 3 simulations/day",
      upgrade: "Upgrade",
    },
    
    // Achievements
    achievements: {
      firstSteps: "First Steps",
      firstStepsDesc: "Run your first simulation",
      strategyCreator: "Model Creator",
      strategyCreatorDesc: "Save your first model",
      liveTrader: "Live Analyst",
      liveTraderDesc: "Start your first live model",
      profitMaker: "Insight Maker",
      profitMakerDesc: "Achieve your first successful prediction",
      backtesterPro: "Simulator Pro",
      backtesterProDesc: "Run 10 simulations",
      diversified: "Diversified",
      diversifiedDesc: "Analyze 5 different assets",
      consistent: "Consistent",
      consistentDesc: "Maintain a 60%+ success rate over 50 analyses",
      whale: "Expert",
      whaleDesc: "Achieve expert-level insights",
    },
    
    // Footer
    footer: {
      description: "Automate your market analysis with powerful analytical models. Built for analysts, by analysts.",
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
      oleg: "Before this, analysis honestly felt like throwing darts in the dark. Now I can really tell what looks good before I even commit.",
      nazar: "I'm sitting here wondering why I ever paid someone to do what this tool does on its own for way less.",
      dmytro: "Using Algotcha feels like letting your smartest colleague do the hard part while you just focus on decisions.",
      karina: "Feels like professional analytics on autopilot, but simple enough that even I can run it without overthinking.",
    },
    
    // Connect page
    connect: {
      title: "Connect Your Data Source",
      subtitle: "Connect your data source to start automated analysis. We only need read-only permissions — never write access.",
      securityFirst: "Security First",
      securityBullets: [
        "API keys are stored encrypted and never shared",
        "Create keys with read-only permissions",
        "Use test environment for testing before going live",
        "You can revoke access anytime from your provider"
      ],
      ipWhitelisting: "IP Whitelisting (Recommended)",
      ipWhitelistingDesc: "For maximum security, whitelist our server IP on your data provider:",
      copy: "Copy",
      ipWhitelistingNote: "This ensures only our server can access data with your API keys.",
      apiKey: "API Key",
      apiSecret: "API Secret",
      passphrase: "Passphrase (optional)",
      passphraseNote: "Only required for some providers",
      useTestnet: "Use Test Environment (recommended for testing)",
      connect: "Connect",
      reconnect: "Reconnect",
      connecting: "Connecting...",
      testBalance: "Test Connection",
      testing: "Testing...",
      howToCreate: "How to create API keys →",
      getTestnet: "Get test account →",
      connected: "Data Source Connected!",
      readyToTrade: "You're ready to start analyzing. Here's what you can do next:",
      createStrategy: "Create Model",
      goToDashboard: "Go to Dashboard",
      needHelp: "Need help?",
      checkFaq: "Check our FAQ",
      contactSupport: "contact support",
      loginRequired: "Login Required",
      loginToConnect: "You need to be logged in to connect your data source.",
      loginSignup: "Login / Sign Up",
      balanceSuccess: "Connection successful",
      noAssets: "No data available",
      connectionFailed: "Connection failed",
      invalidCredentials: "Invalid API key or secret. Please check your credentials.",
      networkError: "Network error. Please check your connection and try again.",
      unsupportedExchange: "Unsupported data source",
    },
    
    // Strategies page
    strategies: {
      title: "Analytical Models",
      subtitle: "Real performance data updated every hour from historical simulations",
      createCustom: "+ Create Custom Model",
      searchPlaceholder: "Search models...",
      sortBy: "Sort by:",
      yearlyReturn: "Yearly Performance",
      sharpeRatio: "Sharpe Ratio",
      winRate: "Success Rate",
      lowestDrawdown: "Lowest Drawdown",
      refresh: "Refresh",
      activeStrategies: "Active Models",
      bestYearly: "Best Yearly Performance",
      bestSharpe: "Best Sharpe Ratio",
      avgWinRate: "Avg Success Rate",
      savedStrategies: "Your Saved Models",
      yourStrategy: "Your Model",
      profit: "Performance",
      maxDD: "Max DD",
      useStrategy: "Use Model",
      featured: "🌟 Featured Models",
      noStrategies: "No models available yet.",
      calculating: "Models are being calculated from real market data. Please check back soon.",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      updated: "Updated",
      viewDetails: "View Details",
      noMatch: "No models found matching your search.",
      dataNote: "📊 Real Performance Data: All metrics are calculated from actual historical price data and updated automatically every hour. Past performance does not guarantee future results.",
    },
    
    // Backtest page
    backtest: {
      title: "Model Simulator",
      subtitle: "Build, test, and optimize your analytical models",
      strategySettings: "Model Settings",
      strategyName: "Model Name",
      maxActiveDeals: "Max Active Analyses",
      initialBalance: "Initial Value ($)",
      baseOrderSize: "Base Size ($)",
      startDate: "Start Date",
      endDate: "End Date",
      tradingPairs: "Asset Pairs",
      riskManagement: "Risk Management",
      takeProfit: "Target (%)",
      takeProfitDesc: "Close at this target %",
      stopLoss: "Stop Loss (%)",
      stopLossDesc: "Close at this loss %",
      enableTrailingStop: "Enable Trailing Stop",
      safetyOrders: "Safety Orders (DCA)",
      numSafetyOrders: "Number of Safety Orders",
      priceDeviation: "Price Deviation (%)",
      priceDeviationDesc: "Drop % to trigger each SO",
      volumeScale: "Volume Scale",
      volumeScaleDesc: "Multiply each SO size",
      dcaStrategy: "DCA Strategy:",
      dcaStrategyDesc: "If price drops {deviation}%, place safety order at {scale}x base size. Max {count} safety orders.",
      marketStateConditions: "Use Market State Conditions",
      marketStateDesc: "Enable separate bullish/bearish conditions based on market state",
      entryConditions: "Entry Conditions",
      exitConditions: "Exit Conditions",
      addCondition: "+ Add Condition",
      noEntryConditions: "No entry conditions. Add one to start.",
      noExitConditions: "No exit conditions. Add one to complete your model.",
      bullishEntry: "🐂 Bullish Entry",
      bullishExit: "🐂 Bullish Exit",
      bearishEntry: "🐻 Bearish Entry",
      bearishExit: "🐻 Bearish Exit",
      add: "+ Add",
      runBacktest: "🚀 Run Simulation",
      runningBacktest: "Running Simulation...",
      likeResults: "Like these results?",
      saveToRunLive: "Save this model to run it live",
      saveStrategy: "💾 Save Model",
      saving: "Saving...",
      saved: "✓ Saved!",
      savedNote: "Model saved! Go to Models to view or Dashboard to start analyzing.",
      exportReport: "Export Analysis Report",
      downloadCSV: "📥 Download CSV",
      printPDF: "📄 Print PDF Report",
      exportTrades: "Export {count} records for your analysis",
      performanceMetrics: "Performance Metrics",
      netProfit: "Net Result",
      maxDrawdown: "Max Drawdown",
      totalTrades: "Total Signals",
      profitFactor: "Profit Factor",
      sortinoRatio: "Sortino Ratio",
      yearlyReturn: "Yearly Performance",
      equityCurve: "Equity Curve",
      drawdown: "Drawdown",
      tradeHistory: "Signal History",
      tradesCount: "{count} signals",
      transparency: "Full transparency with indicator proof",
      dateTime: "Date & Time",
      pair: "Asset",
      action: "Signal",
      price: "Price",
      pnl: "P&L",
      equity: "Value",
      dd: "DD",
      reason: "Reason",
      indicatorProof: "Indicator Proof",
      showingFirst: "Showing first 50 of {total} signals. Download full report for all data.",
      noResultsYet: "No Results Yet",
      configureToSee: "Configure your model and run a simulation to see results here.",
      // Condition builder
      remove: "Remove",
      timeframe: "Timeframe",
      rsiLength: "RSI Length",
      condition: "Condition",
      signalValue: "Signal Value",
      maPeriod: "MA Period",
      maType: "MA Type",
      fastPeriod: "Fast Period",
      slowPeriod: "Slow Period",
      signalPeriod: "Signal Period",
      macdLine: "MACD Line",
      bbPeriod: "BB Period",
      bbStdDev: "BB Std Dev",
      lessThan: "Less Than",
      greaterThan: "Greater Than",
      crossingUp: "Crossing Up",
      crossingDown: "Crossing Down",
    },
    
    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back!",
      portfolioValue: "Portfolio Value",
      todayPnL: "Today's Change",
      activeStrategies: "Active Models",
      totalTrades: "Total Signals",
      recentTrades: "Recent Signals",
      noTrades: "No signals yet. Activate a model to start analyzing.",
      yourStrategies: "Your Models",
      noStrategies: "No active models. Go to Models to activate one.",
      goToStrategies: "Go to Models",
      performance: "Performance",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      allTime: "All Time",
    },
    
    // Pricing
    pricing: {
      title: "Pricing Plans",
      subtitle: "Choose the plan that's right for you",
      monthly: "Monthly",
      yearly: "Yearly",
      savePercent: "Save 20%",
      free: "Free",
      freePrice: "$0",
      freeDesc: "Get started with basic features",
      freeFeatures: [
        "3 simulations per day",
        "1 active model",
        "Basic indicators",
        "Community support"
      ],
      pro: "Pro",
      proPrice: "$29/mo",
      proDesc: "For professional analysts",
      proFeatures: [
        "Unlimited simulations",
        "5 active models",
        "All indicators",
        "Priority support",
        "Advanced risk management"
      ],
      enterprise: "Enterprise",
      enterprisePrice: "Custom",
      enterpriseDesc: "For research teams",
      enterpriseFeatures: [
        "Everything in Pro",
        "Unlimited models",
        "Dedicated server",
        "Custom indicators",
        "Personal account manager"
      ],
      currentPlan: "Current Plan",
      upgrade: "Upgrade",
      contactUs: "Contact Us",
      popular: "Popular",
    },
    
    // Partners
    partners: {
      title: "Our Partners & Integrations",
      exchanges: "Data Sources",
      dataProviders: "Data Providers",
      techPartners: "Tech Partners",
    },
  },
  
  uk: {
    // Navbar
    nav: {
      dashboard: "Панель",
      strategies: "Моделі",
      backtest: "Симулятор",
      connect: "Інтеграції",
      pricing: "Тарифи",
      signIn: "Увійти",
      getStarted: "Почати",
      myProfile: "Мій профіль",
      achievements: "Досягнення",
      myStrategies: "Мої моделі",
      connectExchange: "Підключити джерело даних",
      upgradePlan: "Покращити план",
      settings: "Налаштування",
      logOut: "Вийти",
    },
    
    // Hero
    hero: {
      title: "Автоматизуй свій",
      titleHighlight: "Аналіз ринку",
      subtitle: "Створюй, тестуй та запускай аналітичні моделі. Без програмування.",
      cta: "Почати аналіз",
      ctaSecondary: "Переглянути моделі",
      stats: {
        users: "Активних користувачів",
        strategies: "Моделей",
        volume: "Оброблено даних",
      },
    },
    
    // Landing page
    landing: {
      sampleGrowth: "Приклад аналізу ефективності",
      yearly: "на рік",
      starting: "Початок",
      final: "Кінець",
      maxDD: "Макс. просадка",
      featuredStrategies: "Популярні моделі",
      viewAll: "Всі →",
      live: "Активна",
      yr: "/рік",
      loadingStrategies: "Завантаження моделей з реальних ринкових даних...",
      checkBackSoon: "Будь ласка, перевірте пізніше.",
      metricsNote: "📊 Всі метрики розраховані на основі реальних історичних даних ринку та оновлюються щогодини.",
      
      // How it works
      howItWorks: "Як це працює",
      howItWorksSubtitle: "Почни автоматичний аналіз за 3 простих кроки. Без програмування.",
      step1Title: "Обери модель",
      step1Text: "Переглянь готові аналітичні моделі з реальними показниками, або створи власну за допомогою візуального симулятора.",
      step2Title: "Підключи джерело даних",
      step2Text: "Підключи джерело даних через API. Нам потрібні лише права на читання для безпечного доступу до даних.",
      step3Title: "Почни аналіз",
      step3Text: "Активуй модель і дозволь їй аналізувати 24/7. Слідкуй за результатами в реальному часі з панелі управління.",
      getStartedFree: "Почати безкоштовно →",
      
      // Why Algotcha
      whyAlgotcha: "Чому Algotcha?",
      realData: "Реальні дані",
      realDataText: "5 років хвилинних історичних даних. Жодних симульованих датасетів.",
      secure: "Безпечно",
      secureText: "Ваші API ключі зашифровані. Тільки читання — повний захист даних.",
      fastExecution: "Швидка обробка",
      fastExecutionText: "Виділений сервер зі статичним IP для надійної обробки даних.",
      transparent: "Прозоро",
      transparentText: "Бачте кожен аналіз з доказами по індикаторах. Жодних чорних ящиків.",
      
      // Testimonials
      testimonials: "Що кажуть наші користувачі",
      testimonialsSubtitle: "Реальні відгуки від аналітиків, які вже автоматизували свої дослідження з Algotcha",
      ssl: "256-bit SSL",
      verifiedReviews: "Верифіковані відгуки",
      ukrainianPlatform: "Українська платформа",
      
      // CTA
      readyToAutomate: "Готові автоматизувати аналіз?",
      ctaSubtitle: "Приєднуйтесь до тисяч користувачів, які використовують аналітичні моделі для отримання ринкових інсайтів.",
      createFreeAccount: "Створити безкоштовний акаунт",
      viewStrategies: "Переглянути моделі",
    },
    
    // Account page
    account: {
      overview: "Огляд",
      achievements: "Досягнення",
      settings: "Налаштування",
      backtestsRun: "Симуляцій запущено",
      totalAnalyses: "Всього аналізів",
      activeStrategies: "Активних моделей",
      runningNow: "Зараз працюють",
      totalProfit: "Загальна вартість",
      allTime: "За весь час",
      winRate: "Відсоток успіху",
      trades: "аналізів",
      recentAchievements: "Останні досягнення",
      viewAllAchievements: "Переглянути всі",
      runBacktest: "Запустити симуляцію",
      runBacktestText: "Протестуй модель на історичних даних",
      browseStrategies: "Переглянути моделі",
      browseStrategiesText: "Досліджуй найкращі моделі",
      connectExchangeText: "Почни живий аналіз зі своїм API",
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
      freePlanText: "Базові функції • 3 симуляції/день",
      upgrade: "Покращити",
    },
    
    // Achievements
    achievements: {
      firstSteps: "Перші кроки",
      firstStepsDesc: "Запусти свою першу симуляцію",
      strategyCreator: "Творець моделей",
      strategyCreatorDesc: "Збережи свою першу модель",
      liveTrader: "Живий аналітик",
      liveTraderDesc: "Запусти свою першу живу модель",
      profitMaker: "Творець інсайтів",
      profitMakerDesc: "Здійсни свій перший успішний прогноз",
      backtesterPro: "Симулятор Про",
      backtesterProDesc: "Запусти 10 симуляцій",
      diversified: "Диверсифікований",
      diversifiedDesc: "Аналізуй 5 різних активів",
      consistent: "Послідовний",
      consistentDesc: "Підтримуй 60%+ відсоток успіху на 50 аналізах",
      whale: "Експерт",
      whaleDesc: "Досягни експертного рівня інсайтів",
    },
    
    // Footer
    footer: {
      description: "Автоматизуй свій аналіз ринку за допомогою потужних аналітичних моделей. Створено аналітиками для аналітиків.",
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
      oleg: "Раніше аналіз чесно відчувався як кидання дротиків наосліп. Тепер я можу реально бачити, що виглядає перспективно, ще до того, як приймаю рішення.",
      nazar: "Сиджу і думаю, навіщо я раніше платив комусь за те, що цей інструмент робить сам і набагато дешевше.",
      dmytro: "Користуватись Algotcha — це як дати своєму найрозумнішому колезі зробити всю важку роботу, поки ти просто фокусуєшся на рішеннях.",
      karina: "Відчуття, ніби професійна аналітика на автопілоті, але настільки просто, що навіть я можу керувати цим без зайвих роздумів.",
    },
    
    // Connect page
    connect: {
      title: "Підключення джерела даних",
      subtitle: "Підключіть джерело даних для початку автоматичного аналізу. Нам потрібні лише права на читання — ніколи на запис.",
      securityFirst: "Безпека перш за все",
      securityBullets: [
        "API ключі зберігаються зашифрованими та ніколи не передаються",
        "Створюйте ключі лише з правами на читання",
        "Використовуйте тестове середовище для тестування перед запуском",
        "Ви можете відкликати доступ будь-коли від провайдера"
      ],
      ipWhitelisting: "Білий список IP (Рекомендовано)",
      ipWhitelistingDesc: "Для максимальної безпеки додайте IP нашого сервера в білий список у провайдера даних:",
      copy: "Копіювати",
      ipWhitelistingNote: "Це гарантує, що тільки наш сервер зможе отримувати дані з вашими API ключами.",
      apiKey: "API Ключ",
      apiSecret: "API Секрет",
      passphrase: "Парольна фраза (опціонально)",
      passphraseNote: "Потрібна лише для деяких провайдерів",
      useTestnet: "Використовувати тестове середовище (рекомендовано для тестування)",
      connect: "Підключити",
      reconnect: "Перепідключити",
      connecting: "Підключення...",
      testBalance: "Перевірити підключення",
      testing: "Тестування...",
      howToCreate: "Як створити API ключі →",
      getTestnet: "Отримати тестовий акаунт →",
      connected: "Джерело даних підключено!",
      readyToTrade: "Ви готові до аналізу. Ось що можна зробити далі:",
      createStrategy: "Створити модель",
      goToDashboard: "Перейти до панелі",
      needHelp: "Потрібна допомога?",
      checkFaq: "Перегляньте наші FAQ",
      contactSupport: "зв'яжіться з підтримкою",
      loginRequired: "Потрібна авторизація",
      loginToConnect: "Увійдіть, щоб підключити джерело даних.",
      loginSignup: "Увійти / Зареєструватися",
      balanceSuccess: "Підключення успішне",
      noAssets: "Дані недоступні",
      connectionFailed: "Помилка підключення",
      invalidCredentials: "Недійсний API ключ або секрет. Перевірте свої дані.",
      networkError: "Помилка мережі. Перевірте підключення та спробуйте ще раз.",
      unsupportedExchange: "Джерело даних не підтримується",
    },
    
    // Strategies page
    strategies: {
      title: "Аналітичні моделі",
      subtitle: "Реальні показники ефективності оновлюються щогодини на основі історичних симуляцій",
      createCustom: "+ Створити свою модель",
      searchPlaceholder: "Пошук моделей...",
      sortBy: "Сортувати за:",
      yearlyReturn: "Річною ефективністю",
      sharpeRatio: "Коефіцієнтом Шарпа",
      winRate: "Відсотком успіху",
      lowestDrawdown: "Найменшою просадкою",
      refresh: "Оновити",
      activeStrategies: "Активних моделей",
      bestYearly: "Найкраща річна ефективність",
      bestSharpe: "Найкращий коефіцієнт Шарпа",
      avgWinRate: "Середній відсоток успіху",
      savedStrategies: "Ваші збережені моделі",
      yourStrategy: "Ваша модель",
      profit: "Ефективність",
      maxDD: "Макс. просадка",
      useStrategy: "Використати",
      featured: "🌟 Популярні моделі",
      noStrategies: "Моделей поки немає.",
      calculating: "Моделі розраховуються на основі реальних ринкових даних. Перевірте пізніше.",
      daily: "Денна",
      weekly: "Тижнева",
      monthly: "Місячна",
      updated: "Оновлено",
      viewDetails: "Детальніше",
      noMatch: "Моделей за вашим запитом не знайдено.",
      dataNote: "📊 Реальні дані: Всі метрики розраховані на основі фактичних історичних цін та оновлюються автоматично щогодини. Минулі результати не гарантують майбутніх.",
    },
    
    // Backtest page
    backtest: {
      title: "Симулятор моделей",
      subtitle: "Створюй, тестуй та оптимізуй свої аналітичні моделі",
      strategySettings: "Налаштування моделі",
      strategyName: "Назва моделі",
      maxActiveDeals: "Макс. активних аналізів",
      initialBalance: "Початкова вартість ($)",
      baseOrderSize: "Базовий розмір ($)",
      startDate: "Дата початку",
      endDate: "Дата кінця",
      tradingPairs: "Пари активів",
      riskManagement: "Управління ризиками",
      takeProfit: "Ціль (%)",
      takeProfitDesc: "Закрити при цьому % цілі",
      stopLoss: "Stop Loss (%)",
      stopLossDesc: "Закрити при цьому % збитку",
      enableTrailingStop: "Увімкнути Trailing Stop",
      safetyOrders: "Safety Orders (DCA)",
      numSafetyOrders: "Кількість Safety Orders",
      priceDeviation: "Відхилення ціни (%)",
      priceDeviationDesc: "% падіння для спрацювання SO",
      volumeScale: "Масштаб обсягу",
      volumeScaleDesc: "Помножити кожен SO на",
      dcaStrategy: "DCA Стратегія:",
      dcaStrategyDesc: "При падінні на {deviation}%, розмістити safety order у {scale}x від базового. Макс. {count} safety orders.",
      marketStateConditions: "Використовувати умови стану ринку",
      marketStateDesc: "Увімкнути окремі умови для бичачого/ведмежого ринку",
      entryConditions: "Умови входу",
      exitConditions: "Умови виходу",
      addCondition: "+ Додати умову",
      noEntryConditions: "Немає умов входу. Додайте одну для початку.",
      noExitConditions: "Немає умов виходу. Додайте одну для завершення моделі.",
      bullishEntry: "🐂 Бичачий вхід",
      bullishExit: "🐂 Бичачий вихід",
      bearishEntry: "🐻 Ведмежий вхід",
      bearishExit: "🐻 Ведмежий вихід",
      add: "+ Додати",
      runBacktest: "🚀 Запустити симуляцію",
      runningBacktest: "Виконання симуляції...",
      likeResults: "Подобаються результати?",
      saveToRunLive: "Збережіть модель для запуску наживо",
      saveStrategy: "💾 Зберегти модель",
      saving: "Збереження...",
      saved: "✓ Збережено!",
      savedNote: "Модель збережена! Перейдіть до Моделей для перегляду або Панелі для початку аналізу.",
      exportReport: "Експорт звіту аналізу",
      downloadCSV: "📥 Завантажити CSV",
      printPDF: "📄 Друк PDF звіту",
      exportTrades: "Експорт {count} записів для вашого аналізу",
      performanceMetrics: "Показники ефективності",
      netProfit: "Чистий результат",
      maxDrawdown: "Макс. просадка",
      totalTrades: "Всього сигналів",
      profitFactor: "Profit Factor",
      sortinoRatio: "Sortino Ratio",
      yearlyReturn: "Річна ефективність",
      equityCurve: "Крива капіталу",
      drawdown: "Просадка",
      tradeHistory: "Історія сигналів",
      tradesCount: "{count} сигналів",
      transparency: "Повна прозорість з доказами по індикаторах",
      dateTime: "Дата і час",
      pair: "Актив",
      action: "Сигнал",
      price: "Ціна",
      pnl: "P&L",
      equity: "Вартість",
      dd: "DD",
      reason: "Причина",
      indicatorProof: "Докази індикаторів",
      showingFirst: "Показано перші 50 з {total} сигналів. Завантажте повний звіт для всіх даних.",
      noResultsYet: "Ще немає результатів",
      configureToSee: "Налаштуйте модель та запустіть симуляцію, щоб побачити результати тут.",
      // Condition builder
      remove: "Видалити",
      timeframe: "Таймфрейм",
      rsiLength: "Період RSI",
      condition: "Умова",
      signalValue: "Сигнальне значення",
      maPeriod: "Період MA",
      maType: "Тип MA",
      fastPeriod: "Швидкий період",
      slowPeriod: "Повільний період",
      signalPeriod: "Сигнальний період",
      macdLine: "Лінія MACD",
      bbPeriod: "Період BB",
      bbStdDev: "Ст. відхилення BB",
      lessThan: "Менше ніж",
      greaterThan: "Більше ніж",
      crossingUp: "Перетин вгору",
      crossingDown: "Перетин вниз",
    },
    
    // Dashboard
    dashboard: {
      title: "Панель управління",
      welcome: "З поверненням!",
      portfolioValue: "Вартість портфеля",
      todayPnL: "Сьогоднішня зміна",
      activeStrategies: "Активних моделей",
      totalTrades: "Всього сигналів",
      recentTrades: "Останні сигнали",
      noTrades: "Сигналів ще немає. Активуйте модель для початку аналізу.",
      yourStrategies: "Ваші моделі",
      noStrategies: "Немає активних моделей. Перейдіть до Моделей для активації.",
      goToStrategies: "Перейти до моделей",
      performance: "Показники",
      daily: "День",
      weekly: "Тиждень",
      monthly: "Місяць",
      allTime: "Весь час",
    },
    
    // Pricing
    pricing: {
      title: "Тарифні плани",
      subtitle: "Оберіть план, який вам підходить",
      monthly: "Щомісячно",
      yearly: "Щорічно",
      savePercent: "Економія 20%",
      free: "Безкоштовний",
      freePrice: "$0",
      freeDesc: "Почніть з базових функцій",
      freeFeatures: [
        "3 симуляції на день",
        "1 активна модель",
        "Базові індикатори",
        "Підтримка спільноти"
      ],
      pro: "Pro",
      proPrice: "$29/міс",
      proDesc: "Для професійних аналітиків",
      proFeatures: [
        "Необмежені симуляції",
        "5 активних моделей",
        "Всі індикатори",
        "Пріоритетна підтримка",
        "Розширене управління ризиками"
      ],
      enterprise: "Enterprise",
      enterprisePrice: "Індивідуально",
      enterpriseDesc: "Для дослідницьких команд",
      enterpriseFeatures: [
        "Все з Pro",
        "Необмежені моделі",
        "Виділений сервер",
        "Кастомні індикатори",
        "Персональний менеджер"
      ],
      currentPlan: "Поточний план",
      upgrade: "Покращити",
      contactUs: "Зв'язатися",
      popular: "Популярний",
    },
    
    // Partners
    partners: {
      title: "Наші партнери та інтеграції",
      exchanges: "Джерела даних",
      dataProviders: "Постачальники даних",
      techPartners: "Технологічні партнери",
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("uk"); // Default to Ukrainian per LiqPay requirements

  useEffect(() => {
    // Check for saved language preference first
    const saved = localStorage.getItem("algotcha-language");
    if (saved && (saved === "en" || saved === "uk")) {
      setLanguage(saved);
      return;
    }

    // Auto-detect Ukrainian users per LiqPay requirement #8
    // Check browser language first
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('uk') || browserLang.startsWith('ru')) {
      setLanguage("uk");
      localStorage.setItem("algotcha-language", "uk");
      return;
    }

    // Try to detect based on timezone (Ukraine is typically UTC+2/+3)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Kyiv') || timezone.includes('Kiev') || timezone.includes('Europe/')) {
      setLanguage("uk");
      localStorage.setItem("algotcha-language", "uk");
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
