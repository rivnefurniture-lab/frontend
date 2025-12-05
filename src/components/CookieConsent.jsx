"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const { language } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay before showing
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    }));
    setShow(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-blue-100 items-center justify-center flex-shrink-0">
            <Cookie className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-semibold text-gray-900">
                {language === "uk" ? "🍪 Ми використовуємо cookies" : "🍪 We use cookies"}
              </h3>
              <button
                onClick={acceptEssential}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {language === "uk"
                ? "Ми використовуємо cookies для покращення вашого досвіду, аналізу трафіку та персоналізації контенту. Натискаючи «Прийняти всі», ви погоджуєтесь з нашою "
                : "We use cookies to improve your experience, analyze traffic, and personalize content. By clicking \"Accept All\", you agree to our "}
              <Link href="/legal#privacy" className="text-blue-600 hover:underline">
                {language === "uk" ? "Політикою конфіденційності" : "Privacy Policy"}
              </Link>
              .
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button onClick={acceptAll} size="sm">
                {language === "uk" ? "Прийняти всі" : "Accept All"}
              </Button>
              <Button onClick={acceptEssential} variant="outline" size="sm">
                {language === "uk" ? "Тільки необхідні" : "Essential Only"}
              </Button>
              <Link href="/legal#cookies">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  {language === "uk" ? "Докладніше" : "Learn More"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

