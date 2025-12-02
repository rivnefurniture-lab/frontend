"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";

const EXCHANGES = [
  {
    id: "binance",
    name: "Binance",
    logo: "🟡",
    color: "from-yellow-400 to-yellow-600",
    description: "World's largest crypto exchange",
    fields: ["apiKey", "secret"],
    testnetUrl: "https://testnet.binance.vision/",
    docsUrl: "https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
  },
  {
    id: "bybit",
    name: "Bybit",
    logo: "🔶",
    color: "from-orange-400 to-orange-600",
    description: "Fast derivatives exchange",
    fields: ["apiKey", "secret"],
    testnetUrl: "https://testnet.bybit.com/",
    docsUrl: "https://learn.bybit.com/bybit-guide/how-to-create-bybit-api-key/"
  },
  {
    id: "okx",
    name: "OKX",
    logo: "⚫",
    color: "from-gray-700 to-gray-900",
    description: "Advanced trading platform",
    fields: ["apiKey", "secret", "password"],
    testnetUrl: "https://www.okx.com/docs-v5/en/",
    docsUrl: "https://www.okx.com/support/hc/en-us/articles/360048917891"
  }
];

function ExchangeCard({ exchange, onConnect }) {
  const [form, setForm] = useState({ testnet: true });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null);
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(null);

  const handle = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      await apiFetch("/exchange/connect", {
        method: "POST",
        body: JSON.stringify({
          exchange: exchange.id,
          apiKey: form.apiKey,
          secret: form.secret,
          password: form.password,
          testnet: form.testnet,
        }),
      });
      setStatus({ ok: true, msg: "✓ Connected successfully!" });
      setConnected(true);
      onConnect?.(exchange.id);
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  const testBalance = async () => {
    setTesting(true);
    try {
      const res = await apiFetch(`/exchange/balance?exchange=${exchange.id}`);
      const assets = Object.entries(res.total || {})
        .filter(([_, v]) => v > 0)
        .slice(0, 5);
      
      if (assets.length === 0) {
        setBalance("No assets (balance is 0)");
      } else {
        setBalance(assets.map(([k, v]) => `${k}: ${v}`).join(", "));
      }
      setStatus({ ok: true, msg: "Balance fetched successfully" });
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className={`overflow-hidden ${connected ? 'ring-2 ring-green-500' : ''}`}>
      <div className={`h-2 bg-gradient-to-r ${exchange.color}`}></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-3xl">{exchange.logo}</span>
          <div>
            <div className="flex items-center gap-2">
              {exchange.name}
              {connected && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  Connected
                </span>
              )}
            </div>
            <p className="text-sm font-normal text-gray-500">{exchange.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">API Key</label>
            <Input
              type="password"
              placeholder="Enter your API key"
              value={form.apiKey || ""}
              onChange={(e) => handle("apiKey", e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">API Secret</label>
            <Input
              type="password"
              placeholder="Enter your API secret"
              value={form.secret || ""}
              onChange={(e) => handle("secret", e.target.value)}
              required
            />
          </div>
          
          {exchange.fields.includes("password") && (
            <div>
              <label className="text-sm font-medium block mb-1">Passphrase</label>
              <Input
                type="password"
                placeholder="Enter your passphrase"
                value={form.password || ""}
                onChange={(e) => handle("password", e.target.value)}
                required
              />
            </div>
          )}
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.testnet}
              onChange={(e) => handle("testnet", e.target.checked)}
              className="rounded"
            />
            <span>Use Testnet (recommended for testing)</span>
          </label>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Connecting..." : connected ? "Reconnect" : "Connect"}
            </Button>
            {connected && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={testBalance}
                disabled={testing}
              >
                {testing ? "Testing..." : "Test Balance"}
              </Button>
            )}
          </div>
          
          {status && (
            <p className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>
              {status.msg}
            </p>
          )}
          
          {balance && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium text-gray-700">Balance:</p>
              <p className="text-gray-600">{balance}</p>
            </div>
          )}
        </form>
        
        <div className="mt-4 pt-4 border-t flex gap-4 text-xs">
          <a 
            href={exchange.docsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            How to create API keys →
          </a>
          {form.testnet && (
            <a 
              href={exchange.testnetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get testnet account →
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConnectPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [connectedExchanges, setConnectedExchanges] = useState([]);

  const handleConnect = (exchangeId) => {
    if (!connectedExchanges.includes(exchangeId)) {
      setConnectedExchanges([...connectedExchanges, exchangeId]);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect Your Exchange</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Connect your exchange account to start automated trading. 
            We only need trading permissions - never withdrawal access.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-blue-800 flex items-center gap-2">
            🔒 Security First
          </h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• API keys are stored encrypted and never shared</li>
            <li>• Create keys with <strong>trading only</strong> permissions (no withdrawals)</li>
            <li>• Use testnet for testing before going live</li>
            <li>• You can revoke access anytime from your exchange</li>
          </ul>
        </div>

        {/* Exchange Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {EXCHANGES.map((exchange) => (
            <ExchangeCard 
              key={exchange.id} 
              exchange={exchange}
              onConnect={handleConnect}
            />
          ))}
        </div>

        {/* Next Steps */}
        {connectedExchanges.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg text-green-800 mb-2">
                🎉 Exchange Connected!
              </h3>
              <p className="text-green-700 mb-4">
                You&apos;re ready to start trading. Here&apos;s what you can do next:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/backtest">
                  <Button>Create Strategy</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Check our <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link> or <Link href="/support" className="text-blue-600 hover:underline">contact support</Link>.</p>
        </div>
      </div>
    </div>
  );
}
