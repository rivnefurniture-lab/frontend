'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { getCurrentTradingMode, setTradingMode, isCryptoMode } from '@/config/tradingMode';

export default function AdminStrategiesPage() {
  const [mockEnabled, setMockEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<string>('stocks');
  const [togglingMode, setTogglingMode] = useState(false);

  useEffect(() => {
    // Get current mode on client side
    setCurrentMode(getCurrentTradingMode());
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await apiFetch('/backtest/admin/mock-strategies-status');
      setMockEnabled(res.enabled);
    } catch (e) {
      console.error('Failed to fetch status:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMockStrategies = async () => {
    setToggling(true);
    setMessage(null);
    try {
      const res = await apiFetch('/backtest/admin/toggle-mock-strategies', {
        method: 'POST',
        body: { enabled: !mockEnabled },
      });
      setMockEnabled(res.enabled);
      setMessage(res.message);
    } catch (e) {
      setMessage('Failed to toggle mock strategies');
    } finally {
      setToggling(false);
    }
  };

  const handleModeSwitch = (newMode: string) => {
    if (newMode === currentMode) return;
    setTogglingMode(true);
    setTradingMode(newMode);
    // Page will reload automatically
  };

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Strategy Management</h1>
            <p className="text-gray-600 mt-1">Admin controls for strategy display</p>
          </div>
          <Link href="/admin/queue">
            <Button variant="outline" className="btn-secondary">
              Queue Management →
            </Button>
          </Link>
        </div>

        {/* Trading Mode Card - FIRST */}
        <Card className="card-geometric mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Trading Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* One-Click Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
              <div>
                <p className="font-semibold text-gray-900">Current Mode</p>
                <p className="text-sm text-gray-500">
                  One-click switch between crypto and stocks
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 text-sm font-bold ${currentMode === 'stocks' ? 'bg-purple-500 text-white' : 'bg-yellow-500 text-white'}`} style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  {currentMode === 'stocks' ? '📈 STOCKS' : '₿ CRYPTO'}
                </span>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleModeSwitch('crypto')}
                disabled={togglingMode}
                className={`p-5 border-2 transition-all text-left ${currentMode === 'crypto' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-400 hover:bg-yellow-50/50'}`}
                style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">₿</span>
                  <div>
                    <span className="font-bold text-lg block">Crypto Mode</span>
                    {currentMode === 'crypto' && (
                      <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>ACTIVE</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  BTC, ETH, SOL with Binance, Bybit, OKX
                </p>
                {currentMode !== 'crypto' && (
                  <p className="text-xs text-yellow-600 mt-2 font-semibold">Click to switch →</p>
                )}
              </button>
              
              <button 
                onClick={() => handleModeSwitch('stocks')}
                disabled={togglingMode}
                className={`p-5 border-2 transition-all text-left ${currentMode === 'stocks' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50/50'}`}
                style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📈</span>
                  <div>
                    <span className="font-bold text-lg block">Stocks Mode</span>
                    {currentMode === 'stocks' && (
                      <span className="text-xs bg-purple-500 text-white px-2 py-0.5 font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>ACTIVE</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  AAPL, SPY with IB, Alpaca, TD Ameritrade
                </p>
                {currentMode !== 'stocks' && (
                  <p className="text-xs text-purple-600 mt-2 font-semibold">Click to switch →</p>
                )}
              </button>
            </div>

            {togglingMode && (
              <div className="p-4 bg-gray-100 border-2 border-gray-300 text-center" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                <div className="animate-spin w-6 h-6 border-3 border-black border-t-transparent mx-auto mb-2" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}></div>
                <p className="text-sm font-medium">Switching mode...</p>
              </div>
            )}

            <div className="bg-emerald-50 border-2 border-emerald-200 p-3 text-sm" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-emerald-700">
                  <strong>Instant switch!</strong> Click on a mode to switch immediately. The page will reload with the new configuration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mock Strategies Card */}
        <Card className="card-geometric">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mock Strategies Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200" style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
              <div>
                <p className="font-semibold text-gray-900">Show Mock Strategies</p>
                <p className="text-sm text-gray-500">
                  Toggle visibility of 5 demo strategies on the strategies page
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-sm font-bold ${mockEnabled ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-700'}`} style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                  {mockEnabled ? 'VISIBLE' : 'HIDDEN'}
                </span>
                <Button
                  onClick={toggleMockStrategies}
                  disabled={toggling}
                  className={mockEnabled ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
                  style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
                >
                  {toggling ? 'Processing...' : mockEnabled ? 'Hide Strategies' : 'Show Strategies'}
                </Button>
              </div>
            </div>

            {message && (
              <div className="p-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-sm" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                {message}
              </div>
            )}

            <div className="border-t-2 border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Mock Strategies List</h3>
              <div className="space-y-2">
                {[
                  { name: 'MACD Momentum Pro', category: 'Momentum', cagr: 42.5 },
                  { name: 'Scalper Pro V2', category: 'Scalping', cagr: 67.8 },
                  { name: 'Smart Grid Trader', category: 'Grid Trading', cagr: 35.2 },
                  { name: 'Breakout Hunter Elite', category: 'Breakout', cagr: 58.3 },
                  { name: 'Swing Master 3.0', category: 'Swing Trading', cagr: 45.6 },
                ].map((strategy, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border-2 border-gray-100 hover:border-gray-300 transition-all" style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-bold" style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{strategy.name}</p>
                        <p className="text-xs text-gray-500">{strategy.category}</p>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-bold">+{strategy.cagr}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 text-white p-4 text-sm" style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-300">
                  <strong className="text-white">Note:</strong> This setting is stored in runtime memory and will reset to "visible" when the server restarts. For permanent changes, update the SHOW_MOCK_STRATEGIES environment variable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
