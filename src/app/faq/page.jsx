"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is Algotcha?",
        a: "Algotcha is an algorithmic trading platform that lets you automate your crypto trading using proven strategies. You can browse pre-built strategies, backtest your own ideas, and run them 24/7 on your exchange account.",
      },
      {
        q: "How do I get started?",
        a: "1. Create a free account. 2. Browse our featured strategies or build your own using the backtest tool. 3. Connect your exchange (Binance, Bybit, or OKX) with API keys. 4. Select a strategy and start live trading. That's it!",
      },
      {
        q: "Is it free to use?",
        a: "You can browse strategies, run backtests, and explore the platform for free. Live trading requires a subscription plan. We offer different tiers based on your trading needs.",
      },
      {
        q: "Which exchanges are supported?",
        a: "We currently support Binance, Bybit, and OKX. More exchanges will be added based on user demand. All major spot trading pairs are available.",
      },
    ],
  },
  {
    category: "Security & Safety",
    items: [
      {
        q: "Is my money safe?",
        a: "Your funds never leave your exchange. We only use API keys with trading permissions — never withdrawal access. You maintain full custody of your assets at all times.",
      },
      {
        q: "How are my API keys protected?",
        a: "API keys are encrypted using industry-standard encryption before storage. They are only decrypted on our secure trading server when executing trades. We recommend enabling IP whitelisting on your exchange for additional security.",
      },
      {
        q: "What IP should I whitelist?",
        a: "Our trading server IP is 46.224.99.27. Whitelisting this IP on your exchange ensures only our server can execute trades with your API keys, adding an extra layer of security.",
      },
      {
        q: "Can you withdraw my funds?",
        a: "No. When creating API keys, you should ONLY enable trading permissions. Never enable withdrawals. This is a fundamental security practice we strongly recommend.",
      },
    ],
  },
  {
    category: "Strategies & Backtesting",
    items: [
      {
        q: "How accurate are the backtests?",
        a: "Our backtests use real 1-minute OHLCV data from Binance going back to 2020. We account for trading fees and realistic execution. However, past performance doesn't guarantee future results — slippage and market conditions vary.",
      },
      {
        q: "What indicators are available?",
        a: "We support 20+ technical indicators including RSI, MACD, Bollinger Bands, Moving Averages, Stochastic, ATR, CCI, ADX, Ichimoku, and more. Each indicator can be customized with your preferred parameters.",
      },
      {
        q: "Can I create my own strategy?",
        a: "Yes! Use our visual backtest builder to combine indicators and create custom entry/exit conditions. Test your strategy against 5 years of data before going live.",
      },
      {
        q: "How often are strategy results updated?",
        a: "Featured strategies are recalculated every hour using the latest market data. This ensures the performance metrics you see reflect current market conditions.",
      },
    ],
  },
  {
    category: "Trading & Execution",
    items: [
      {
        q: "How quickly are trades executed?",
        a: "Trades are executed on a dedicated server with a static IP, ensuring low-latency connections to exchanges. Market orders are typically filled within seconds.",
      },
      {
        q: "What happens if the server goes down?",
        a: "Your open positions remain on the exchange. We have monitoring and auto-restart systems in place. If extended downtime occurs, you can manually manage positions from your exchange.",
      },
      {
        q: "Can I set stop losses and take profits?",
        a: "Yes. Our backtest and live trading support stop loss, take profit, trailing stops, and safety orders (DCA). You can configure risk management for each strategy.",
      },
      {
        q: "What trading pairs are available?",
        a: "We support all major crypto pairs against USDT including BTC, ETH, SOL, XRP, ADA, DOGE, AVAX, LINK, DOT, NEAR, LTC, and more. 17 pairs with full historical data.",
      },
    ],
  },
  {
    category: "Account & Billing",
    items: [
      {
        q: "How do I cancel my subscription?",
        a: "You can cancel anytime from your account settings. Your subscription will remain active until the end of the billing period.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept Binance Pay and direct crypto payments (USDT). More payment options coming soon.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes! You can explore the platform, run backtests, and analyze strategies without any payment. Only live trading requires a subscription.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about Algotcha. Can&apos;t find what you&apos;re
            looking for?{" "}
            <Link href="/support" className="text-blue-600 hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="container max-w-3xl py-12">
        {faqs.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq, itemIndex) => {
                const currentIndex = globalIndex++;
                const isOpen = openIndex === currentIndex;

                return (
                  <div
                    key={itemIndex}
                    className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggle(currentIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <span className="font-medium pr-4">{faq.q}</span>
                      <span
                        className={`text-xl transition-transform ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t bg-gray-50">
                        <p className="pt-4">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Still have questions */}
      <section className="bg-blue-50 py-12">
        <div className="container max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help. Reach out and we&apos;ll get back to
            you as soon as possible.
          </p>
          <Link href="/support">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
