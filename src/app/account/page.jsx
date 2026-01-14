"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountryDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Star,
  Clock,
  BarChart3,
  Settings,
  ChevronRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Rocket,
  Crown,
  Gift,
  Percent,
  Users,
  Calendar,
} from "lucide-react";

// Achievement definitions with real rules
const ACHIEVEMENTS = [
  {
    id: "first_backtest",
    name: { en: "First Steps", uk: "Перші кроки" },
    description: { en: "Run your first backtest", uk: "Запусти перший бектест" },
    rule: { en: "Complete 1 backtest", uk: "Завершити 1 бектест" },
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    points: 50,
    bonus: { en: "+1 extra backtest/day", uk: "+1 додатковий бектест/день" },
  },
  {
    id: "strategy_creator",
    name: { en: "Strategy Creator", uk: "Творець стратегій" },
    description: { en: "Save your first strategy", uk: "Збережи першу стратегію" },
    rule: { en: "Save 1 strategy from backtest", uk: "Зберегти 1 стратегію з бектесту" },
    icon: Target,
    color: "from-purple-500 to-pink-500",
    points: 100,
    bonus: { en: "Unlock strategy sharing", uk: "Розблокувати шерінг стратегій" },
  },
  {
    id: "backtester_5",
    name: { en: "Analyzer", uk: "Аналітик" },
    description: { en: "Run 5 backtests", uk: "Запусти 5 бектестів" },
    rule: { en: "Complete 5 backtests", uk: "Завершити 5 бектестів" },
    icon: BarChart3,
    color: "from-indigo-500 to-violet-500",
    points: 150,
    bonus: { en: "+2 extra backtests/day", uk: "+2 додаткових бектести/день" },
  },
  {
    id: "live_trader",
    name: { en: "Live Trader", uk: "Живий трейдер" },
    description: { en: "Start live trading", uk: "Почни живу торгівлю" },
    rule: { en: "Connect exchange & start 1 live strategy", uk: "Підключи біржу та запусти 1 живу стратегію" },
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    points: 200,
    bonus: { en: "Priority signal execution", uk: "Пріоритетне виконання сигналів" },
  },
  {
    id: "backtester_pro",
    name: { en: "Backtester Pro", uk: "Бектестер Про" },
    description: { en: "Run 25 backtests", uk: "Запусти 25 бектестів" },
    rule: { en: "Complete 25 backtests", uk: "Завершити 25 бектестів" },
    icon: Star,
    color: "from-yellow-500 to-amber-500",
    points: 300,
    bonus: { en: "Unlimited backtests", uk: "Безлімітні бектести" },
  },
  {
    id: "profit_maker",
    name: { en: "Profit Maker", uk: "Прибуткотворець" },
    description: { en: "First profitable trade", uk: "Перша прибуткова угода" },
    rule: { en: "Close 1 trade with profit", uk: "Закрити 1 угоду з прибутком" },
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    points: 250,
    bonus: { en: "-5% trading fees", uk: "-5% комісії" },
  },
  {
    id: "consistent",
    name: { en: "Consistent", uk: "Стабільний" },
    description: { en: "60%+ win rate", uk: "60%+ відсоток виграшу" },
    rule: { en: "Maintain 60%+ win rate over 20 trades", uk: "Тримати 60%+ виграш на 20 угодах" },
    icon: Shield,
    color: "from-teal-500 to-cyan-500",
    points: 400,
    bonus: { en: "-10% trading fees", uk: "-10% комісії" },
  },
  {
    id: "whale",
    name: { en: "Whale", uk: "Кит" },
    description: { en: "$1,000+ profit", uk: "$1,000+ прибутку" },
    rule: { en: "Reach $1,000 total profit", uk: "Досягти $1,000 загального прибутку" },
    icon: Crown,
    color: "from-rose-500 to-pink-500",
    points: 1000,
    bonus: { en: "VIP support + custom strategies", uk: "VIP підтримка + кастомні стратегії" },
  },
];

