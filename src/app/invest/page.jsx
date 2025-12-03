"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [strategies, setStrategies] = useState([]);
  const [sid, setSid] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const data = await apiFetch("/backtest/strategies");
      setStrategies(data || []);
    } catch (err) {
      console.error("Failed to fetch strategies:", err);
    } finally {
      setLoading(false);
    }
  };

  const s = strategies.find((x) => x.id === sid || x.id === parseInt(sid));

  const handleContinue = () => {
    if (s && amount) {
      router.push(`/strategies/${s.id}`);
    }
  };

  return (
    <div className="container py-10 max-w-2xl">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-semibold mb-1">Invest in a Strategy</h1>
          <p className="text-gray-600 mb-6">
            Choose a strategy and amount. You can adjust risk controls later.
          </p>
          <div className="space-y-4">
            <select
              value={sid}
              onChange={(e) => setSid(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-200"
              disabled={loading}
            >
              <option value="">
                {loading ? "Loading strategies..." : "Select a strategy"}
              </option>
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.cagr?.toFixed(1) || 0}% yearly)
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Amount (USD)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
            />
            {s && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <p className="text-blue-800">
                  <strong>{s.name}</strong> - {s.category}
                </p>
                <p className="text-blue-600">
                  Expected yearly return: <strong>+{s.cagr?.toFixed(1) || 0}%</strong>
                </p>
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={handleContinue}
              disabled={!s || !amount}
            >
              Continue to Strategy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
