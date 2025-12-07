"use client";

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="container py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}

