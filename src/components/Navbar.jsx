"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

const nav = [
  { to: "/strategies", label: "Strategies" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/invest", label: "Invest" },
  { to: "/risk", label: "Risk" },
  { to: "/reports", label: "Reports" },
  { to: "/pricing", label: "Pricing" },
  { to: "/connect", label: "Connect" },
  { to: "/live", label: "Live" },
];

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
        <Link href="/" className="text-xl font-bold capitalize">
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
                <Button variant="secondary" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth?mode=register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  {user.name || user.email}
                </Button>
              </Link>
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet
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
                  <Link href="/auth" className="text-gray-800">
                    Sign in
                  </Link>
                  <Link href="/auth?mode=register" className="text-gray-800">
                    Get started
                  </Link>
                </>
              ) : (
                <>
                  <div className="p-2 border rounded bg-gray-50">
                    <p className="font-medium">{user.name || "No name"}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.country && (
                      <p className="text-sm text-gray-600">{user.country}</p>
                    )}
                    {user.phone && (
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    )}
                  </div>
                  <Link href="/profile" className="text-gray-800">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-800"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
