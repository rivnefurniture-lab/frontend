"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

function PayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();

  const plan = params.get("plan") || "starter";
  const redirect = params.get("redirect") || "/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cryptoDetails, setCryptoDetails] = useState(null);

  const planLabels = {
    starter: "Starter ($9/mo)",
    pro: "Pro ($29/mo)",
    elite: "Elite ($79/mo)",
  };

  const payBinance = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await publicFetch("/pay/binance/create", {
        method: "POST",
        body: JSON.stringify({ planId: plan, email: user?.email }),
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.universalUrl) {
        window.location.href = result.universalUrl;
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const payStripe = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await publicFetch("/pay/stripe/create", {
        method: "POST",
        body: JSON.stringify({ planId: plan, email: user?.email }),
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
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
      const result = await publicFetch("/pay/crypto/create", {
        method: "POST",
        body: JSON.stringify({ planId: plan, email: user?.email }),
      });

      setCryptoDetails(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container py-10 max-w-xl">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-semibold mb-1">Checkout</h1>
          <p className="text-gray-600 mb-6">
            Select a payment method for: <strong>{planLabels[plan] || plan}</strong>
          </p>

          {!cryptoDetails ? (
            <div className="grid gap-3">
              <Button
                onClick={payBinance}
                disabled={loading}
                className="bg-[#F0B90B] hover:bg-[#d4a50a] text-black font-medium"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L7.172 4.828l1.768 1.768L12 3.536l3.06 3.06 1.768-1.768L12 0zM4.828 7.172L0 12l4.828 4.828 1.768-1.768L3.536 12l3.06-3.06-1.768-1.768zM19.172 7.172l-1.768 1.768L20.464 12l-3.06 3.06 1.768 1.768L24 12l-4.828-4.828zM12 8.464L8.464 12 12 15.536 15.536 12 12 8.464zM12 20.464l-3.06-3.06-1.768 1.768L12 24l4.828-4.828-1.768-1.768L12 20.464z"/>
                </svg>
                Pay with Binance Pay
              </Button>

              <Button
                onClick={payStripe}
                disabled={loading}
                className="!bg-[#635BFF] hover:!bg-[#4F46E5] !text-white !border-0"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg>
                Pay with Card (Stripe)
              </Button>

              <Button
                onClick={payCrypto}
                variant="outline"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                Pay with USDT (Direct Transfer)
              </Button>

              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-medium mb-3">Send USDT to complete payment</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Amount</label>
                    <div className="font-mono text-lg font-bold">
                      {cryptoDetails.amount} {cryptoDetails.currency}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500">Network</label>
                    <div className="font-medium">{cryptoDetails.network}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500">Wallet Address</label>
                    <div className="flex items-center gap-2">
                      <code className="bg-white p-2 rounded border text-sm break-all flex-1">
                        {cryptoDetails.walletAddress}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(cryptoDetails.walletAddress)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  {cryptoDetails.note}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCryptoDetails(null)}
              >
                ← Choose another method
              </Button>
            </div>
          )}

          <Button
            className="w-full mt-6"
            variant="ghost"
            onClick={() => router.back()}
          >
            Back to plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Pay() {
  return (
    <Suspense fallback={
      <div className="container py-10 max-w-xl text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    }>
      <PayContent />
    </Suspense>
  );
}
