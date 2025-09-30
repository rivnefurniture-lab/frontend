'use client';

import React, { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function AuthPage() {
  const { user, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name || undefined, phone || undefined, country || undefined);
        setSuccessOpen(true);
      }
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setCountry("");
    } catch (e: any) {
      setError(e.message || "Error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (user) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <p className="text-lg">Logged in as <strong>{user.email}</strong></p>
        <button onClick={logout} className="px-4 py-2 rounded bg-black text-white">Logout</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode("login")}
          className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-black text-white' : 'border'}`}>Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`px-3 py-1 rounded ${mode === 'register' ? 'bg-black text-white' : 'border'}`}>Register
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "register" && (
          <>
            <input
              value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)"
              className="border w-full px-3 py-2 rounded"/>
            <input
              value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)"
              className="border w-full px-3 py-2 rounded"/>
            <input
              value={country} onChange={e => setCountry(e.target.value)} placeholder="Country (optional)"
              className="border w-full px-3 py-2 rounded"/>
          </>
        )}
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
          className="border w-full px-3 py-2 rounded" required/>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
          className="border w-full px-3 py-2 rounded" required/>
        {error && <p className="text-red-600">{error}</p>}
        <button
          className="bg-black text-white px-4 py-2 rounded">{mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>

      {successOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => setSuccessOpen(false)}>
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-2">Account created 🎉</h3>
            <p className="mb-4">Welcome to Algotcha! You can now connect your exchange and start tracking balances.</p>
            <button
              className="bg-black text-white px-4 py-2 rounded" onClick={() => setSuccessOpen(false)}>Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
