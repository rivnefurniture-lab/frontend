"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "pending"
  >(token ? "loading" : "pending");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
        setEmail(data.email);
      } catch {
        setStatus("error");
        setMessage("Invalid or expired verification link.");
      }
    };
    verify();
  }, [token]);

  const getColor = () => {
    if (status === "error") return "text-red-600";
    if (status === "success") return "text-green-600";
    return "text-gray-600";
  };

  return (
    <div className="container py-10 max-w-md mx-auto">
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          {status === "pending" ? (
            <>
              <h1 className="text-2xl font-semibold">Almost there!</h1>
              <p className="text-sm text-gray-600">
                We’ve sent you an email at <strong>{email}</strong>. Please
                follow the instructions in the email.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">
                {status === "loading"
                  ? "Verifying..."
                  : status === "success"
                    ? "✅ Success!"
                    : "⚠️ Oops!"}
              </h1>
              <p className={`text-sm ${getColor()}`}>{message}</p>
              {status === "success" && (
                <Link
                  href="/auth?mode=login"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Go to Login
                </Link>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
