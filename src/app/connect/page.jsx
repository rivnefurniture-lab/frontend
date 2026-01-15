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

const DATA_SOURCES = [
  {
    id: "binance",
    name: "Binance",
    icon: <svg className="w-6 h-6 text-yellow-500" viewBox="0 0 126 126" fill="currentColor"><path d="M63 0L78.75 25.2H47.25L63 0Z"/><path d="M63 126L47.25 100.8H78.75L63 126Z"/><path d="M31.5 37.8L0 63L31.5 88.2V63V37.8Z"/><path d="M94.5 37.8V63V88.2L126 63L94.5 37.8Z"/><path d="M31.5 63L63 37.8L94.5 63L63 88.2L31.5 63Z"/></svg>,
    color: "from-yellow-400 to-yellow-600",
    description: { en: "Market data provider", uk: "Постачальник ринкових даних" },
    fields: ["apiKey", "secret"],
    testnetUrl: "https://testnet.binance.vision/",
    docsUrl: "https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
  },
  {
    id: "bybit",
    name: "Bybit",
    icon: <svg className="w-6 h-6 text-orange-500" viewBox="0 0 32 32" fill="currentColor"><path d="M16 2L2 9v7l14 7 14-7V9L16 2zm0 4l9 4.5-9 4.5-9-4.5L16 6z"/></svg>,
    color: "from-orange-400 to-orange-600",
    description: { en: "Real-time data feed", uk: "Потік даних в реальному часі" },
    fields: ["apiKey", "secret"],
    testnetUrl: "https://testnet.bybit.com/",
    docsUrl: "https://learn.bybit.com/bybit-guide/how-to-create-bybit-api-key/"
  },
  {
    id: "okx",
    name: "OKX",
    icon: <div className="text-xl font-black text-gray-700">OKX</div>,
    color: "from-gray-700 to-gray-900",
    description: { en: "Advanced data platform", uk: "Просунута платформа даних" },
    fields: ["apiKey", "secret", "password"],
    testnetUrl: "https://www.okx.com/docs-v5/en/",
    docsUrl: "https://www.okx.com/support/hc/en-us/articles/360048917891"
  },
  {
    id: "kraken",
    name: "Kraken",
    icon: <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/></svg>,
    color: "from-gray-600 to-gray-800",
    description: { en: "Reliable US data source", uk: "Надійне джерело даних США" },
    fields: ["apiKey", "secret"],
    testnetUrl: "https://docs.kraken.com/rest/",
    docsUrl: "https://support.kraken.com/hc/en-us/articles/360000919966"
  },
  {
    id: "kucoin",
    name: "KuCoin",
    icon: <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    color: "from-green-400 to-emerald-600",
    description: { en: "Comprehensive market data", uk: "Комплексні ринкові дані" },
    fields: ["apiKey", "secret", "password"],
    testnetUrl: "https://www.kucoin.com/docs/",
    docsUrl: "https://www.kucoin.com/support/360015102174"
  },
  {
    id: "coinbase",
    name: "Coinbase",
    icon: <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path fill="white" d="M12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>,
    color: "from-gray-700 to-gray-900",
    description: { en: "Leading data provider", uk: "Провідний постачальник даних" },
    fields: ["apiKey", "secret"],
    testnetUrl: "https://docs.cloud.coinbase.com/",
    docsUrl: "https://help.coinbase.com/en/exchange/managing-my-account/how-to-create-an-api-key"
  }
];

