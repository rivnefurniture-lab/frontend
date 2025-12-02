"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugPage() {
  const [checks, setChecks] = useState<Record<string, { status: string; value?: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const results: Record<string, { status: string; value?: string }> = {};

    // Check Supabase URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    results.supabaseUrl = {
      status: supabaseUrl && supabaseUrl.includes('supabase.co') ? '✅' : '❌',
      value: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET'
    };

    // Check Supabase Key
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    results.supabaseKey = {
      status: supabaseKey && supabaseKey.length > 20 ? '✅' : '❌',
      value: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET'
    };

    // Check API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    results.apiUrl = {
      status: apiUrl ? '✅' : '⚠️',
      value: apiUrl || 'http://localhost:8080 (default)'
    };

    // Test Supabase connection
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
          headers: {
            apikey: supabaseKey,
          },
        });
        results.supabaseConnection = {
          status: response.ok ? '✅' : '❌',
          value: response.ok ? 'Connected!' : `HTTP ${response.status}`
        };
      } catch (e: any) {
        results.supabaseConnection = {
          status: '❌',
          value: e.message || 'Connection failed'
        };
      }
    } else {
      results.supabaseConnection = {
        status: '❌',
        value: 'Cannot test - missing credentials'
      };
    }

    // Test Backend connection
    try {
      const backendUrl = apiUrl || 'http://localhost:8080';
      const response = await fetch(`${backendUrl}/docs`, {
        method: 'HEAD',
        mode: 'cors',
      });
      results.backendConnection = {
        status: response.ok ? '✅' : '⚠️',
        value: response.ok ? 'Connected!' : `HTTP ${response.status}`
      };
    } catch (e: any) {
      results.backendConnection = {
        status: '❌',
        value: e.message === 'Failed to fetch' ? 'CORS error or server unreachable' : e.message
      };
    }

    setChecks(results);
    setLoading(false);
  };

  return (
    <div className="container py-10 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">🔧 Algotcha Diagnostics</h1>
          <p className="text-gray-600 mb-6">
            This page checks your environment configuration.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h2 className="font-semibold">Environment Variables</h2>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
                  <span className="text-sm font-mono">
                    {checks.supabaseUrl?.status} {checks.supabaseUrl?.value}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <span className="text-sm font-mono">
                    {checks.supabaseKey?.status} {checks.supabaseKey?.value}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">NEXT_PUBLIC_API_BASE_URL</span>
                  <span className="text-sm font-mono">
                    {checks.apiUrl?.status} {checks.apiUrl?.value}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h2 className="font-semibold">Connection Tests</h2>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Supabase API</span>
                  <span className="text-sm font-mono">
                    {checks.supabaseConnection?.status} {checks.supabaseConnection?.value}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Backend API</span>
                  <span className="text-sm font-mono">
                    {checks.backendConnection?.status} {checks.backendConnection?.value}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              {(checks.supabaseUrl?.status === '❌' || checks.supabaseKey?.status === '❌') && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Missing Supabase Configuration</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Add these environment variables in your <strong>Vercel dashboard</strong>:
                  </p>
                  <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="underline">Supabase Dashboard</a></li>
                    <li>Select your project → Settings → API</li>
                    <li>Copy <strong>Project URL</strong> → NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>Copy <strong>anon public key</strong> → NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                    <li>Go to Vercel → Your Project → Settings → Environment Variables</li>
                    <li>Add both variables and <strong>redeploy</strong></li>
                  </ol>
                </div>
              )}

              {checks.backendConnection?.status === '❌' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">❌ Backend Connection Failed</h3>
                  <p className="text-sm text-red-700">
                    Make sure your Railway backend is running and NEXT_PUBLIC_API_BASE_URL is set to your Railway URL.
                  </p>
                </div>
              )}

              <Button onClick={runDiagnostics} className="w-full mt-4">
                🔄 Run Diagnostics Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

