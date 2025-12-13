'use client';

import { useState, useEffect } from 'react';
// Queue Admin Dashboard v1.0
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
}

interface QueueStats {
  queued: number;
  processing: number;
  completed: number;
  totalInQueue: number;
  estimatedWaitMinutes: number;
}

export default function QueueAdminPage() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch stats using the proper API client
      const statsData = await apiFetch<QueueStats>('/backtest/queue/stats');
      setStats(statsData);

      // Fetch all queue items
      try {
        const queueData = await apiFetch<QueueItem[]>('/backtest/queue/all');
        setQueueItems(queueData);
      } catch (e) {
        // Admin endpoint might fail if not admin - that's ok
        console.log('Could not fetch all queue items (may need admin privileges)');
      }
    } catch (error) {
      console.error('Failed to fetch queue data:', error);
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
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Backtest Queue Admin</h1>
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Backtest Queue Admin</h1>
        <Button onClick={fetchData} variant="outline">
          🔄 Refresh
        </Button>
      </div>

      {/* Stats Cards */}
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
                  <div key={item.id} className="p-3 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-900">{item.strategyName}</div>
                    <div className="text-sm text-red-700">{item.errorMessage}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Trigger deployment Thu Dec 11 15:06:02 EET 2025
// Trigger deployment 1765459337
