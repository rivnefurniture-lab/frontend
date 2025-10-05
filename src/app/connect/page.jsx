"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

function ExchangeForm({ id, fields }) {
  const [form, setForm] = useState({ testnet: true });
  const [status, setStatus] = useState(null);

  const handle = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/connect", { body: { exchange: id, ...form } });
      setStatus({ ok: true, msg: "Connected ✓" });
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    }
  };

  const test = async () => {
    try {
      const res = await apiFetch(`/balance?exchange=${id}`);
      setStatus({
        ok: true,
        msg: `Balance: ${Object.keys(res.total).slice(0, 5).join(", ")}`,
      });
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    }
  };

  return (
    <Card>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2 capitalize">{id}</h3>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          {fields.includes("apiKey") && (
            <input
              className="h-11 px-4 rounded-xl border border-gray-200"
              placeholder="API Key"
              onChange={(e) => handle("apiKey", e.target.value)}
            />
          )}
          {fields.includes("secret") && (
            <input
              className="h-11 px-4 rounded-xl border border-gray-200"
              placeholder="API Secret"
              onChange={(e) => handle("secret", e.target.value)}
            />
          )}
          {fields.includes("password") && (
            <input
              className="h-11 px-4 rounded-xl border border-gray-200"
              placeholder="Passphrase (OKX)"
              onChange={(e) => handle("password", e.target.value)}
            />
          )}
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.testnet}
              onChange={(e) => handle("testnet", e.target.checked)}
            />{" "}
            Use testnet/sandbox
          </label>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit">Save & Connect</Button>
            <Button variant="secondary" type="button" onClick={test}>
              Test balance
            </Button>
          </div>
          {status && (
            <p className={status.ok ? "text-green-600" : "text-red-600"}>
              {status.msg}
            </p>
          )}
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Create API keys with trading permissions (no withdrawal). For testnet,
          use testnet keys.
        </p>
      </CardContent>
    </Card>
  );
}

export default function Connect() {
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Connect Exchanges</h1>
      <p className="text-gray-600">
        Keys are kept in-memory on the dev server.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <ExchangeForm id="binance" fields={["apiKey", "secret"]} />
        <ExchangeForm id="bybit" fields={["apiKey", "secret"]} />
        <ExchangeForm id="okx" fields={["apiKey", "secret", "password"]} />
      </div>
    </div>
  );
}
