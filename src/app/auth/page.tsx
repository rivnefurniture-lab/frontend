"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isSignup = mode === "register";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (mode === "login") {
        // 🔹 Persist session based on "Remember me"
        await supabase.auth.signInWithPassword({
          email,
          password,
          options: {
            // When remember = false, session persists only in-memory
            // (will clear on tab close)
            shouldCreateUser: false,
          },
        });

        if (!remember) {
          await supabase.auth.setSession(
            (await supabase.auth.getSession()).data.session ?? null
          );
          // Supabase automatically stores session in localStorage —
          // for non-remember sessions, we can clear it on window unload:
          window.addEventListener("beforeunload", () =>
            supabase.auth.signOut()
          );
        }

        router.replace("/portfolio");
      } else if (mode === "register") {
        if (!email || !password) {
          setError("Please fill out all required fields.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone, country },
            emailRedirectTo: `${window.location.origin}/verify-email?email=${encodeURIComponent(
              email
            )}`,
          },
        });

        if (error) throw error;

        router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/password-reset`,
        });
        if (error) throw error;
        setMessage("If this email exists, a reset link has been sent.");
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setPhone("");
      setCountry("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (user) router.replace("/portfolio");
  }, [user, router]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="container py-10 max-w-md">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold mb-1">
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
                ? "Start investing in algorithms within minutes."
                : "Welcome back."}
          </p>

          <form onSubmit={onSubmit} className="space-y-4" autoComplete="on">
            {isSignup && (
              <>
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
                <Input
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
                <Input
                  placeholder="Country (optional)"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  autoComplete="country"
                />
              </>
            )}

            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={isSignup ? "email" : "username"}
            />

            {mode !== "forgot" && (
              <>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                {isSignup && (
                  <Input
                    placeholder="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                )}
              </>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Remember me
                </label>
              </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <Button type="submit" className="w-full">
              {mode === "forgot"
                ? "Send reset link"
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            {mode === "forgot" ? (
              <p>
                Remember your password?{" "}
                <button
                  type="button"
                  className="text-blue-600 underline"
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
                  className="text-blue-600 underline"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <>
                <p>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => setMode("register")}
                  >
                    Sign up
                  </button>
                </p>
                <p className="mt-2">
                  Forgot password?{" "}
                  <button
                    type="button"
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => setMode("forgot")}
                  >
                    Reset here
                  </button>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
