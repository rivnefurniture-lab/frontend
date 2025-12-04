"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
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
  Award,
  Clock,
  BarChart3,
  Settings,
  ChevronRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Rocket,
  Crown,
  Medal,
  Gift,
} from "lucide-react";

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: "first_backtest",
    name: "First Steps",
    description: "Run your first backtest",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    points: 10,
  },
  {
    id: "strategy_creator",
    name: "Strategy Creator",
    description: "Save your first strategy",
    icon: Target,
    color: "from-purple-500 to-pink-500",
    points: 25,
  },
  {
    id: "live_trader",
    name: "Live Trader",
    description: "Start your first live strategy",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    points: 50,
  },
  {
    id: "profit_maker",
    name: "Profit Maker",
    description: "Achieve your first profitable trade",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    points: 100,
  },
  {
    id: "backtester_pro",
    name: "Backtester Pro",
    description: "Run 10 backtests",
    icon: BarChart3,
    color: "from-indigo-500 to-violet-500",
    points: 75,
  },
  {
    id: "diversified",
    name: "Diversified",
    description: "Trade 5 different pairs",
    icon: Shield,
    color: "from-teal-500 to-cyan-500",
    points: 50,
  },
  {
    id: "consistent",
    name: "Consistent",
    description: "Maintain a 60%+ win rate over 50 trades",
    icon: Star,
    color: "from-yellow-500 to-amber-500",
    points: 150,
  },
  {
    id: "whale",
    name: "Whale",
    description: "Achieve $10,000+ in total profit",
    icon: Crown,
    color: "from-rose-500 to-pink-500",
    points: 500,
  },
];

