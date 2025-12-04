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
  CreditCard
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useState, useRef, useEffect } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/strategies", label: "Strategies" },
  { to: "/backtest", label: "Backtest" },
  { to: "/connect", label: "Connect" },
  { to: "/pricing", label: "Pricing" },
];

function UserDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close on outside click
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 truncate">{user.name || "Trader"}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/account?tab=achievements"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Achievements</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/strategies"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Target className="w-4 h-4 text-purple-500" />
              <span>My Strategies</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Secondary Actions */}
          <div className="py-1">
            <Link
              href="/connect"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Zap className="w-4 h-4 text-green-500" />
              <span>Connect Exchange</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Upgrade Plan</span>
            </Link>
            <Link
              href="/account?tab=settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 mt-1 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
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

        {/* Right side: profile or auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get started
                </Button>
              </Link>
            </>
          ) : (
            <UserDropdown user={user} onLogout={handleLogout} />
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
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
                    Sign in
                  </Link>
                  <Link href="/auth?mode=signup" className="text-blue-600 font-medium">
                    Get started
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
                    My Profile
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2 text-gray-800">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link href="/connect" className="flex items-center gap-2 text-gray-800">
                    <Zap className="w-4 h-4" />
                    Connect Exchange
                  </Link>
                  <Link href="/account?tab=settings" className="flex items-center gap-2 text-gray-800">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
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
