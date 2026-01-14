"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Inner component that uses useSearchParams
function AuthForm() {
  const { user, loading, error: authError, isConfigured, login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "register";

  // Check URL params for mode
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup' || urlMode === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        router.replace("/dashboard");
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone, country },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        setMessage("Check your email for a verification link!");
        setMode("login");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/password-reset`,
        });
        if (error) throw error;
        setMessage("If this email exists, a reset link has been sent.");
      }

      if (mode !== "register") {
        setEmail("");
        setPassword("");
      }
      setName("");
      setPhone("");
      setCountry("");
    } catch (e) {
      setError(e.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="container py-16 max-w-md text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show configuration error
  if (!isConfigured) {
    return (
      <div className="container py-10 max-w-md">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">⚠️ Configuration Required</h1>
            <p className="text-red-700 mb-4">
              Authentication is not configured. Please set up the following environment variables:
            </p>
            <ul className="text-sm text-red-600 space-y-1 font-mono bg-red-100 p-3 rounded">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
            <p className="text-red-700 mt-4 text-sm">
              Get these from your <a href="https://supabase.com" target="_blank" rel="noopener" className="underline">Supabase</a> project settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-md">
      {/* Geometric card */}
      <div className="bg-white border-2 border-gray-100 p-8 shadow-xl" style={{clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))'}}>
        <h1 className="text-2xl font-bold mb-1">
          {mode === "forgot"
            ? "Reset password"
            : isSignup
              ? "Create account"
              : "Sign in"}
        </h1>
        <p className="text-gray-600 mb-6">
          {mode === "forgot"
            ? "Enter your email to receive a reset link."
            : isSignup
              ? "Start using Algotcha within minutes."
              : "Welcome back to Algotcha."}
        </p>

        {/* Google Login Button */}
        {mode !== "forgot" && (
          <>
            <button
              type="button"
              className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 font-bold hover:border-black hover:bg-gray-50 transition-all"
              onClick={handleGoogleLogin}
              style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500 font-medium">or</span>
              </div>
            </div>
          </>
        )}

          <form onSubmit={onSubmit} className="space-y-4">
            {isSignup && (
              <>
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  placeholder="Country (optional)"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </>
            )}

            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {mode !== "forgot" && (
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            )}

            {(error || authError) && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 text-sm" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                {error || authError}
              </div>
            )}
            
            {message && (
              <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 text-sm" style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full px-4 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-all disabled:opacity-50" 
              disabled={submitting}
              style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing...
                </span>
              ) : mode === "forgot"
                ? "Send reset link"
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            {mode === "forgot" ? (
              <p>
                Remember your password?{" "}
                <button
                  type="button"
                  className="text-black font-bold hover:underline"
                  onClick={() => setMode("login")}
                >
                  Back to login
                </button>
              </p>
            ) : isSignup ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-black font-bold hover:underline"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <>
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="text-black font-bold hover:underline"
                    onClick={() => setMode("register")}
                  >
                    Sign up
                  </button>
                </p>
                <p className="mt-2">
                  Forgot password?{" "}
                  <button
                    type="button"
                    className="text-black font-bold hover:underline"
                    onClick={() => setMode("forgot")}
                  >
                    Reset here
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 max-w-md text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
