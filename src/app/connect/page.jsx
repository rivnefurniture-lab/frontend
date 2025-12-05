"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const EXCHANGES = [
  {
    id: "binance",
    name: "Binance",
    logo: "🟡",
    color: "from-yellow-400 to-yellow-600",
    description: { en: "World's largest crypto exchange", uk: "Найбільша криптобіржа у світі" },
    fields: ["apiKey", "secret"],
    testnetUrl: "https://testnet.binance.vision/",
    docsUrl: "https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
  },
  {
    id: "bybit",
    name: "Bybit",
    logo: "🔶",
    color: "from-orange-400 to-orange-600",
    description: { en: "Fast derivatives exchange", uk: "Швидка біржа деривативів" },
    fields: ["apiKey", "secret"],
    testnetUrl: "https://testnet.bybit.com/",
    docsUrl: "https://learn.bybit.com/bybit-guide/how-to-create-bybit-api-key/"
  },
  {
    id: "okx",
    name: "OKX",
    logo: "⚫",
    color: "from-gray-700 to-gray-900",
    description: { en: "Advanced trading platform", uk: "Просунута торгова платформа" },
    fields: ["apiKey", "secret", "password"],
    testnetUrl: "https://www.okx.com/docs-v5/en/",
    docsUrl: "https://www.okx.com/support/hc/en-us/articles/360048917891"
  }
];