function DataSourceCard({ exchange, onConnect, onDisconnect, isConnected, t, language }) {
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
    <div className={`bg-white border-2 overflow-hidden ${isConnected ? 'border-emerald-500' : 'border-gray-100 hover:border-black'} transition-all`} style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
      <div className={`h-2 bg-gradient-to-r ${exchange.color}`}></div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${exchange.color} flex items-center justify-center flex-shrink-0`} style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
            {exchange.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">{exchange.name}</span>
              {isConnected && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold flex items-center gap-1" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.connected}
                </span>
              )}
            </div>
            <p className="text-sm font-normal text-gray-500 truncate">{exchange.description[language]}</p>
          </div>
        </div>
        {/* Connected state - no form, just actions */}
        {isConnected && !showForm ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-700 text-sm font-medium">
                  {t.exchangeConnectedInfo}
                </p>
                <p className="text-green-600 text-xs mt-1">{t.keysSecure}</p>
              </div>
            </div>
            
            {balance && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium text-gray-700">{t.balance}:</p>
                <p className="text-gray-600">{balance}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={testBalance}
                disabled={testing}
                className="flex-1 px-4 py-2.5 bg-emerald-500 text-white font-bold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
              >
                {testing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {testing ? t.testing : t.testBalance}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(true)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-black hover:text-black transition-all"
                style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
              >
                {t.updateKeys}
              </button>
              <button 
                type="button" 
                onClick={disconnect}
                disabled={disconnecting}
                className="px-4 py-2.5 bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
              >
                {disconnecting ? "..." : t.disconnect}
              </button>
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
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {loading ? t.connecting : isConnected ? t.updateAndSave : t.connect}
              </button>
              {isConnected && (
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-black hover:text-black transition-all"
                  style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
                >
                  {t.cancel}
                </button>
              )}
          </div>
            
          {status && (
              <p className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>
              {status.msg}
            </p>
          )}
        </form>
        )}
        
        <div className="mt-4 pt-4 border-t-2 border-gray-100 flex gap-4 text-xs">
          <a 
            href={exchange.docsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black font-bold hover:underline"
          >
            {t.howToCreate} →
          </a>
          {!isConnected && (
            <a 
              href={exchange.testnetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black font-bold hover:underline"
            >
              {t.getTestnet} →
            </a>
          )}
        </div>
      </div>
    </div>
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
    title: language === "uk" ? "Підключення джерела даних" : "Connect Data Source",
    subtitle: language === "uk" 
      ? "Підключіть джерело даних для автоматичного аналізу. Нам потрібні лише права на читання - ніколи на запис." 
      : "Connect your data source to start automated analysis. We only need read-only permissions - never write access.",
    securityTitle: language === "uk" ? "🔒 Безпека насамперед" : "🔒 Security First",
    securityItem1: language === "uk" ? "API ключі зберігаються зашифрованими і ніколи не передаються" : "API keys are stored encrypted and never shared",
    securityItem2: language === "uk" ? "Створюйте ключі лише з правами на читання" : "Create keys with read-only permissions",
    securityItem3: language === "uk" ? "Використовуйте тестове середовище для тестування перед запуском" : "Use test environment for testing before going live",
    securityItem4: language === "uk" ? "Ви можете відкликати доступ у будь-який час від провайдера" : "You can revoke access anytime from your provider",
    ipTitle: language === "uk" ? "🌐 Білий список IP (Рекомендовано)" : "🌐 IP Whitelisting (Recommended)",
    ipText: language === "uk" 
      ? "Для максимальної безпеки додайте IP нашого сервера у білий список у провайдера:" 
      : "For maximum security, whitelist our server IP on your data provider:",
    ipNote: language === "uk" 
      ? "Це гарантує, що тільки наш сервер може отримувати дані з вашими API ключами." 
      : "This ensures only our server can access data with your API keys.",
    copy: language === "uk" ? "Копіювати" : "Copy",
    copied: language === "uk" ? "Скопійовано!" : "Copied!",
    loginRequired: language === "uk" ? "Потрібна авторизація" : "Login Required",
    loginText: language === "uk" 
      ? "Щоб підключити джерело даних, потрібно увійти в обліковий запис." 
      : "You need to be logged in to connect your data source.",
    login: language === "uk" ? "Увійти / Зареєструватись" : "Login / Sign Up",
    loading: language === "uk" ? "Завантаження..." : "Loading...",
    connected: language === "uk" ? "Підключено" : "Connected",
    apiKey: language === "uk" ? "API Ключ" : "API Key",
    apiSecret: language === "uk" ? "API Секрет" : "API Secret",
    passphrase: language === "uk" ? "Пароль" : "Passphrase",
    enterApiKey: language === "uk" ? "Введіть API ключ" : "Enter your API key",
    enterApiSecret: language === "uk" ? "Введіть API секрет" : "Enter your API secret",
    enterPassphrase: language === "uk" ? "Введіть пароль" : "Enter your passphrase",
    useTestnet: language === "uk" ? "Використовувати тестове середовище (рекомендовано для тестування)" : "Use Test Environment (recommended for testing)",
    connect: language === "uk" ? "Підключити" : "Connect",
    reconnect: language === "uk" ? "Перепідключити" : "Reconnect",
    connecting: language === "uk" ? "Підключення..." : "Connecting...",
    testBalance: language === "uk" ? "Перевірити підключення" : "Test Connection",
    testing: language === "uk" ? "Перевірка..." : "Testing...",
    balance: language === "uk" ? "Дані" : "Data",
    howToCreate: language === "uk" ? "Як створити API ключі" : "How to create API keys",
    getTestnet: language === "uk" ? "Отримати тестовий акаунт" : "Get test account",
    connectedSuccess: language === "uk" ? "Підключено успішно!" : "Connected successfully!",
    connectionFailed: language === "uk" ? "Помилка підключення" : "Connection failed",
    loginFirst: language === "uk" ? "Спочатку увійдіть, щоб підключити джерело даних" : "Please login first to connect your data source",
    invalidCredentials: language === "uk" ? "Невірний API ключ або секрет. Перевірте дані." : "Invalid API key or secret. Please check your credentials.",
    networkError: language === "uk" ? "Помилка мережі. Перевірте з'єднання і спробуйте ще раз." : "Network error. Please check your connection and try again.",
    noAssets: language === "uk" ? "Дані недоступні" : "No data available",
    balanceFetched: language === "uk" ? "Підключення успішне" : "Connection successful",
    exchangeConnected: language === "uk" ? "Джерело даних підключено!" : "Data Source Connected!",
    whatNext: language === "uk" 
      ? "Ви готові почати аналіз. Ось що можна зробити далі:" 
      : "You're ready to start analyzing. Here's what you can do next:",
    createStrategy: language === "uk" ? "Створити модель" : "Create Model",
    goToDashboard: language === "uk" ? "До панелі управління" : "Go to Dashboard",
    needHelp: language === "uk" ? "Потрібна допомога? Перегляньте" : "Need help? Check our",
    faq: language === "uk" ? "FAQ" : "FAQ",
    or: language === "uk" ? "або" : "or",
    contactSupport: language === "uk" ? "зв'яжіться з підтримкою" : "contact support",
    disconnect: language === "uk" ? "Відключити" : "Disconnect",
    disconnected: language === "uk" ? "Джерело відключено" : "Data source disconnected",
    updateKeys: language === "uk" ? "Оновити ключі" : "Update Keys",
    updateAndSave: language === "uk" ? "Оновити та зберегти" : "Update & Save",
    cancel: language === "uk" ? "Скасувати" : "Cancel",
    exchangeConnectedInfo: language === "uk" ? "Джерело даних підключено та готове до аналізу" : "Data source is connected and ready for analysis",
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
          <div className="bg-white border-2 border-gray-100 p-8" style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              <div className="w-20 h-20 mx-auto mb-4 bg-black flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">{t.loginRequired}</h2>
              <p className="text-gray-600 mb-6">{t.loginText}</p>
              <Link href="/auth">
                <Button className="w-full btn-primary">{t.login}</Button>
              </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="container py-10 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}></div>
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

        <div className="bg-gray-900 text-white p-5 mb-8" style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
          <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t.securityTitle.replace("🔒 ", "")}
          </h3>
          <ul className="text-sm text-gray-300 space-y-1.5">
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> {t.securityItem1}</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> {t.securityItem2}</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> {t.securityItem3}</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> {t.securityItem4}</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-gray-100 mb-8" style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{t.ipTitle.replace("🌐 ", "")}</h3>
                <p className="text-sm text-gray-600">{t.ipText}</p>
              </div>
            </div>
            
            <div className="mt-5 bg-gray-50 p-4 border-2 border-gray-200" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    {language === "uk" ? "IP-адреса сервера" : "Server IP Address"}
                  </div>
                  <code className="text-2xl font-mono font-bold text-black tracking-wide">
                    46.224.99.27
                  </code>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("46.224.99.27");
                    alert(t.copied);
                  }}
                  className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold transition-all flex items-center gap-2"
                  style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t.copy}
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-start gap-2 text-sm text-gray-600 bg-gray-100 p-3" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t.ipNote}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loadingConnections ? (
            <div className="col-span-2 text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}></div>
              <p className="mt-4 text-gray-600">{t.loading}</p>
            </div>
          ) : (
            DATA_SOURCES.map((exchange) => (
              <DataSourceCard 
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
          <div className="bg-emerald-500 text-white p-6" style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white flex items-center justify-center" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">{t.exchangeConnected}</h3>
              </div>
              <p className="text-emerald-100 mb-4">{t.whatNext}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/backtest">
                  <button className="px-5 py-2.5 bg-white text-emerald-600 font-bold hover:bg-gray-100 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>{t.createStrategy}</button>
                </Link>
                <Link href="/dashboard">
                  <button className="px-5 py-2.5 bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>{t.goToDashboard}</button>
                </Link>
              </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>{t.needHelp} <Link href="/faq" className="text-black font-medium hover:underline">{t.faq}</Link> {t.or} <Link href="/support" className="text-black font-medium hover:underline">{t.contactSupport}</Link>.</p>
        </div>
      </div>
    </div>
  );
}
