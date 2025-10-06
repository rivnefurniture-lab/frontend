"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

function PayInner() {
  const router = useRouter();
  const params = useSearchParams();

  const plan = params.get("plan") || "starter";
  const redirect = params.get("redirect") || "/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const payStripe = async () => {
    try {
      setLoading(true);
      setError(null);
      const { url } = await apiFetch("/pay/stripe/create-session", {
        method: "POST",
        body: JSON.stringify({ planId: plan, redirect }),
      });
      window.location.href = url;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const payLiqPay = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, signature, url } = await apiFetch("/pay/liqpay/create", {
        method: "POST",
        body: JSON.stringify({ planId: plan, redirect }),
      });

      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;

      const f1 = document.createElement("input");
      f1.name = "data";
      f1.value = data;
      form.appendChild(f1);

      const f2 = document.createElement("input");
      f2.name = "signature";
      f2.value = signature;
      form.appendChild(f2);

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const payCrypto = async () => {
    try {
      setLoading(true);
      setError(null);
      const { url, address, amount, currency } = await apiFetch(
        "/pay/crypto/create",
        {
          method: "POST",
          body: JSON.stringify({ planId: plan, redirect }),
        },
      );

      if (url) {
        window.location.href = url;
      } else {
        alert(
          `Send ${amount} ${currency} to ${address}. After payment, return to the site.`,
        );
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-xl">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-semibold mb-1">Checkout</h1>
          <p className="text-gray-600 mb-6">
            Select a payment method for plan: <strong>{plan}</strong>
          </p>
          <div className="grid gap-3">
            <Button onClick={payStripe} disabled={loading}>
              Pay with Stripe
            </Button>
            <Button onClick={payLiqPay} variant="secondary" disabled={loading}>
              Pay with LiqPay
            </Button>
            <Button onClick={payCrypto} variant="secondary" disabled={loading}>
              Pay with Crypto
            </Button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
          <Button
            className="w-full mt-6"
            variant="ghost"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Pay() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <PayInner />
    </Suspense>
  );
}
