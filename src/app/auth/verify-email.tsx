"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!searchParams.token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${searchParams.token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setStatus("success");
        setMessage(
          data.message || "Your email has been successfully verified!",
        );
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Email verification failed.");
      });
  }, [searchParams.token]);

  const getColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container py-10 max-w-md mx-auto">
      <Card>
        <CardContent className="p-6 text-center space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
