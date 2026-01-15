"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [status, setStatus] = useState<
    "pending" | "loading" | "success" | "error"
  >(email ? "pending" : "loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkConfirmation = async () => {
      const hash = window.location.hash; // Supabase sends access_token in hash
      if (!hash) return;

      setStatus("loading");
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setStatus("error");
        setMessage("Failed to verify email.");
        return;
      }

      if (data.user && data.user.email_confirmed_at) {
        setStatus("success");
        setMessage("Your email has been verified!");
      } else {
        setStatus("error");
        setMessage("Invalid or expired verification link.");
      }
    };

    checkConfirmation();
  }, []);

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
                We&apos;ve sent you an email at <strong>{email}</strong>. Please
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
                  className="inline-block mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition"
                  style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container py-10 max-w-md mx-auto text-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
