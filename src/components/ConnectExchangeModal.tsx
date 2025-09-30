import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function ConnectExchangeModal({ open, onClose, onConnected }: { open: boolean; onClose: ()=>void; onConnected: ()=>void }) {
  const { user } = useAuth();
  const [provider, setProvider] = useState<"binance">("binance");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if (!open) { setApiKey(""); setApiSecret(""); setStatus(null); setLoading(false); } },[open]);

  const connect = async () => {
    setLoading(true); setStatus(null);
    try {
      if (provider === "binance") {
        const res = await fetch("/api/exchange/binance/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ apiKey, apiSecret }),
        });
        if (!res.ok) throw new Error("Failed to save keys");
        setStatus("Connected!");
        onConnected();
      }
    } catch (e:any) {
      setStatus(e.message || "Error");
    } finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-[92%] max-w-md space-y-3" onClick={e=>e.stopPropagation()}>
        <h3 className="text-xl font-semibold">Connect exchange</h3>
        <div>
          <label className="block text-sm mb-1">Provider</label>
          <select value={provider} onChange={e=>setProvider(e.target.value as any)} className="border rounded px-3 py-2 w-full">
            <option value="binance">Binance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">API Key</label>
          <input value={apiKey} onChange={e=>setApiKey(e.target.value)} className="border rounded px-3 py-2 w-full" placeholder="Binance API Key" />
        </div>
        <div>
          <label className="block text-sm mb-1">API Secret</label>
          <input value={apiSecret} onChange={e=>setApiSecret(e.target.value)} className="border rounded px-3 py-2 w-full" placeholder="Binance API Secret" />
        </div>
        {status && <p className="text-sm">{status}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <button className="px-4 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-black text-white" onClick={connect} disabled={loading}>{loading?'Connecting...':'Connect'}</button>
        </div>
        <p className="text:[12px] text-gray-600">Keys are stored encrypted locally (AES-256-GCM) and used by the local server only to fetch balances.</p>
      </div>
    </div>
  );
}
