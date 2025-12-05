"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Trophy, 
  BarChart3, 
  Target, 
  ChevronDown,
  Zap,
  CreditCard,
  Globe,
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import { useState, useRef, useEffect, useCallback } from "react";

// Balance Widget - shows USDT balance and today's PnL
function BalanceWidget() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [balance, setBalance] = useState(null);
  const [todayPnL, setTodayPnL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch balance from exchange
      const balanceRes = await apiFetch("/exchange/balance?currency=USDT");
      if (balanceRes && !balanceRes.error) {
        const usdtBalance = balanceRes.USDT?.total || balanceRes.total || balanceRes.balance || 0;
        setBalance(typeof usdtBalance === 'number' ? usdtBalance : parseFloat(usdtBalance) || 0);
      }

      // Fetch today's trades for PnL calculation
      const statsRes = await apiFetch("/trades/stats");
      if (statsRes && !statsRes.error) {
        setTodayPnL(statsRes.todayPnLPercent || 0);
      }
      
      setLastUpdate(new Date());
    } catch (err) {
      console.log("Balance fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  if (!user) return null;
  if (loading && balance === null) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg animate-pulse">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (balance === null) return null;

  const pnlColor = todayPnL >= 0 ? "text-green-600" : "text-red-600";
  const pnlBg = todayPnL >= 0 ? "bg-green-50" : "bg-red-50";
  const PnLIcon = todayPnL >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center gap-2">
      {/* Balance Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <Wallet className="w-4 h-4 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 leading-none">
            {language === "uk" ? "Баланс" : "Balance"}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Today's PnL */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 ${pnlBg} rounded-lg`}>
        <PnLIcon className={`w-3.5 h-3.5 ${pnlColor}`} />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 leading-none">
            {language === "uk" ? "Сьогодні" : "Today"}
          </span>
          <span className={`text-sm font-semibold ${pnlColor}`}>
            {todayPnL >= 0 ? "+" : ""}{(todayPnL || 0).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        title={language === "uk" ? "Оновити" : "Refresh"}
      >
        <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${isRefreshing ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}

function LanguageSwitcher() {
  const { language, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{language}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 min-w-[120px]">
          <button
            onClick={() => { setLang("uk"); setIsOpen(false); }}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
              language === "uk" ? "text-blue-600 font-medium" : "text-gray-700"
            }`}
          >
            <span className="text-base">🇺🇦</span>
            Українська
          </button>
          <button
            onClick={() => { setLang("en"); setIsOpen(false); }}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
              language === "en" ? "text-blue-600 font-medium" : "text-gray-700"
            }`}
          >
            <span className="text-base">🇬🇧</span>
            English
          </button>
        </div>
      )}
    </div>
  );
}

function UserDropdown({ user, onLogout }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[120px] truncate">
          {user.name || user.email?.split("@")[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 truncate">{user.name || "Trader"}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          <div className="py-2">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>{t("nav.myProfile")}</span>
            </Link>
            <Link
              href="/account?tab=achievements"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{t("nav.achievements")}</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>{t("nav.dashboard")}</span>
            </Link>
            <Link
              href="/trades"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-green-500" />
              <span>{language === "uk" ? "Історія угод" : "Trade History"}</span>
            </Link>
            <Link
              href="/strategies"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Target className="w-4 h-4 text-purple-500" />
              <span>{t("nav.myStrategies")}</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 my-1"></div>

          <div className="py-1">
            <Link
              href="/connect"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Zap className="w-4 h-4 text-green-500" />
              <span>{t("nav.connectExchange")}</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>{t("nav.upgradePlan")}</span>
            </Link>
            <Link
              href="/account?tab=settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>{t("nav.settings")}</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 mt-1 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("nav.logOut")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const nav = [
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/strategies", label: t("nav.strategies") },
    { to: "/backtest", label: t("nav.backtest") },
    { to: "/connect", label: t("nav.connect") },
    { to: "/pricing", label: t("nav.pricing") },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 sticky top-0 z-40">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold capitalize flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          Algotcha
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {nav.map((n) => {
            const isActive = pathname === n.to;
            return (
              <Link
                key={n.to}
                href={n.to}
                className={
                  isActive
                    ? "text-blue-600 font-medium"
                    : "text-gray-700 hover:text-blue-600"
                }
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: balance + language + profile/auth */}
        <div className="hidden md:flex items-center gap-3">
          {user && <BalanceWidget />}
          
          <div className="h-6 w-px bg-gray-200"></div>
          
          <LanguageSwitcher />
          
          {!user ? (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {t("nav.getStarted")}
                </Button>
              </Link>
            </>
          ) : (
            <UserDropdown user={user} onLogout={handleLogout} />
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <MobileMenu
            trigger={
              <Button variant="secondary" size="sm">
                <Menu size={18} />
              </Button>
            }
          >
            <div className="flex flex-col gap-4">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  href={n.to}
                  className={
                    pathname === n.to
                      ? "text-blue-600 font-medium"
                      : "text-gray-800"
                  }
                >
                  {n.label}
                </Link>
              ))}
              {!user ? (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link href="/auth" className="text-gray-800">
                    {t("nav.signIn")}
                  </Link>
                  <Link href="/auth?mode=signup" className="text-blue-600 font-medium">
                    {t("nav.getStarted")}
                  </Link>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                        {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.name || "Trader"}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/account" className="flex items-center gap-2 text-gray-800">
                    <User className="w-4 h-4" />
                    {t("nav.myProfile")}
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2 text-gray-800">
                    <BarChart3 className="w-4 h-4" />
                    {t("nav.dashboard")}
                  </Link>
                  <Link href="/connect" className="flex items-center gap-2 text-gray-800">
                    <Zap className="w-4 h-4" />
                    {t("nav.connectExchange")}
                  </Link>
                  <Link href="/account?tab=settings" className="flex items-center gap-2 text-gray-800">
                    <Settings className="w-4 h-4" />
                    {t("nav.settings")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("nav.logOut")}
                  </button>
                </>
              )}
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
