"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PhoneInput from "react-phone-input-2";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-input-2/lib/style.css";

function AuthPageInner() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isSignup = mode === "register";

  useEffect(() => {
    const urlMode = searchParams.get("mode") as
      | "login"
      | "register"
      | "forgot"
      | null;

    if (!urlMode && mode !== "login") {
      setMode("login");
      return;
    }

    if (urlMode && urlMode !== mode) {
      setMode(urlMode);
    }
  }, [searchParams, mode]);

  const updateMode = (newMode: "login" | "register" | "forgot") => {
    const params = new URLSearchParams(searchParams);
    if (newMode === "login") {
      params.delete("mode");
    } else {
      params.set("mode", newMode);
    }

    router.replace(`/auth?${params.toString()}`, { scroll: false });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (mode === "login") {
        await login(email, password);
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

        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;

        if (!strongPasswordRegex.test(password)) {
          setError(
            "Password must be at least 9 characters long and include uppercase, lowercase, number, and special character.",
          );
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone, country },
            emailRedirectTo: `${window.location.origin}/verify-email?email=${encodeURIComponent(email)}`,
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
    <div className="w-full max-w-lg">
      <Card>
        <CardContent className="p-8 flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-1 text-center">
            {mode === "forgot"
              ? "Reset password"
              : isSignup
                ? "Create account"
                : "Sign in"}
          </h1>

          <p className="text-gray-600 mb-6 text-center">
            {mode === "forgot"
              ? "Enter your email to receive a reset link."
              : isSignup
                ? "Start investing in algorithms within minutes."
                : "Welcome back."}
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center gap-4 w-full"
            autoComplete="on"
          >
            {isSignup && (
              <>
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  inputClass="w-full! h-11! pl-12! pr-4! rounded-xl! border! border-gray-200! text-gray-900! placeholder-gray-400! focus:outline-none! focus:ring-2! focus:ring-blue-500!"
                  placeholder="Phone (optional)"
                />
                <CountryDropdown
                  value={country}
                  onChange={(value) => setCountry(value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {isSignup && (
                  <Input
                    placeholder="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                )}
              </>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            {message && (
              <p className="text-green-600 text-sm text-center">{message}</p>
            )}

            <Button type="submit" className="w-fit">
              {mode === "forgot"
                ? "Send reset link"
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600 text-left">
            {mode === "forgot" ? (
              <p>
                Remember your password?{" "}
                <button
                  type="button"
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => updateMode("login")}
                >
                  Back to login
                </button>
              </p>
            ) : isSignup ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => updateMode("login")}
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
                    onClick={() => updateMode("register")}
                  >
                    Sign up
                  </button>
                </p>
                <p className="mt-2">
                  Forgot password?{" "}
                  <button
                    type="button"
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => updateMode("forgot")}
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

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-500 text-center">Loading auth...</div>
      }
    >
      <AuthPageInner />
    </Suspense>
  );
}
