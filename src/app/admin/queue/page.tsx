'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';

interface QueueItem {
  id: number;
  userId: number;
  strategyName: string;
  status: string;
  queuePosition: number | null;
  progress: number;
  notifyVia: string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  estimatedSeconds?: number;
  estimatedCompletion?: string;
  user?: { email: string; name: string };
}

interface QueueStats {
  queued: number;
  processing: number;
  completed: number;
  totalInQueue: number;
  estimatedWaitMinutes: number;
  estimatedWaitSeconds?: number;
}

interface Analytics {
  users: {
    total: number;
    bySubscription: {
      free: number;
      starter: number;
      pro: number;
      enterprise: number;
    };
    recentSignups: number;
  };
  strategies: {
    total: number;
    active: number;
    public: number;
  };
  backtests: {
    total: number;
    last24h: number;
    last7d: number;
    last30d: number;
    avgSharpe: number;
    avgWinRate: number;
    avgYearlyReturn: number;
  };
  queue: QueueStats;
  system: {
    database: string;
    api: string;
    worker: string;
    uptime: number;
  };
}

interface RecentActivity {
  backtests: Array<{
    id: number;
    name: string;
    user: string;
    netProfit: number;
    sharpe: number;
    winRate: number;
    createdAt: string;
  }>;
  queueItems: Array<{
    id: number;
    strategyName: string;
    user: string;
    status: string;
    createdAt: string;
    completedAt: string | null;
  }>;
  users: Array<{
    id: number;
    name: string;
    email: string;
    subscriptionPlan: string;
    createdAt: string;
  }>;
}

