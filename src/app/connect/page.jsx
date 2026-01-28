"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { getExchanges, isCryptoMode } from "@/config/tradingMode";
import { showToast } from "@/components/Toast";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Shield, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Zap,
  Lock,
  RefreshCw
} from "lucide-react";

// Exchange logo component - uses images from public/logos/exchanges/
const ExchangeLogo = ({ id, size = "md" }) => {
  // Container sizes
  const containerSizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24"
  };
  
  // Custom image sizes per exchange (40% bigger default, coinbase 65%, kucoin 20%)
  const getImageSize = (exchangeId) => {
    switch(exchangeId) {
      case "coinbase":
        return "w-20 h-20"; // 65% bigger
      case "kucoin":
        return "w-14 h-14"; // 20% bigger
      default:
        return "w-16 h-16"; // 40% bigger (default)
    }
  };
  
  // Use PNG files (coinbase is webp)
  const extension = id === "coinbase" ? "webp" : "png";
  const logoPath = `/logos/exchanges/${id}.${extension}`;

  return (
    <div className={`${containerSizes[size]} rounded-2xl overflow-hidden flex items-center justify-center bg-white`}>
      <img 
        src={logoPath} 
        alt={`${id} logo`}
        className={`${getImageSize(id)} object-contain`}
        onError={(e) => {
          // Fallback to text if image fails
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<span class="text-sm font-bold text-gray-600">${id?.slice(0, 2).toUpperCase()}</span>`;
        }}
      />
    </div>
  );
};

export default function ConnectPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  
  // Wizard state
  const [step, setStep] = useState(1); // 1: Select Exchange, 2: Enter Credentials, 3: Confirm
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [connectedExchanges, setConnectedExchanges] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  
  // Form state
  const [form, setForm] = useState({
    apiKey: "",
    secret: "",
    password: "",
    testnet: false,
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const exchanges = getExchanges();
  const SERVER_IP = "62.171.183.32";

  // Translations
  const t = {
    title: language === "uk" ? "Підключення біржі" : "Connect Exchange",
    subtitle: language === "uk" 
      ? "Підключіть вашу біржу для автоматичного аналізу" 
      : "Connect your exchange for automated analysis",
    step1Title: language === "uk" ? "Оберіть біржу" : "Select Exchange",
    step1Subtitle: language === "uk" ? "Виберіть біржу, яку хочете підключити" : "Choose the exchange you want to connect",
    step2Title: language === "uk" ? "Введіть дані" : "Enter Credentials",
    step2Subtitle: language === "uk" ? "Введіть ваші API ключі" : "Enter your API keys",
    step3Title: language === "uk" ? "Підключення" : "Connection",
    step3Subtitle: language === "uk" ? "Перевірте та підтвердіть" : "Review and confirm",
    apiKey: language === "uk" ? "API Ключ" : "API Key",
    apiSecret: language === "uk" ? "API Секрет" : "API Secret",
    passphrase: language === "uk" ? "Пароль/Passphrase" : "Passphrase",
    testnet: language === "uk" ? "Тестове середовище" : "Test Environment",
    testnetDesc: language === "uk" ? "Рекомендовано для початку" : "Recommended for getting started",
    connect: language === "uk" ? "Підключити" : "Connect",
    back: language === "uk" ? "Назад" : "Back",
    next: language === "uk" ? "Далі" : "Next",
    connected: language === "uk" ? "Підключено" : "Connected",
    changeExchange: language === "uk" ? "Змінити біржу" : "Change Exchange",
    securityNote: language === "uk" 
      ? "Ваші ключі зашифровані та ніколи не передаються третім особам" 
      : "Your keys are encrypted and never shared with third parties",
    ipWhitelist: language === "uk" ? "Білий список IP" : "IP Whitelist",
    ipWhitelistDesc: language === "uk" 
      ? "Додайте цю IP адресу до білого списку на біржі для максимальної безпеки" 
      : "Add this IP to your exchange whitelist for maximum security",
    howToCreate: language === "uk" ? "Як створити API ключі" : "How to create API keys",
    testConnection: language === "uk" ? "Тест з'єднання" : "Test Connection",
    connectionSuccess: language === "uk" ? "З'єднання успішне!" : "Connection successful!",
    connectionFailed: language === "uk" ? "Помилка з'єднання" : "Connection failed",
    readOnlyNote: language === "uk" 
      ? "Створюйте ключі тільки з правами на читання (read-only)" 
      : "Create keys with read-only permissions only",
    loginRequired: language === "uk" ? "Потрібна авторизація" : "Login Required",
    loginText: language === "uk" ? "Увійдіть, щоб підключити біржу" : "Sign in to connect your exchange",
    login: language === "uk" ? "Увійти" : "Sign In",
    manageConnection: language === "uk" ? "Керування підключенням" : "Manage Connection",
    disconnect: language === "uk" ? "Відключити" : "Disconnect",
    reconnect: language === "uk" ? "Перепідключити" : "Reconnect",
    popular: language === "uk" ? "Популярні" : "Popular",
    allExchanges: language === "uk" ? "Всі біржі" : "All Exchanges",
    comingSoon: language === "uk" ? "Скоро" : "Coming Soon",
  };

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
      if (Array.isArray(result)) {
        const connected = result.filter(c => c.isConnected || c.isActive).map(c => c.exchange);
        setConnectedExchanges(connected);
      } else if (result?.connections) {
        const connected = result.connections.filter(c => c.isConnected || c.isActive).map(c => c.exchange);
        setConnectedExchanges(connected);
      }
    } catch (e) {
      console.error("Failed to fetch connections:", e);
    } finally {
      setLoadingConnections(false);
    }
  };

  const handleSelectExchange = (exchange) => {
    setSelectedExchange(exchange);
    setForm({ apiKey: "", secret: "", password: "", testnet: false });
    setConnectionStatus(null);
    setStep(2);
  };

  const handleConnect = async () => {
    if (!selectedExchange) return;
    
    setConnecting(true);
    setConnectionStatus(null);
    
    try {
      const payload = {
        exchange: selectedExchange.id,
        apiKey: form.apiKey,
        secret: form.secret,
        testnet: form.testnet,
      };
      
      if (selectedExchange.fields?.includes("password") && form.password) {
        payload.password = form.password;
      }

      const res = await apiFetch("/exchange/connect", {
        method: "POST",
        body: payload,
      });

      if (res.success || res.connected) {
        setConnectionStatus({ success: true, message: t.connectionSuccess });
        setConnectedExchanges([...connectedExchanges, selectedExchange.id]);
        showToast(t.connectionSuccess, "success");
        setStep(3);
      } else {
        throw new Error(res.error || res.message || "Connection failed");
      }
    } catch (e) {
      setConnectionStatus({ success: false, message: e.message });
      showToast(e.message, "error");
    } finally {
      setConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await apiFetch(`/exchange/balance?exchange=${selectedExchange.id}`);
      if (res && !res.error) {
        setConnectionStatus({ success: true, message: t.connectionSuccess });
        showToast(t.connectionSuccess, "success");
      } else {
        throw new Error(res.error || "Test failed");
      }
    } catch (e) {
      setConnectionStatus({ success: false, message: e.message });
      showToast(e.message, "error");
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedExchange) return;
    
    try {
      await apiFetch("/exchange/disconnect", {
        method: "POST",
        body: { exchange: selectedExchange.id },
      });
      setConnectedExchanges(connectedExchanges.filter(id => id !== selectedExchange.id));
      setSelectedExchange(null);
      setStep(1);
      showToast(language === "uk" ? "Біржу відключено" : "Exchange disconnected", "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auth guard
  if (!authLoading && !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.loginRequired}</h2>
            <p className="text-gray-600 mb-6">{t.loginText}</p>
            <Link href="/auth">
              <Button className="w-full h-12 text-lg">{t.login}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || loadingConnections) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="text-gray-500">{language === "uk" ? "Завантаження..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  // Check if user has a connected exchange already
  const hasConnectedExchange = connectedExchanges.length > 0;
  const connectedExchangeData = hasConnectedExchange 
    ? exchanges.find(e => connectedExchanges.includes(e.id))
    : null;

  return (
    <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Connected Exchange Card */}
        {hasConnectedExchange && connectedExchangeData && step === 1 && (
          <div className="mb-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border-2 border-emerald-200">
            <div className="flex items-center gap-4 mb-4">
              <ExchangeLogo id={connectedExchangeData.id} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{connectedExchangeData.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.connected}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{connectedExchangeData.description?.[language] || connectedExchangeData.description?.en}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedExchange(connectedExchangeData);
                  setStep(3);
                }}
                className="flex-1"
              >
                {t.manageConnection}
              </Button>
            </div>
          </div>
        )}

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all ${
                    step > s ? 'bg-black' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <span className="text-sm text-gray-500">
              {step === 1 && t.step1Title}
              {step === 2 && t.step2Title}
              {step === 3 && t.step3Title}
            </span>
          </div>
        </div>

        {/* Step 1: Select Exchange */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Popular Exchanges */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t.popular}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                {exchanges.filter(e => !e.comingSoon).slice(0, 6).map((exchange) => {
                  const isConnected = connectedExchanges.includes(exchange.id);
                  return (
                    <button
                      key={exchange.id}
                      onClick={() => handleSelectExchange(exchange)}
                      className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${
                        isConnected 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-black hover:shadow-lg bg-white'
                      }`}
                    >
                      {isConnected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                      )}
                      <ExchangeLogo id={exchange.id} size="xl" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coming Soon */}
            {exchanges.filter(e => e.comingSoon).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t.comingSoon}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                  {exchanges.filter(e => e.comingSoon).map((exchange) => (
                    <div
                      key={exchange.id}
                      className="relative p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 opacity-60 flex items-center justify-center"
                    >
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                          {t.comingSoon}
                        </span>
                      </div>
                      <ExchangeLogo id={exchange.id} size="xl" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Enter Credentials */}
        {step === 2 && selectedExchange && (
          <div className="space-y-6">
            {/* Selected Exchange Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <ExchangeLogo id={selectedExchange.id} size="lg" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{selectedExchange.name}</h3>
                <p className="text-sm text-gray-500">{selectedExchange.description?.[language] || selectedExchange.description?.en}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                {t.changeExchange}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-900 text-white p-5 rounded-2xl">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-1">{language === "uk" ? "Безпека" : "Security"}</h4>
                  <p className="text-sm text-gray-300">{t.securityNote}</p>
                  <p className="text-sm text-gray-400 mt-2">{t.readOnlyNote}</p>
                </div>
              </div>
            </div>

            {/* IP Whitelist */}
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-1">{t.ipWhitelist}</h4>
                  <p className="text-sm text-blue-700 mb-3">{t.ipWhitelistDesc}</p>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-2 bg-white rounded-lg font-mono text-lg border border-blue-200">
                      {SERVER_IP}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyIP}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials Form */}
            <div className="space-y-4">
              {/* API Key */}
              <div>
                <label className="block text-sm font-medium mb-2">{t.apiKey}</label>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={form.apiKey}
                    onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="h-12 pr-12 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* API Secret */}
              <div>
                <label className="block text-sm font-medium mb-2">{t.apiSecret}</label>
                <div className="relative">
                  <Input
                    type={showSecret ? "text" : "password"}
                    value={form.secret}
                    onChange={(e) => setForm({ ...form, secret: e.target.value })}
                    placeholder="Enter your API secret"
                    className="h-12 pr-12 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Passphrase (if required) */}
              {selectedExchange.fields?.includes("password") && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t.passphrase}</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter your passphrase"
                      className="h-12 pr-12 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Testnet Toggle */}
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={form.testnet}
                  onChange={(e) => setForm({ ...form, testnet: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <span className="font-medium">{t.testnet}</span>
                  <p className="text-sm text-gray-500">{t.testnetDesc}</p>
                </div>
              </label>

              {/* Help Link */}
              {selectedExchange.apiDocsUrl && (
                <a 
                  href={selectedExchange.apiDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t.howToCreate}
                </a>
              )}
            </div>

            {/* Error/Success Message */}
            {connectionStatus && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                connectionStatus.success 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {connectionStatus.success 
                  ? <CheckCircle2 className="w-5 h-5" /> 
                  : <AlertCircle className="w-5 h-5" />
                }
                <span>{connectionStatus.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="h-12"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
              <Button 
                onClick={handleConnect}
                disabled={!form.apiKey || !form.secret || connecting}
                className="flex-1 h-12"
              >
                {connecting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                {t.connect}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success / Manage */}
        {step === 3 && selectedExchange && (
          <div className="space-y-6">
            {/* Success State */}
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <ExchangeLogo id={selectedExchange.id} size="xl" />
              <h2 className="text-2xl font-bold mt-4 mb-2">{selectedExchange.name} {t.connected}!</h2>
              <p className="text-gray-600">
                {language === "uk" 
                  ? "Ваша біржа успішно підключена та готова до аналізу" 
                  : "Your exchange is successfully connected and ready for analysis"
                }
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/backtest" className="block">
                <Button variant="outline" className="w-full h-14">
                  {language === "uk" ? "Створити модель" : "Create Model"}
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button className="w-full h-14">
                  {language === "uk" ? "До панелі" : "Go to Dashboard"}
                </Button>
              </Link>
            </div>

            {/* Test Connection */}
            <div className="border-t pt-6">
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={testing}
                className="w-full h-12"
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {t.testConnection}
              </Button>
            </div>

            {/* Disconnect */}
            <div className="border-t pt-6">
              <Button 
                variant="ghost" 
                onClick={handleDisconnect}
                className="w-full h-12 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                {t.disconnect}
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
