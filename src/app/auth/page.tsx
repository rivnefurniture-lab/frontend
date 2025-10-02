"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { user, loading, login, register, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        await login(email, password);
      } else if (mode === "register") {
        await register(
          email,
          password,
          name || undefined,
          phone || undefined,
          country || undefined,
        );
        router.replace("/portfolio");
      } else if (mode === "forgot") {
        await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        setMessage("If this email exists, a reset link has been sent.");
      }

      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setCountry("");
    } catch (e: any) {
      setError(e.message || "Error");
    }
  };

  useEffect(() => {
    if (user) {
      router.replace("/portfolio");
    }
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
              />
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <Button className="w-full">
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
                    className="text-blue-600 underline"
                    onClick={() => setMode("register")}
                  >
                    Sign up
                  </button>
                </p>
                <p className="mt-2">
                  Forgot password?{" "}
                  <button
                    type="button"
                    className="text-blue-600 underline"
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
