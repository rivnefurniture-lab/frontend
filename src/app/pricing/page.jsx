"use client";

import { Suspense } from "react";
import { plans } from "./mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

// inner component that actually uses useSearchParams
function PricingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const pay = (planId) => {
    router.push(`/pay?plan=${planId}&redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Choose your plan</h1>
      <p className="text-center text-gray-600 mb-8">
        Cancel anytime. Start with monthly.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p) => (
          <Card key={p.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">
                ${p.price}
                <span className="text-base text-gray-500">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {p.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              <Button className="w-full mt-6" onClick={() => pay(p.id)}>
                Get {p.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <Suspense fallback={<div>Loading pricing...</div>}>
      <PricingInner />
    </Suspense>
  );
}
