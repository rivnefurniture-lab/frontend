"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Link from "next/link";

const ADMIN_EMAIL = "liudvichuk@gmail.com";

export default function AdminSubscriptionsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [grantForm, setGrantForm] = useState({ email: "", plan: "pro", days: 7 });
  const [actionLoading, setActionLoading] = useState(false);
  const [qualityStats, setQualityStats] = useState(null);
  const [showQualityStats, setShowQualityStats] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/subscription/admin/users");
      if (data.error) {
        setError(data.error);
      } else {
        setUsers(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async () => {
    if (!searchEmail) return;
    try {
      const data = await apiFetch(`/subscription/admin/user?email=${encodeURIComponent(searchEmail)}`);
      setSearchResult(data);
    } catch (err) {
      setSearchResult({ error: err.message });
    }
  };

  const grantAccess = async () => {
    if (!grantForm.email) return;
    try {
      setActionLoading(true);
      const result = await apiFetch("/subscription/admin/grant", {
        method: "POST",
        body: {
          email: grantForm.email,
          plan: grantForm.plan,
          days: parseInt(grantForm.days),
        },
      });
      if (result.success) {
        alert(`✅ Access granted! Expires: ${new Date(result.expiresAt).toLocaleDateString()}`);
        fetchUsers();
        setGrantForm({ email: "", plan: "pro", days: 7 });
      } else {
        alert(`❌ Error: ${result.error || result.message}`);
      }
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const revokeAccess = async (email) => {
    if (!confirm(`Are you sure you want to revoke access for ${email}?`)) return;
    try {
      setActionLoading(true);
      const result = await apiFetch("/subscription/admin/revoke", {
        method: "POST",
        body: { email },
      });
      if (result.success) {
        alert("✅ Access revoked");
        fetchUsers();
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchQualityStats = async () => {
    try {
      const data = await apiFetch("/subscription/admin/backtest-quality");
      setQualityStats(data);
      setShowQualityStats(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p>Please log in to access this page.</p>
        <Link href="/auth">
          <Button className="mt-4">Login</Button>
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-gray-600">Manage user subscriptions and access</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/strategies">
            <Button variant="outline">Strategies</Button>
          </Link>
          <Link href="/admin/queue">
            <Button variant="outline">Queue</Button>
          </Link>
        </div>
      </div>

      {/* Grant Access Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            Grant Subscription Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">User Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={grantForm.email}
                onChange={(e) => setGrantForm({ ...grantForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Plan</label>
              <Select
                value={grantForm.plan}
                onChange={(e) => setGrantForm({ ...grantForm, plan: e.target.value })}
              >
                <option value="pro">Pro ($29/mo)</option>
                <option value="enterprise">Enterprise ($99/mo)</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Duration (days)</label>
              <Input
                type="number"
                min={1}
                max={365}
                value={grantForm.days}
                onChange={(e) => setGrantForm({ ...grantForm, days: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={grantAccess}
                disabled={actionLoading || !grantForm.email}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {actionLoading ? "Granting..." : "Grant Access"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search User */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Search User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchUser}>Search</Button>
          </div>
          {searchResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              {searchResult.error ? (
                <p className="text-red-600">{searchResult.error}</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Email:</strong> {searchResult.email}</p>
                    <p><strong>Name:</strong> {searchResult.name || "N/A"}</p>
                    <p><strong>Plan:</strong> <span className={`font-bold ${searchResult.plan === 'pro' ? 'text-emerald-600' : searchResult.plan === 'enterprise' ? 'text-purple-600' : 'text-gray-600'}`}>{searchResult.plan?.toUpperCase()}</span></p>
                    <p><strong>Status:</strong> <span className={searchResult.isActive ? 'text-green-600' : 'text-red-600'}>{searchResult.status}</span></p>
                  </div>
                  <div>
                    <p><strong>Expires:</strong> {searchResult.expiresAt ? new Date(searchResult.expiresAt).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Days Remaining:</strong> {searchResult.daysRemaining ?? "N/A"}</p>
                    <p><strong>Strategies:</strong> {searchResult.stats?.strategies}</p>
                    <p><strong>Backtests:</strong> {searchResult.stats?.backtests}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backtest Quality Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Backtest Quality Stats
            </span>
            <Button onClick={fetchQualityStats} variant="outline" size="sm">
              {showQualityStats ? "Refresh" : "Load Stats"}
            </Button>
          </CardTitle>
        </CardHeader>
        {showQualityStats && qualityStats && (
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{qualityStats.total}</p>
                <p className="text-sm text-gray-600">Total Backtests</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{qualityStats.meaningful}</p>
                <p className="text-sm text-gray-600">Meaningful (counted)</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{qualityStats.withNaNProfit}</p>
                <p className="text-sm text-gray-600">NaN Profit</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">{qualityStats.withZeroProfit}</p>
                <p className="text-sm text-gray-600">Zero Profit</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">{qualityStats.withLessThan10Trades}</p>
                <p className="text-sm text-gray-600">&lt;10 Trades</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2">📖 Why Results Can Be 0 or NaN:</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Zero Profit:</strong> {qualityStats.explanation?.zeroProfit}</li>
                <li><strong>NaN Profit:</strong> {qualityStats.explanation?.nanProfit}</li>
                <li><strong>&lt;10 Trades:</strong> {qualityStats.explanation?.fewTrades}</li>
                <li><strong>&lt;10% Return:</strong> {qualityStats.explanation?.lowReturn}</li>
              </ul>
            </div>

            <h4 className="font-bold mb-2">Recent Backtests:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-right">Trades</th>
                    <th className="p-2 text-right">Profit</th>
                    <th className="p-2 text-right">Return</th>
                    <th className="p-2 text-center">Counted?</th>
                    <th className="p-2 text-left">Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityStats.recentBacktests?.slice(0, 20).map((bt, i) => (
                    <tr key={i} className={`border-b ${bt.isMeaningful ? '' : 'bg-red-50'}`}>
                      <td className="p-2">{bt.email}</td>
                      <td className="p-2">{bt.name}</td>
                      <td className="p-2 text-right">{bt.trades}</td>
                      <td className="p-2 text-right">{bt.profit?.toFixed(2) ?? 'N/A'}</td>
                      <td className="p-2 text-right">{bt.yearlyReturn}</td>
                      <td className="p-2 text-center">{bt.isMeaningful ? '✅' : '❌'}</td>
                      <td className="p-2 text-xs text-red-600">{bt.issues?.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* All Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              All Users ({users.length})
            </span>
            <Button onClick={fetchUsers} variant="outline" size="sm">
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-center">Plan</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">Expires</th>
                    <th className="p-2 text-center">Days Left</th>
                    <th className="p-2 text-center">Strategies</th>
                    <th className="p-2 text-center">Backtests</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.name || "-"}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          u.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' :
                          u.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {u.plan?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {u.status || 'none'}
                        </span>
                      </td>
                      <td className="p-2 text-center text-xs">
                        {u.expiresAt ? new Date(u.expiresAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-2 text-center">
                        {u.daysRemaining !== null ? (
                          <span className={u.daysRemaining <= 3 ? 'text-red-600 font-bold' : ''}>
                            {u.daysRemaining}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="p-2 text-center">{u.stats?.strategies || 0}</td>
                      <td className="p-2 text-center">{u.stats?.backtests || 0}</td>
                      <td className="p-2 text-center">
                        {u.isActive && u.plan !== 'free' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => revokeAccess(u.email)}
                            disabled={actionLoading}
                          >
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                            onClick={() => setGrantForm({ ...grantForm, email: u.email })}
                          >
                            Grant
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