// Level rewards
const LEVEL_REWARDS = [
  { level: 1, title: { en: "Newbie", uk: "Новачок" }, xpRequired: 0, bonus: { en: "3 backtests/day", uk: "3 бектести/день" } },
  { level: 2, title: { en: "Apprentice", uk: "Учень" }, xpRequired: 100, bonus: { en: "5 backtests/day", uk: "5 бектестів/день" } },
  { level: 3, title: { en: "Trader", uk: "Трейдер" }, xpRequired: 300, bonus: { en: "10 backtests/day", uk: "10 бектестів/день" } },
  { level: 4, title: { en: "Expert", uk: "Експерт" }, xpRequired: 600, bonus: { en: "Unlimited backtests", uk: "Безлімітні бектести" } },
  { level: 5, title: { en: "Master", uk: "Майстер" }, xpRequired: 1000, bonus: { en: "Priority support", uk: "Пріоритетна підтримка" } },
  { level: 6, title: { en: "Legend", uk: "Легенда" }, xpRequired: 1500, bonus: { en: "Custom indicators", uk: "Кастомні індикатори" } },
  { level: 7, title: { en: "Whale", uk: "Кит" }, xpRequired: 2500, bonus: { en: "VIP everything", uk: "VIP все" } },
];

function AchievementBadge({ achievement, unlocked, language }) {
  const Icon = achievement.icon;
  
  return (
    <div className={`relative group ${!unlocked && "opacity-50"}`}>
      <div
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${
          unlocked ? achievement.color : "from-gray-300 to-gray-400"
        } p-0.5 transition-transform group-hover:scale-105`}
      >
        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative">
          {unlocked ? (
            <Icon className="w-8 h-8 text-gray-800" />
          ) : (
            <Lock className="w-6 h-6 text-gray-400" />
          )}
          {unlocked && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap min-w-[180px]">
          <p className="font-semibold">{achievement.name[language]}</p>
          <p className="text-gray-300">{achievement.description[language]}</p>
          <p className="text-amber-400 mt-1">+{achievement.points} XP</p>
          <p className="text-green-400 text-[10px]">🎁 {achievement.bonus[language]}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function AccountPageContent() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  const t = {
    overview: language === "uk" ? "Огляд" : "Overview",
    achievements: language === "uk" ? "Досягнення" : "Achievements",
    settings: language === "uk" ? "Налаштування" : "Settings",
    rewards: language === "uk" ? "Нагороди" : "Rewards",
    backtestsRun: language === "uk" ? "Бектестів запущено" : "Backtests Run",
    totalAnalyses: language === "uk" ? "Всього аналізів" : "Total analyses",
    activeStrategies: language === "uk" ? "Активних стратегій" : "Active Strategies",
    runningNow: language === "uk" ? "Зараз працюють" : "Running now",
    totalProfit: language === "uk" ? "Загальний прибуток" : "Total Profit",
    allTime: language === "uk" ? "За весь час" : "All time",
    winRate: language === "uk" ? "Відсоток виграшу" : "Win Rate",
    trades: language === "uk" ? "угод" : "trades",
    recentAchievements: language === "uk" ? "Останні досягнення" : "Recent Achievements",
    viewAll: language === "uk" ? "Переглянути всі" : "View All",
    runBacktest: language === "uk" ? "Запустити бектест" : "Run Backtest",
    runBacktestText: language === "uk" ? "Протестуй стратегію на історичних даних" : "Test your strategy against historical data",
    browseStrategies: language === "uk" ? "Переглянути стратегії" : "Browse Strategies",
    browseStrategiesText: language === "uk" ? "Досліджуй найкращі стратегії" : "Explore top-performing strategies",
    connectExchange: language === "uk" ? "Підключити біржу" : "Connect Exchange",
    connectExchangeText: language === "uk" ? "Почни живу торгівлю зі своїм API" : "Start live trading with your API",
    memberSince: language === "uk" ? "Учасник з" : "Member since",
    unlocked: language === "uk" ? "Відкрито" : "Unlocked",
    xpEarned: language === "uk" ? "Зароблено XP" : "XP earned",
    level: language === "uk" ? "Рівень" : "Level",
    progress: language === "uk" ? "Прогрес" : "Progress",
    profileSettings: language === "uk" ? "Налаштування профілю" : "Profile Settings",
    personalInfo: language === "uk" ? "Особиста інформація" : "Personal Information",
    fullName: language === "uk" ? "Повне ім'я" : "Full Name",
    email: language === "uk" ? "Електронна пошта" : "Email",
    country: language === "uk" ? "Країна" : "Country",
    phone: language === "uk" ? "Телефон" : "Phone",
    socialLinks: language === "uk" ? "Соціальні мережі" : "Social Links",
    saveChanges: language === "uk" ? "Зберегти зміни" : "Save Changes",
    saving: language === "uk" ? "Збереження..." : "Saving...",
    subscription: language === "uk" ? "Підписка" : "Subscription",
    freePlan: language === "uk" ? "Безкоштовний план" : "Free Plan",
    freePlanText: language === "uk" ? "Базові функції" : "Basic features",
    upgrade: language === "uk" ? "Покращити" : "Upgrade",
    howToEarn: language === "uk" ? "Як заробити XP" : "How to Earn XP",
    levelRewards: language === "uk" ? "Нагороди за рівні" : "Level Rewards",
    yourBonuses: language === "uk" ? "Ваші активні бонуси" : "Your Active Bonuses",
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "achievements", "rewards", "settings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [stats, setStats] = useState({
    backtestsRun: 0,
    strategiesSaved: 0,
    liveStrategies: 0,
    totalProfit: 0,
    totalTrades: 0,
    winRate: 0,
    winningTrades: 0,
    memberSince: null,
    pairsTraded: 0,
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    telegram: "",
    twitter: "",
    profilePhoto: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      country: user.country || "",
      telegram: user.telegram || "",
      twitter: user.twitter || "",
      profilePhoto: user.profilePhoto || "",
    });

    // Also load profile from backend to get profilePhoto
    loadUserProfile();
    loadStats();
    setLoading(false);
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const userData = await apiFetch("/user/profile");
      if (userData && !userData.error) {
        setProfile(p => ({
          ...p,
          profilePhoto: userData.profilePhoto || p.profilePhoto,
          phone: userData.phone || p.phone,
          country: userData.country || p.country,
        }));
      }
    } catch (e) {
      console.log("Could not load profile from backend");
    }
  };

  const loadStats = async () => {
    try {
      const [strategiesRes, runningRes, backtestsRes, tradeStatsRes] = await Promise.allSettled([
        apiFetch("/strategies/my"),
        apiFetch("/strategies/running"),
        apiFetch("/backtest/results"),
        apiFetch("/trades/stats"),
      ]);

      const strategies = strategiesRes.status === "fulfilled" ? strategiesRes.value || [] : [];
      const running = runningRes.status === "fulfilled" ? runningRes.value || [] : [];
      const backtests = backtestsRes.status === "fulfilled" ? backtestsRes.value || [] : [];
      const tradeStats = tradeStatsRes.status === "fulfilled" ? tradeStatsRes.value || {} : {};

      // Use trade stats from ALL trades (not just running strategies)
      const totalProfit = tradeStats.totalProfit || 0;
      const totalTrades = tradeStats.totalTrades || 0;
      const winningTrades = tradeStats.winningTrades || 0;
      const winRate = tradeStats.winRate || 0;
      
      // Count unique pairs traded from all strategies
      const allPairs = new Set();
      running.forEach(r => r.pairs?.forEach(p => allPairs.add(p)));
      strategies.forEach(s => {
        try {
          const pairs = typeof s.pairs === 'string' ? JSON.parse(s.pairs) : s.pairs;
          pairs?.forEach(p => allPairs.add(p));
        } catch {}
      });

      setStats({
        backtestsRun: backtests.length,
        strategiesSaved: strategies.length,
        liveStrategies: running.length,
        totalProfit,
        totalTrades,
        winRate,
        winningTrades,
        memberSince: user?.created_at || user?.createdAt,
        pairsTraded: allPairs.size,
      });

      // Calculate unlocked achievements based on REAL stats
      const unlocked = [];
      
      // First Steps: 1 backtest
      if (backtests.length >= 1) unlocked.push("first_backtest");
      
      // Strategy Creator: 1 saved strategy
      if (strategies.length >= 1) unlocked.push("strategy_creator");
      
      // Analyzer: 5 backtests
      if (backtests.length >= 5) unlocked.push("backtester_5");
      
      // Live Trader: 1 running strategy
      if (running.length >= 1) unlocked.push("live_trader");
      
      // Backtester Pro: 25 backtests
      if (backtests.length >= 25) unlocked.push("backtester_pro");
      
      // Profit Maker: any profit
      if (totalProfit > 0 && winningTrades > 0) unlocked.push("profit_maker");
      
      // Consistent: 60%+ win rate over 20 trades
      if (winRate >= 60 && totalTrades >= 20) unlocked.push("consistent");
      
      // Whale: $1000+ profit
      if (totalProfit >= 1000) unlocked.push("whale");
      
      setUnlockedAchievements(unlocked);
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  };

  const calculateLevel = () => {
    const totalXP = unlockedAchievements.reduce((sum, id) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      return sum + (achievement?.points || 0);
    }, 0);
    
    // Find current level
    let currentLevel = LEVEL_REWARDS[0];
    let nextLevel = LEVEL_REWARDS[1];
    
    for (let i = LEVEL_REWARDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_REWARDS[i].xpRequired) {
        currentLevel = LEVEL_REWARDS[i];
        nextLevel = LEVEL_REWARDS[i + 1] || LEVEL_REWARDS[i];
        break;
      }
    }
    
    const currentLevelXP = currentLevel.xpRequired;
    const nextLevelXP = nextLevel.xpRequired;
    const progress = nextLevelXP > currentLevelXP 
      ? ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 
      : 100;
    
    return { 
      level: currentLevel.level, 
      title: currentLevel.title[language],
      totalXP, 
      progress: Math.min(progress, 100), 
      nextLevelXP,
      currentBonus: currentLevel.bonus[language],
    };
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (profile.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profile.email,
        });
        if (emailError) throw emailError;
      }

      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          phone: profile.phone,
          country: profile.country,
          telegram: profile.telegram,
          twitter: profile.twitter,
        },
      });

      if (metaError) throw metaError;
      setMessage(language === "uk" ? "Профіль оновлено успішно!" : "Profile updated successfully!");
    } catch (err) {
      setError(err.message || (language === "uk" ? "Не вдалося оновити профіль." : "Failed to update profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}></div>
      </div>
    );
  }

  const { level, title, totalXP, progress, nextLevelXP, currentBonus } = calculateLevel();
  const initials = (profile.name || profile.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Get active bonuses
  const activeBonuses = unlockedAchievements.map(id => {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    return ach ? { name: ach.name[language], bonus: ach.bonus[language] } : null;
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 0)'}}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5" style={{clipPath: 'polygon(0 100%, 100% 100%, 0 0)'}}></div>
        
        <div className="relative container py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              {profile.profilePhoto ? (
                <img 
                  src={profile.profilePhoto} 
                  alt={profile.name || "Profile"} 
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-2xl">
                  {initials}
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                <span className="text-white text-sm">📷</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    // Compress and resize image
                    const compressImage = (file, maxWidth = 400, quality = 0.7) => {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;
                            
                            // Scale down if too large
                            if (width > maxWidth) {
                              height = (height * maxWidth) / width;
                              width = maxWidth;
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            // Convert to compressed JPEG
                            resolve(canvas.toDataURL('image/jpeg', quality));
                          };
                          img.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                      });
                    };
                    
                    try {
                      setMessage(language === "uk" ? "Обробка фото..." : "Processing photo...");
                      const compressedBase64 = await compressImage(file);
                      setProfile(p => ({ ...p, profilePhoto: compressedBase64 }));
                      
                      // Save to backend
                      const result = await apiFetch("/user/profile", {
                        method: "POST",
                        body: { profilePhoto: compressedBase64 },
                      });
                      if (result?.error) {
                        console.error("Backend error:", result);
                        setError(result.error + (result.details ? ": " + result.details : ""));
                      } else {
                        setMessage(language === "uk" ? "Фото оновлено!" : "Photo updated!");
                        setError(null);
                      }
                    } catch (err) {
                      console.error("Photo upload error:", err);
                      setError((language === "uk" ? "Не вдалося зберегти фото: " : "Failed to save photo: ") + err.message);
                    }
                  }}
                />
              </label>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-3 border-white shadow-lg">
                {level}
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {profile.name || "Trader"}
                </h1>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-medium">
                  {title}
                </span>
              </div>
              <p className="text-blue-100 mb-3">{profile.email}</p>
              
              <div className="max-w-xs mx-auto md:mx-0">
                <div className="flex items-center justify-between text-xs text-blue-100 mb-1">
                  <span>{t.level} {level}</span>
                  <span>{totalXP} / {nextLevelXP} XP</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-200 mt-1">🎁 {currentBonus}</p>
              </div>
            </div>

            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.strategiesSaved}</p>
                <p className="text-xs text-blue-100">{language === "uk" ? "Стратегій" : "Strategies"}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalTrades}</p>
                <p className="text-xs text-blue-100">{language === "uk" ? "Угод" : "Trades"}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</p>
                <p className="text-xs text-blue-100">{language === "uk" ? "Досягнень" : "Achievements"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 bg-white border-b border-gray-100 z-30">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: "overview", label: t.overview, icon: BarChart3 },
              { id: "achievements", label: t.achievements, icon: Trophy },
              { id: "rewards", label: t.rewards, icon: Gift },
              { id: "settings", label: t.settings, icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={BarChart3} label={t.backtestsRun} value={stats.backtestsRun} subtext={t.totalAnalyses} color="blue" />
              <StatCard icon={Target} label={t.activeStrategies} value={stats.liveStrategies} subtext={t.runningNow} color="green" />
              <StatCard icon={TrendingUp} label={t.totalProfit} value={`$${stats.totalProfit.toFixed(2)}`} subtext={t.allTime} color="purple" />
              <StatCard icon={Trophy} label={t.winRate} value={`${stats.winRate.toFixed(1)}%`} subtext={`${stats.totalTrades} ${t.trades}`} color="amber" />
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    {t.recentAchievements}
                  </CardTitle>
                  <button onClick={() => setActiveTab("achievements")} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    {t.viewAll} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {ACHIEVEMENTS.slice(0, 6).map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} unlocked={unlockedAchievements.includes(achievement.id)} language={language} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/backtest" className="block group">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                  <BarChart3 className="w-8 h-8 mb-3 opacity-80" />
                  <h3 className="font-semibold text-lg mb-1">{t.runBacktest}</h3>
                  <p className="text-sm text-blue-100">{t.runBacktestText}</p>
                </div>
              </Link>
              <Link href="/strategies" className="block group">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                  <Target className="w-8 h-8 mb-3 opacity-80" />
                  <h3 className="font-semibold text-lg mb-1">{t.browseStrategies}</h3>
                  <p className="text-sm text-purple-100">{t.browseStrategiesText}</p>
                </div>
              </Link>
              <Link href="/connect" className="block group">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                  <Zap className="w-8 h-8 mb-3 opacity-80" />
                  <h3 className="font-semibold text-lg mb-1">{t.connectExchange}</h3>
                  <p className="text-sm text-amber-100">{t.connectExchangeText}</p>
                </div>
              </Link>
            </div>

            {stats.memberSince && (
              <div className="text-center text-sm text-gray-500">
                <Clock className="w-4 h-4 inline-block mr-1" />
                {t.memberSince} {new Date(stats.memberSince).toLocaleDateString(language === "uk" ? "uk-UA" : "en-US", { month: "long", year: "numeric" })}
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {unlockedAchievements.length} / {ACHIEVEMENTS.length} {t.unlocked}
                      </h3>
                      <p className="text-gray-600">{totalXP} XP • {t.level} {level} ({title})</p>
                    </div>
                  </div>
                  <div className="w-full md:w-64">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{t.progress}</span>
                      <span>{Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((achievement) => {
                const Icon = achievement.icon;
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                
                return (
                  <Card key={achievement.id} className={`overflow-hidden transition-all hover:shadow-lg ${!isUnlocked && "opacity-60"}`}>
                    <div className={`h-2 bg-gradient-to-r ${isUnlocked ? achievement.color : "from-gray-300 to-gray-400"}`}></div>
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isUnlocked ? achievement.color : "from-gray-300 to-gray-400"} flex items-center justify-center flex-shrink-0`}>
                          {isUnlocked ? <Icon className="w-6 h-6 text-white" /> : <Lock className="w-5 h-5 text-white/70" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">{achievement.name[language]}</h4>
                            {isUnlocked && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-500 mb-1">{achievement.rule[language]}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-600 text-sm font-medium flex items-center gap-1">
                              <Star className="w-3.5 h-3.5" /> +{achievement.points} XP
                            </span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">🎁 {achievement.bonus[language]}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="space-y-8">
            {/* Active Bonuses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-500" />
                  {t.yourBonuses}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeBonuses.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeBonuses.map((b, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{b.name}</p>
                          <p className="text-xs text-green-600">{b.bonus}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{t.level} {level} {language === "uk" ? "Бонус" : "Bonus"}</p>
                        <p className="text-xs text-blue-600">{currentBonus}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {language === "uk" ? "Виконуй досягнення, щоб отримати бонуси!" : "Complete achievements to earn bonuses!"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Level Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  {t.levelRewards}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {LEVEL_REWARDS.map((lvl) => {
                    const isUnlocked = level >= lvl.level;
                    return (
                      <div key={lvl.level} className={`flex items-center justify-between p-4 rounded-xl border ${isUnlocked ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isUnlocked ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                            {lvl.level}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{lvl.title[language]}</p>
                            <p className="text-sm text-gray-500">{lvl.xpRequired} XP {language === "uk" ? "потрібно" : "required"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${isUnlocked ? "text-green-600" : "text-gray-400"}`}>
                            {isUnlocked ? "✓" : ""} {lvl.bonus[language]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* How to Earn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  {t.howToEarn}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-2">{language === "uk" ? "Бектестування" : "Backtesting"}</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 1 {language === "uk" ? "бектест" : "backtest"} = 50 XP</li>
                      <li>• 5 {language === "uk" ? "бектестів" : "backtests"} = 150 XP</li>
                      <li>• 25 {language === "uk" ? "бектестів" : "backtests"} = 300 XP</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <h4 className="font-semibold text-green-900 mb-2">{language === "uk" ? "Торгівля" : "Trading"}</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• {language === "uk" ? "Запустити живу стратегію" : "Start live strategy"} = 200 XP</li>
                      <li>• {language === "uk" ? "Перший прибуток" : "First profit"} = 250 XP</li>
                      <li>• 60%+ {language === "uk" ? "виграш" : "win rate"} = 400 XP</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t.profileSettings}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">{t.personalInfo}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{t.fullName}</label>
                      <Input placeholder={t.fullName} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{t.email}</label>
                      <Input placeholder={t.email} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{t.country}</label>
                      <CountryDropdown value={profile.country} onChange={(val) => setProfile({ ...profile, country: val })} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{t.phone}</label>
                      <PhoneInput country={"ua"} value={profile.phone} onChange={(phone) => setProfile({ ...profile, phone })} inputClass="w-full! h-11! pl-12! pr-4! rounded-xl! border! border-gray-200! text-gray-900! focus:outline-none! focus:ring-2! focus:ring-blue-500!" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">{t.socialLinks}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Telegram @username" value={profile.telegram} onChange={(e) => setProfile({ ...profile, telegram: e.target.value })} />
                    <Input placeholder="Twitter @username" value={profile.twitter} onChange={(e) => setProfile({ ...profile, twitter: e.target.value })} />
                  </div>
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">{error}</div>}
                {message && <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm">{message}</div>}

                <Button onClick={onSave} disabled={saving} className="w-full md:w-auto">
                  {saving ? t.saving : t.saveChanges}
          </Button>
        </CardContent>
      </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  {t.subscription}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{t.freePlan}</p>
                    <p className="text-sm text-gray-500">{t.freePlanText} • {currentBonus}</p>
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm">{t.upgrade}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>}>
      <AccountPageContent />
    </Suspense>
  );
}
