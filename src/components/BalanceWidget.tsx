import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { apiFetch } from "@/lib/api";

type Bal = { asset: string; free: string; locked: string };
export default function BalanceWidget() {
  const { user } = useAuth();
  const [balances, setBalances] = useState<Bal[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const st = await apiFetch("/api/exchange/binance/status", {
        credentials: "include",
      }).then((r) => r.json());
      if (!st.connected) {
        setBalances(null);
        return;
      }
      const res = await apiFetch("/api/exchange/binance/balance", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Balance fetch failed");
      const data = await res.json();
      setBalances((data?.balances || []).slice(0, 10));
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return null;

  return (
    <div className="hidden md:flex items-center gap-3">
      <span className="text-sm text-gray-600">Balances:</span>
      {loading && <span className="text-sm">...</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
      {!loading && !error && balances && balances.length > 0 ? (
        <div className="flex items-center gap-2 text-sm max-w-[420px] overflow-x-auto">
          {balances.map((b) => (
            <span key={b.asset} className="px-2 py-1 rounded border">
              {b.asset}: {Number(b.free) + Number(b.locked)}
            </span>
          ))}
        </div>
      ) : (
        !loading &&
        !error && <span className="text-sm text-gray-500">Not connected</span>
      )}
    </div>
  );
}
