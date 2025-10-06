"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setSubscribed } from "@/lib/utils";

function PaySuccessInner() {
  const router = useRouter();
  const params = useSearchParams();

  const plan = params.get("plan") || "starter";
  const redirect = params.get("redirect") || "/";

  useEffect(() => {
    setSubscribed(plan);
    const t = setTimeout(() => router.push(redirect), 1200);
    return () => clearTimeout(t);
  }, [plan, redirect, router]);

  return (
    <div className="container py-16">
      <h1 className="text-2xl font-semibold">Payment successful 🎉</h1>
      <p className="text-gray-600">Unlocking features...</p>
    </div>
  );
}

export default function PaySuccess() {
  return (
    <Suspense fallback={<div>Processing payment...</div>}>
      <PaySuccessInner />
    </Suspense>
  );
}