function AchievementBadge({ achievement, unlocked, progress }) {
  const Icon = achievement.icon;
  
  return (
    <div className={`relative group ${!unlocked && "opacity-50"}`}>
      <div
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${
          unlocked ? achievement.color : "from-gray-300 to-gray-400"
        } p-0.5 transition-transform group-hover:scale-105`}
      >
        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[14px] flex items-center justify-center relative">
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
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          <p className="font-semibold">{achievement.name}</p>
          <p className="text-gray-300">{achievement.description}</p>
          <p className="text-amber-400 mt-1">+{achievement.points} XP</p>
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

export default function AccountPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "achievements", "settings"].includes(tab)) {
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
    memberSince: null,
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  
  // Profile form state
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    telegram: "",
    twitter: "",
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
    });

    loadStats();
    setLoading(false);
  }, [user]);

  const loadStats = async () => {
    try {
      const [strategiesRes, runningRes, backtestsRes] = await Promise.allSettled([
        apiFetch("/strategies/my"),
        apiFetch("/strategies/running"),
        apiFetch("/backtest/results"),
      ]);

      const strategies = strategiesRes.status === "fulfilled" ? strategiesRes.value || [] : [];
      const running = runningRes.status === "fulfilled" ? runningRes.value || [] : [];
      const backtests = backtestsRes.status === "fulfilled" ? backtestsRes.value || [] : [];

      const totalProfit = running.reduce((sum, r) => sum + (r.totalProfit || 0), 0);
      const totalTrades = running.reduce((sum, r) => sum + (r.totalTrades || 0), 0);
      const winningTrades = running.reduce((sum, r) => sum + (r.winningTrades || 0), 0);
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

      setStats({
        backtestsRun: backtests.length,
        strategiesSaved: strategies.length,
        liveStrategies: running.length,
        totalProfit,
        totalTrades,
        winRate,
        memberSince: user?.created_at || user?.createdAt,
      });

      // Calculate unlocked achievements
      const unlocked = [];
      if (backtests.length >= 1) unlocked.push("first_backtest");
      if (backtests.length >= 10) unlocked.push("backtester_pro");
      if (strategies.length >= 1) unlocked.push("strategy_creator");
      if (running.length >= 1) unlocked.push("live_trader");
      if (totalProfit > 0) unlocked.push("profit_maker");
      if (totalProfit >= 10000) unlocked.push("whale");
      if (winRate >= 60 && totalTrades >= 50) unlocked.push("consistent");
      
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
    
    // Level formula: Level = floor(sqrt(XP / 10))
    const level = Math.floor(Math.sqrt(totalXP / 10)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * 10;
    const nextLevelXP = Math.pow(level, 2) * 10;
    const progress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    
    return { level, totalXP, progress: Math.min(progress, 100), nextLevelXP };
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
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const { level, totalXP, progress, nextLevelXP } = calculateLevel();
  const initials = (profile.name || profile.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Profile */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative container py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-2xl">
                {initials}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-3 border-white shadow-lg">
                {level}
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {profile.name || "Trader"}
              </h1>
              <p className="text-blue-100 mb-3">{profile.email}</p>
              
              {/* Level Progress */}
              <div className="max-w-xs mx-auto md:mx-0">
                <div className="flex items-center justify-between text-xs text-blue-100 mb-1">
                  <span>Level {level}</span>
                  <span>{totalXP} / {nextLevelXP} XP</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.strategiesSaved}</p>
                <p className="text-xs text-blue-100">Strategies</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalTrades}</p>
                <p className="text-xs text-blue-100">Trades</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{unlockedAchievements.length}</p>
                <p className="text-xs text-blue-100">Achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 bg-white border-b border-gray-100 z-30">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "achievements", label: "Achievements", icon: Trophy },
              { id: "settings", label: "Settings", icon: Settings },
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
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={BarChart3}
                label="Backtests Run"
                value={stats.backtestsRun}
                subtext="Total analyses"
                color="blue"
              />
              <StatCard
                icon={Target}
                label="Active Strategies"
                value={stats.liveStrategies}
                subtext="Running now"
                color="green"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Profit"
                value={`$${stats.totalProfit.toFixed(2)}`}
                subtext="All time"
                color="purple"
              />
              <StatCard
                icon={Trophy}
                label="Win Rate"
                value={`${stats.winRate.toFixed(1)}%`}
                subtext={`${stats.totalTrades} trades`}
                color="amber"
              />
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Recent Achievements
                  </CardTitle>
                  <button
                    onClick={() => setActiveTab("achievements")}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {ACHIEVEMENTS.slice(0, 6).map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={unlockedAchievements.includes(achievement.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/backtest" className="block group">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                  <BarChart3 className="w-8 h-8 mb-3 opacity-80" />
                  <h3 className="font-semibold text-lg mb-1">Run Backtest</h3>
                  <p className="text-sm text-blue-100">Test your strategy against historical data</p>
                </div>
              </Link>
              <Link href="/strategies" className="block group">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                  <Target className="w-8 h-8 mb-3 opacity-80" />
                  <h3 className="font-semibold text-lg mb-1">Browse Strategies</h3>
                  <p className="text-sm text-purple-100">Explore top-performing strategies</p>
                </div>
              </Link>
              <Link href="/connect" className="block group">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                  <Zap className="w-8 h-8 mb-3 opacity-80" />
                  <h3 className="font-semibold text-lg mb-1">Connect Exchange</h3>
                  <p className="text-sm text-amber-100">Start live trading with your API</p>
                </div>
              </Link>
            </div>

            {/* Member Since */}
            {stats.memberSince && (
              <div className="text-center text-sm text-gray-500">
                <Clock className="w-4 h-4 inline-block mr-1" />
                Member since {new Date(stats.memberSince).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-8">
            {/* Progress Summary */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
                      </h3>
                      <p className="text-gray-600">
                        {totalXP} XP earned • Level {level}
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-64">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((achievement) => {
                const Icon = achievement.icon;
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                
                return (
                  <Card
                    key={achievement.id}
                    className={`overflow-hidden transition-all hover:shadow-lg ${
                      !isUnlocked && "opacity-60"
                    }`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${isUnlocked ? achievement.color : "from-gray-300 to-gray-400"}`}></div>
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                          isUnlocked ? achievement.color : "from-gray-300 to-gray-400"
                        } flex items-center justify-center flex-shrink-0`}>
                          {isUnlocked ? (
                            <Icon className="w-6 h-6 text-white" />
                          ) : (
                            <Lock className="w-5 h-5 text-white/70" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {achievement.name}
                            </h4>
                            {isUnlocked && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                            <Star className="w-3.5 h-3.5" />
                            +{achievement.points} XP
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                      <Input
                        placeholder="Your name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email</label>
                      <Input
                        placeholder="Email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Country</label>
                      <CountryDropdown
                        value={profile.country}
                        onChange={(val) => setProfile({ ...profile, country: val })}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Phone</label>
                      <PhoneInput
                        country={"us"}
                        value={profile.phone}
                        onChange={(phone) => setProfile({ ...profile, phone })}
                        inputClass="w-full! h-11! pl-12! pr-4! rounded-xl! border! border-gray-200! text-gray-900! focus:outline-none! focus:ring-2! focus:ring-blue-500!"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Social Links</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Telegram</label>
                      <Input
                        placeholder="@username"
                        value={profile.telegram}
                        onChange={(e) => setProfile({ ...profile, telegram: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Twitter / X</label>
                      <Input
                        placeholder="@username"
                        value={profile.twitter}
                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm">
                    {message}
                  </div>
                )}

                <Button onClick={onSave} disabled={saving} className="w-full md:w-auto">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Free Plan</p>
                    <p className="text-sm text-gray-500">Basic features • 3 backtests/day</p>
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm">
                      Upgrade
                    </Button>
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
