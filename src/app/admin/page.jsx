"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  Users, 
  Settings, 
  ListChecks, 
  Crown,
  BarChart3,
  Shield
} from "lucide-react";

export default function AdminDashboard() {
  const { language } = useLanguage();

  const t = {
    title: language === "uk" ? "Панель адміністратора" : "Admin Dashboard",
    subtitle: language === "uk" 
      ? "Центральна панель керування платформою Algotcha" 
      : "Central control panel for Algotcha platform",
    sections: {
      subscriptions: {
        title: language === "uk" ? "Підписки користувачів" : "User Subscriptions",
        description: language === "uk" 
          ? "Керування підписками, надання доступу та перегляд статистики бектестів"
          : "Manage subscriptions, grant access, and view backtest quality stats",
        icon: Crown,
        color: "from-emerald-500 to-emerald-600",
      },
      queue: {
        title: language === "uk" ? "Черга бектестів" : "Backtest Queue",
        description: language === "uk" 
          ? "Моніторинг черги бектестів, статус виконання та налагодження"
          : "Monitor backtest queue, execution status, and debugging",
        icon: ListChecks,
        color: "from-blue-500 to-blue-600",
      },
      strategies: {
        title: language === "uk" ? "Стратегії та режими" : "Strategies & Modes",
        description: language === "uk" 
          ? "Керування mock-стратегіями та перемикання режиму торгівлі (криптовалюти/акції)"
          : "Manage mock strategies and toggle trading mode (crypto/stocks)",
        icon: Settings,
        color: "from-purple-500 to-purple-600",
      },
    },
    stats: {
      title: language === "uk" ? "Швидка статистика" : "Quick Stats",
      totalUsers: language === "uk" ? "Всього користувачів" : "Total Users",
      activeSubscriptions: language === "uk" ? "Активні підписки" : "Active Subscriptions",
      queuedBacktests: language === "uk" ? "Бектестів у черзі" : "Queued Backtests",
    }
  };

  const adminSections = [
    {
      id: "subscriptions",
      href: "/admin/subscriptions",
      ...t.sections.subscriptions,
    },
    {
      id: "queue",
      href: "/admin/queue",
      ...t.sections.queue,
    },
    {
      id: "strategies",
      href: "/admin/strategies",
      ...t.sections.strategies,
    },
  ];

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.id} href={section.href}>
              <Card className="h-full border-2 border-gray-100 hover:border-black hover:shadow-2xl transition-all cursor-pointer group" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`} style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {language === "uk" ? "Відкрити" : "Open"}
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Info Banner */}
      <Card className="border-2 border-emerald-200 bg-emerald-50" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center flex-shrink-0" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 mb-1">
                {language === "uk" ? "Захищена зона" : "Protected Area"}
              </h3>
              <p className="text-sm text-emerald-800">
                {language === "uk" 
                  ? "Ця панель адміністратора містить чутливі інструменти керування. Будьте обережні при внесенні змін до підписок користувачів та налаштувань системи."
                  : "This admin dashboard contains sensitive management tools. Please be careful when making changes to user subscriptions and system settings."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