export default function QueueAdminPage() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'analytics' | 'activity'>('queue');

  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch queue stats
      const statsData = await apiFetch<QueueStats>('/backtest/queue/stats');
      setStats(statsData);

      // Fetch all queue items
      try {
        const queueData = await apiFetch<QueueItem[]>('/backtest/queue/all');
        setQueueItems(queueData);
      } catch (e) {
        console.log('Could not fetch all queue items (may need admin privileges)');
      }

      // Fetch admin analytics
      try {
        const analyticsData = await apiFetch<Analytics>('/backtest/admin/analytics');
        setAnalytics(analyticsData);
      } catch (e) {
        console.log('Could not fetch analytics');
      }

      // Fetch recent activity
      try {
        const activityData = await apiFetch<RecentActivity>('/backtest/admin/recent-activity');
        setRecentActivity(activityData);
      } catch (e) {
        console.log('Could not fetch recent activity');
      }
    } catch (error: any) {
      console.error('Failed to fetch queue data:', error);
      setError(error?.message || 'Failed to fetch queue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      queued: 'secondary',
      processing: 'default',
      completed: 'outline',
      failed: 'destructive',
      cancelled: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const cancelBacktest = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this backtest?')) return;
    try {
      await apiFetch(`/backtest/queue/${id}/cancel`, { method: 'POST' });
      fetchData();
    } catch (e: any) {
      alert('Failed to cancel backtest: ' + (e?.message || 'Unknown error'));
    }
  };

  const deleteQueueItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this queue item?')) return;
    try {
      await apiFetch(`/backtest/queue/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e: any) {
      alert('Failed to delete queue item: ' + (e?.message || 'Unknown error'));
    }
  };

  const forceFailBacktest = async (id: number) => {
    if (!confirm('Are you sure you want to force-fail this backtest? This will mark it as failed.')) return;
    try {
      await apiFetch(`/backtest/queue/${id}/force-fail`, { method: 'POST' });
      fetchData();
    } catch (e: any) {
      alert('Failed to force-fail backtest: ' + (e?.message || 'Unknown error'));
    }
  };

  const resetStuckBacktests = async () => {
    if (!confirm('This will mark all backtests processing for over 2 hours as failed. Continue?')) return;
    try {
      const result = await apiFetch<{ count: number }>('/backtest/queue/reset-stuck', { method: 'POST' });
      alert(`Reset ${result.count} stuck backtests`);
      fetchData();
    } catch (e: any) {
      alert('Failed to reset stuck backtests: ' + (e?.message || 'Unknown error'));
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">Authentication Required</h2>
              <p className="text-yellow-700 mb-4">{error}</p>
              <p className="text-sm text-yellow-600 mb-6">Please sign in to access the admin dashboard.</p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => window.location.href = '/auth'} variant="default">
                  Sign In
                </Button>
                <Button onClick={fetchData} variant="outline">
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={resetStuckBacktests} variant="outline" className="text-orange-600 hover:bg-orange-50">
            🔧 Reset Stuck
          </Button>
          <Button onClick={fetchData} variant="outline">
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'queue'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Queue Management
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics & Metrics
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'activity'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent Activity
        </button>
      </div>

      {/* Queue Tab */}
      {activeTab === 'queue' && (
        <>
          {/* Queue Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Queued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.queued || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats?.processing || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats?.completed || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalInQueue || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Est. Wait</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.estimatedWaitMinutes || 0} min</div>
              </CardContent>
            </Card>
          </div>

          {/* Queue Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Queue Items</CardTitle>
              <CardDescription>All backtest jobs in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {queueItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No items in queue</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-3 font-semibold">#</th>
                        <th className="pb-3 font-semibold">User</th>
                        <th className="pb-3 font-semibold">Strategy</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Progress</th>
                        <th className="pb-3 font-semibold">Notify Via</th>
                        <th className="pb-3 font-semibold">Created</th>
                        <th className="pb-3 font-semibold">Duration</th>
                        <th className="pb-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queueItems.map((item) => {
                        const duration = item.startedAt && item.completedAt
                          ? Math.round(
                              (new Date(item.completedAt).getTime() -
                                new Date(item.startedAt).getTime()) /
                                1000 /
                                60
                            )
                          : null;

                        return (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="py-3">{item.id}</td>
                            <td className="py-3">User #{item.userId}</td>
                            <td className="py-3 max-w-xs truncate">{item.strategyName}</td>
                            <td className="py-3">{getStatusBadge(item.status)}</td>
                            <td className="py-3">
                              {item.status === 'processing' ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600">{item.progress}%</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-3">
                              <Badge variant="outline">{item.notifyVia}</Badge>
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {new Date(item.createdAt).toLocaleString()}
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {duration ? `${duration} min` : '-'}
                            </td>
                            <td className="py-3">
                              <div className="flex gap-1">
                                {item.status === 'queued' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => cancelBacktest(item.id)}
                                  >
                                    Cancel
                                  </Button>
                                )}
                                {item.status === 'processing' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-orange-600 hover:bg-orange-50"
                                    onClick={() => forceFailBacktest(item.id)}
                                  >
                                    Force Fail
                                  </Button>
                                )}
                                {(item.status === 'failed' || item.status === 'cancelled' || item.status === 'completed') && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-gray-500 hover:bg-gray-100"
                                    onClick={() => deleteQueueItem(item.id)}
                                  >
                                    🗑️
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Messages (if any) */}
          {queueItems.filter((item) => item.errorMessage).length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queueItems
                    .filter((item) => item.errorMessage)
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="p-3 bg-red-50 rounded-lg flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-red-900">{item.strategyName}</div>
                          <div className="text-sm text-red-700 max-w-xl break-words">{item.errorMessage}</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-600 hover:bg-red-100 ml-2 flex-shrink-0"
                          onClick={() => deleteQueueItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <>
          {/* User Statistics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">User Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{analytics.users.total}</div>
                  <div className="text-sm mt-2 text-blue-100">
                    +{analytics.users.recentSignups} last 7 days
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Free Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.users.bySubscription.free}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Starter Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{analytics.users.bySubscription.starter}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Pro Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{analytics.users.bySubscription.pro}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Enterprise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{analytics.users.bySubscription.enterprise}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Strategy Statistics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Strategy Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{analytics.strategies.total}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{analytics.strategies.active}</div>
                  <div className="text-sm mt-2 text-green-100">Running live trades</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Public Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.strategies.public}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Backtest Statistics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Backtest Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Backtests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{analytics.backtests.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Last 24 Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{analytics.backtests.last24h}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Last 7 Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.backtests.last7d}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Last 30 Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.backtests.last30d}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Avg Sharpe Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.backtests.avgSharpe.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Avg Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{analytics.backtests.avgWinRate.toFixed(1)}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Avg Yearly Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{analytics.backtests.avgYearlyReturn.toFixed(1)}%</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* System Health */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${analytics.system.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-lg font-semibold capitalize">{analytics.system.database}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">API Server</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${analytics.system.api === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-lg font-semibold capitalize">{analytics.system.api}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Worker Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${analytics.system.worker === 'healthy' ? 'bg-green-500' : analytics.system.worker === 'unknown' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-lg font-semibold capitalize">{analytics.system.worker}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">API Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">{formatUptime(analytics.system.uptime)}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Recent Activity Tab */}
      {activeTab === 'activity' && recentActivity && (
        <>
          {/* Recent Backtests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Backtests</h2>
            <Card>
              <CardContent className="pt-6">
                {recentActivity.backtests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No recent backtests</div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.backtests.map((backtest) => (
                      <div key={backtest.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold">{backtest.name}</div>
                          <div className="text-sm text-gray-600">
                            by {backtest.user} • {new Date(backtest.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            ${backtest.netProfit.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Sharpe: {backtest.sharpe.toFixed(2)} • WR: {backtest.winRate.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Queue Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Queue Activity</h2>
            <Card>
              <CardContent className="pt-6">
                {recentActivity.queueItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No recent queue activity</div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.queueItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold">{item.strategyName}</div>
                          <div className="text-sm text-gray-600">
                            by {item.user} • {new Date(item.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent User Signups */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent User Signups</h2>
            <Card>
              <CardContent className="pt-6">
                {recentActivity.users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No recent signups</div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold">{user.name || user.email}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="capitalize">
                            {user.subscriptionPlan}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
