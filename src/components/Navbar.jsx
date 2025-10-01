"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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

  return (
    <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 sticky top-0 z-40">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold capitalize">
          Algotcha
        </Link>

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

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth">
            <Button variant="secondary" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/auth?mode=signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

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
              <Link href="/auth" className="text-gray-800">
                Sign in
              </Link>
              <Link href="/auth?mode=signup" className="text-gray-800">
                Get started
              </Link>
            </div>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
