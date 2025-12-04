"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SupportPage() {
  const [form, setForm] = useState({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending (in production, this would hit an API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatus("success");
    setForm({ email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-gray-600 text-lg">
            Our team is here to help you succeed with algorithmic trading.
          </p>
        </div>
      </section>

      <div className="container max-w-5xl py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Help Options */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border rounded-xl p-5">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold mb-2">FAQ</h3>
              <p className="text-sm text-gray-600 mb-3">
                Find answers to common questions about trading, security, and billing.
              </p>
              <Link href="/faq" className="text-blue-600 text-sm hover:underline">
                Browse FAQ →
              </Link>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold mb-2">Telegram</h3>
              <p className="text-sm text-gray-600 mb-3">
                Join our community for real-time help and discussions.
              </p>
              <a 
                href="https://t.me/algotcha" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                Join Telegram →
              </a>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-gray-600 mb-3">
                For detailed inquiries, reach us directly via email.
              </p>
              <a 
                href="mailto:support@algotcha.com"
                className="text-blue-600 text-sm hover:underline"
              >
                support@algotcha.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
              
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setStatus(null)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <select
                      className="w-full h-11 px-4 rounded-lg border border-gray-200"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                    >
                      <option value="">Select a topic...</option>
                      <option value="account">Account & Login</option>
                      <option value="exchange">Exchange Connection</option>
                      <option value="strategy">Strategies & Backtesting</option>
                      <option value="trading">Live Trading</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      className="w-full h-40 p-4 rounded-lg border border-gray-200 resize-none"
                      placeholder="Describe your issue or question in detail..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Response Time */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong>⏱ Response Time:</strong> We typically respond within 24 hours. 
              For urgent trading issues, please check our{" "}
              <Link href="/faq" className="underline">FAQ</Link> first.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
