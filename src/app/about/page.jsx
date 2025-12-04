"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Algorithmic Trading,{" "}
            <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Algotcha empowers traders to automate their strategies with
            institutional-grade tools, transparent performance data, and
            secure execution.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-16 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe that algorithmic trading shouldn&apos;t be reserved for
              hedge funds and institutions. Our mission is to democratize
              quantitative trading by providing the tools, data, and
              infrastructure that retail traders need to succeed.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every strategy on Algotcha is backtested against real historical
              data, with transparent metrics that help you understand the true
              risk and potential reward.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-gray-600">Years of Data</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">17</div>
                <div className="text-sm text-gray-600">Crypto Pairs</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">20+</div>
                <div className="text-sm text-gray-600">Indicators</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Automation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We&apos;re Different */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">
            How We&apos;re Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Real Data Only</h3>
              <p className="text-gray-600 text-sm">
                No hypothetical backtests. All performance metrics come from
                minute-by-minute historical data going back to 2020.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg mb-2">Full Transparency</h3>
              <p className="text-gray-600 text-sm">
                See every trade, every indicator value, every decision. No
                black boxes. Understand exactly why each trade was made.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="font-semibold text-lg mb-2">Security First</h3>
              <p className="text-gray-600 text-sm">
                Your API keys are encrypted. Trading only permissions — never
                withdrawals. Dedicated server with static IP for reliable
                execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container py-16 max-w-4xl">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Built by Traders, for Traders
        </h2>
        <div className="bg-white border rounded-2xl p-8 text-center">
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Our team combines years of experience in quantitative trading,
            software engineering, and financial technology. We&apos;ve built
            Algotcha to solve the problems we faced ourselves: unreliable
            backtests, opaque strategies, and fragmented tools.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join traders who trust Algotcha for automated, transparent, and
            secure algorithmic trading.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Create Free Account
              </Button>
            </Link>
            <Link href="/strategies">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Strategies
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
