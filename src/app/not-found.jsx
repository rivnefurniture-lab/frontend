"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

export default function NotFound() {
  const { language } = useLanguage();
  
  const t = {
    title: language === "uk" ? "Сторінку не знайдено" : "Page Not Found",
    subtitle: language === "uk" 
      ? "Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена."
      : "Sorry, the page you're looking for doesn't exist or has been moved.",
    home: language === "uk" ? "Повернутись на головну" : "Back to Home",
    strategies: language === "uk" ? "Переглянути стратегії" : "Browse Strategies",
  };
  
  return (
    <div className="container py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">{t.title}</h2>
        <p className="text-gray-600 mb-8">{t.subtitle}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>{t.home}</Button>
          </Link>
          <Link href="/strategies">
            <Button variant="outline">{t.strategies}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

