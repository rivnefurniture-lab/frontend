"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { user, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const isSignup = mode === "register";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignup) {
        await register(
          email,
          password,
          name || undefined,
          phone || undefined,
          country || undefined,
        );
        setSuccessOpen(true);
      } else {
        await login(email, password);
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

  if (loading) return <p className="p-6">Loading...</p>;

  if (user) {
    return (
      <div className="container py-10 max-w-md">
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-lg">
              Logged in as <strong>{user.email}</strong>
            </p>
            <Button onClick={logout} className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-md">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold mb-1">
            {isSignup ? "Create account" : "Sign in"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isSignup
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
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button className="w-full">
              {isSignup ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-4">
            By continuing you agree to our Terms and Privacy Policy.
          </p>

          <div className="mt-4 text-sm text-gray-600">
            {isSignup ? (
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
            )}
          </div>
        </CardContent>
      </Card>

      {successOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setSuccessOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-2">Account created 🎉</h3>
            <p className="mb-4">
              Welcome to Algotcha! You can now connect your exchange and start
              tracking balances.
            </p>
            <Button className="w-full" onClick={() => setSuccessOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