function ExchangeCard({ exchange, onConnect, onDisconnect, isConnected, t, language }) {
  const [form, setForm] = useState({ testnet: false }); // Default: REAL money
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [status, setStatus] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showForm, setShowForm] = useState(!isConnected);
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Update showForm when isConnected changes
  useEffect(() => {
    setShowForm(!isConnected);
  }, [isConnected]);

  const handle = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      const payload = {
        exchange: exchange.id,
        apiKey: form.apiKey,
        secret: form.secret,
        testnet: form.testnet,
      };
      
      if (exchange.fields.includes("password") && form.password) {
        payload.password = form.password;
      }
      
      const result = await apiFetch("/exchange/connect", {
        method: "POST",
        body: payload,
      });
      
      if (result?.ok) {
        setStatus({ ok: true, msg: t.connectedSuccess });
        setShowForm(false);
        setForm({ testnet: false }); // Clear sensitive data, keep real mode
        onConnect?.(exchange.id);
      } else {
        throw new Error(result?.message || t.connectionFailed);
      }
    } catch (e) {
      console.error("Exchange connection error:", e);
      let errorMsg = e.message || t.connectionFailed;
      
      if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
        errorMsg = t.loginFirst;
      } else if (errorMsg.includes("Invalid") || errorMsg.includes("authentication")) {
        errorMsg = t.invalidCredentials;
      } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
        errorMsg = t.networkError;
      }
      
      setStatus({ ok: false, msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setDisconnecting(true);
    try {
      await apiFetch(`/exchange/disconnect/${exchange.id}`, {
        method: "POST",
      });
      setShowForm(true);
      setBalance(null);
      setStatus({ ok: true, msg: t.disconnected });
      onDisconnect?.(exchange.id);
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    } finally {
      setDisconnecting(false);
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
        setBalance(t.noAssets);
      } else {
        setBalance(assets.map(([k, v]) => `${k}: ${v}`).join(", "));
      }
      setStatus({ ok: true, msg: t.balanceFetched });
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className={`overflow-hidden ${isConnected ? 'ring-2 ring-green-500' : ''}`}>
      <div className={`h-2 bg-gradient-to-r ${exchange.color}`}></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-3xl">{exchange.logo}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {exchange.name}
              {isConnected && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  ✓ {t.connected}
                </span>
              )}
            </div>
            <p className="text-sm font-normal text-gray-500">{exchange.description[language]}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Connected state - no form, just actions */}
        {isConnected && !showForm ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm font-medium">
                ✓ {t.exchangeConnectedInfo}
              </p>
              <p className="text-green-600 text-xs mt-1">{t.keysSecure}</p>
            </div>
            
            {balance && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium text-gray-700">{t.balance}:</p>
                <p className="text-gray-600">{balance}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                onClick={testBalance}
                disabled={testing}
                className="flex-1"
              >
                {testing ? t.testing : t.testBalance}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowForm(true)}
              >
                {t.updateKeys}
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={disconnect}
                disabled={disconnecting}
              >
                {disconnecting ? "..." : t.disconnect}
              </Button>
            </div>
            
            {status && (
              <p className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>
                {status.msg}
              </p>
            )}
          </div>
        ) : (
          /* Form to connect/update */
          <form onSubmit={submit} className="space-y-4">
            {isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                {t.updateKeysInfo}
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium block mb-1">{t.apiKey}</label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder={t.enterApiKey}
                  value={form.apiKey || ""}
                  onChange={(e) => handle("apiKey", e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">{t.apiSecret}</label>
              <div className="relative">
                <Input
                  type={showSecret ? "text" : "password"}
                  placeholder={t.enterApiSecret}
                  value={form.secret || ""}
                  onChange={(e) => handle("secret", e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            {exchange.fields.includes("password") && (
              <div>
                <label className="text-sm font-medium block mb-1">{t.passphrase}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.enterPassphrase}
                    value={form.password || ""}
                    onChange={(e) => handle("password", e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            )}
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.testnet}
                onChange={(e) => handle("testnet", e.target.checked)}
                className="rounded"
              />
              <span>{t.useTestnet}</span>
            </label>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? t.connecting : isConnected ? t.updateAndSave : t.connect}
              </Button>
              {isConnected && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  {t.cancel}
                </Button>
              )}
            </div>
            
            {status && (
              <p className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>
                {status.msg}
              </p>
            )}
          </form>
        )}
        
        <div className="mt-4 pt-4 border-t flex gap-4 text-xs">
          <a 
            href={exchange.docsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t.howToCreate} →
          </a>
          {!isConnected && (
            <a 
              href={exchange.testnetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {t.getTestnet} →
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConnectPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [connectedExchanges, setConnectedExchanges] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  // Fetch existing connections on mount
  useEffect(() => {
    if (user) {
      fetchConnectedExchanges();
    } else {
      setLoadingConnections(false);
    }
  }, [user]);

  const fetchConnectedExchanges = async () => {
    try {
      const result = await apiFetch("/exchange/connections");
      // Result is an array of connections directly
      if (Array.isArray(result)) {
        const connected = result
          .filter(c => c.isConnected || c.isActive)
          .map(c => c.exchange);
        setConnectedExchanges(connected);
      } else if (result?.connections) {
        // Fallback for wrapped response
        const connected = result.connections
          .filter(c => c.isConnected || c.isActive)
          .map(c => c.exchange);
        setConnectedExchanges(connected);
      }
    } catch (e) {
      console.error("Failed to fetch connections:", e);
    } finally {
      setLoadingConnections(false);
    }
  };

  const t = {
    title: language === "uk" ? "Підключення біржі" : "Connect Your Exchange",
    subtitle: language === "uk" 
      ? "Підключіть свій обліковий запис біржі для автоматичної торгівлі. Нам потрібні лише права на торгівлю - ніколи на виведення." 
      : "Connect your exchange account to start automated trading. We only need trading permissions - never withdrawal access.",
    securityTitle: language === "uk" ? "🔒 Безпека насамперед" : "🔒 Security First",
    securityItem1: language === "uk" ? "API ключі зберігаються зашифрованими і ніколи не передаються" : "API keys are stored encrypted and never shared",
    securityItem2: language === "uk" ? "Створюйте ключі лише з правами на торгівлю (без виведення)" : "Create keys with trading only permissions (no withdrawals)",
    securityItem3: language === "uk" ? "Використовуйте тестнет для тестування перед запуском" : "Use testnet for testing before going live",
    securityItem4: language === "uk" ? "Ви можете відкликати доступ у будь-який час з біржі" : "You can revoke access anytime from your exchange",
    ipTitle: language === "uk" ? "🌐 Білий список IP (Рекомендовано)" : "🌐 IP Whitelisting (Recommended)",
    ipText: language === "uk" 
      ? "Для максимальної безпеки додайте IP нашого торгового сервера у білий список на біржі:" 
      : "For maximum security, whitelist our trading server IP on your exchange:",
    ipNote: language === "uk" 
      ? "Це гарантує, що тільки наш сервер може виконувати угоди з вашими API ключами." 
      : "This ensures only our server can execute trades with your API keys.",
    copy: language === "uk" ? "Копіювати" : "Copy",
    copied: language === "uk" ? "Скопійовано!" : "Copied!",
    loginRequired: language === "uk" ? "Потрібна авторизація" : "Login Required",
    loginText: language === "uk" 
      ? "Щоб підключити біржу, потрібно увійти в обліковий запис." 
      : "You need to be logged in to connect your exchange account.",
    login: language === "uk" ? "Увійти / Зареєструватись" : "Login / Sign Up",
    loading: language === "uk" ? "Завантаження..." : "Loading...",
    connected: language === "uk" ? "Підключено" : "Connected",
    apiKey: language === "uk" ? "API Ключ" : "API Key",
    apiSecret: language === "uk" ? "API Секрет" : "API Secret",
    passphrase: language === "uk" ? "Пароль" : "Passphrase",
    enterApiKey: language === "uk" ? "Введіть API ключ" : "Enter your API key",
    enterApiSecret: language === "uk" ? "Введіть API секрет" : "Enter your API secret",
    enterPassphrase: language === "uk" ? "Введіть пароль" : "Enter your passphrase",
    useTestnet: language === "uk" ? "Використовувати Testnet (рекомендовано для тестування)" : "Use Testnet (recommended for testing)",
    connect: language === "uk" ? "Підключити" : "Connect",
    reconnect: language === "uk" ? "Перепідключити" : "Reconnect",
    connecting: language === "uk" ? "Підключення..." : "Connecting...",
    testBalance: language === "uk" ? "Перевірити баланс" : "Test Balance",
    testing: language === "uk" ? "Перевірка..." : "Testing...",
    balance: language === "uk" ? "Баланс" : "Balance",
    howToCreate: language === "uk" ? "Як створити API ключі" : "How to create API keys",
    getTestnet: language === "uk" ? "Отримати testnet акаунт" : "Get testnet account",
    connectedSuccess: language === "uk" ? "✓ Підключено успішно!" : "✓ Connected successfully!",
    connectionFailed: language === "uk" ? "Помилка підключення" : "Connection failed",
    loginFirst: language === "uk" ? "Спочатку увійдіть, щоб підключити біржу" : "Please login first to connect your exchange",
    invalidCredentials: language === "uk" ? "Невірний API ключ або секрет. Перевірте дані." : "Invalid API key or secret. Please check your credentials.",
    networkError: language === "uk" ? "Помилка мережі. Перевірте з'єднання і спробуйте ще раз." : "Network error. Please check your connection and try again.",
    noAssets: language === "uk" ? "Немає активів (баланс 0)" : "No assets (balance is 0)",
    balanceFetched: language === "uk" ? "Баланс отримано успішно" : "Balance fetched successfully",
    exchangeConnected: language === "uk" ? "🎉 Біржу підключено!" : "🎉 Exchange Connected!",
    whatNext: language === "uk" 
      ? "Ви готові почати торгувати. Ось що можна зробити далі:" 
      : "You're ready to start trading. Here's what you can do next:",
    createStrategy: language === "uk" ? "Створити стратегію" : "Create Strategy",
    goToDashboard: language === "uk" ? "До панелі управління" : "Go to Dashboard",
    needHelp: language === "uk" ? "Потрібна допомога? Перегляньте" : "Need help? Check our",
    faq: language === "uk" ? "FAQ" : "FAQ",
    or: language === "uk" ? "або" : "or",
    contactSupport: language === "uk" ? "зв'яжіться з підтримкою" : "contact support",
    disconnect: language === "uk" ? "Відключити" : "Disconnect",
    disconnected: language === "uk" ? "Біржу відключено" : "Exchange disconnected",
    updateKeys: language === "uk" ? "Оновити ключі" : "Update Keys",
    updateAndSave: language === "uk" ? "Оновити та зберегти" : "Update & Save",
    cancel: language === "uk" ? "Скасувати" : "Cancel",
    exchangeConnectedInfo: language === "uk" ? "Ваш обліковий запис біржі підключено та готовий до торгівлі" : "Your exchange account is connected and ready to trade",
    keysSecure: language === "uk" ? "API ключі зберігаються зашифрованими" : "API keys are stored encrypted",
    updateKeysInfo: language === "uk" ? "Введіть нові API ключі для оновлення підключення" : "Enter new API keys to update the connection",
  };

  const handleConnect = (exchangeId) => {
    if (!connectedExchanges.includes(exchangeId)) {
      setConnectedExchanges([...connectedExchanges, exchangeId]);
    }
  };

  const handleDisconnect = (exchangeId) => {
    setConnectedExchanges(connectedExchanges.filter(id => id !== exchangeId));
  };

  if (!authLoading && !user) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold mb-2">{t.loginRequired}</h2>
              <p className="text-gray-600 mb-6">{t.loginText}</p>
              <Link href="/auth">
                <Button className="w-full">{t.login}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="container py-10 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-blue-800 flex items-center gap-2">{t.securityTitle}</h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• {t.securityItem1}</li>
            <li>• {t.securityItem2}</li>
            <li>• {t.securityItem3}</li>
            <li>• {t.securityItem4}</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-amber-800 flex items-center gap-2">{t.ipTitle}</h3>
          <p className="mt-2 text-sm text-amber-700">{t.ipText}</p>
          <div className="mt-3 flex items-center gap-3">
            <code className="bg-white px-4 py-2 rounded border border-amber-300 font-mono text-lg">
              46.224.99.27
            </code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText("46.224.99.27");
                alert(t.copied);
              }}
              className="text-sm text-amber-700 hover:text-amber-800 underline"
            >
              {t.copy}
            </button>
          </div>
          <p className="mt-3 text-xs text-amber-600">{t.ipNote}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {loadingConnections ? (
            <div className="col-span-2 text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">{t.loading}</p>
            </div>
          ) : (
            EXCHANGES.map((exchange) => (
              <ExchangeCard 
                key={exchange.id} 
                exchange={exchange}
                isConnected={connectedExchanges.includes(exchange.id)}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                t={t}
                language={language}
              />
            ))
          )}
        </div>

        {connectedExchanges.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg text-green-800 mb-2">{t.exchangeConnected}</h3>
              <p className="text-green-700 mb-4">{t.whatNext}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/backtest">
                  <Button>{t.createStrategy}</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">{t.goToDashboard}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>{t.needHelp} <Link href="/faq" className="text-blue-600 hover:underline">{t.faq}</Link> {t.or} <Link href="/support" className="text-blue-600 hover:underline">{t.contactSupport}</Link>.</p>
        </div>
      </div>
    </div>
  );
}
