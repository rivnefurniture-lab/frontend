# Frontend Integration Guide - Backtest Queue

## Overview

Update the backtest submission flow to use the queue system. Users will see their queue position and choose how to receive results.

## Step 1: Create Queue Dialog Component

Create `src/components/BacktestQueueDialog.tsx`:

```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface BacktestQueueDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (notifyVia: 'email' | 'telegram' | 'both') => void;
  queueStats?: {
    queued: number;
    processing: number;
    estimatedWaitMinutes: number;
  };
}

export default function BacktestQueueDialog({
  open,
  onClose,
  onSubmit,
  queueStats,
}: BacktestQueueDialogProps) {
  const [notifyVia, setNotifyVia] = useState<'email' | 'telegram' | 'both'>('email');

  const position = (queueStats?.queued || 0) + 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Backtest Queue</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {queueStats && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                📊 You are <span className="text-lg font-bold">#{position}</span> in line
              </p>
              {queueStats.estimatedWaitMinutes > 0 && (
                <p className="text-sm text-blue-700 mt-1">
                  ⏱️ Estimated wait: ~{queueStats.estimatedWaitMinutes} minutes
                </p>
              )}
            </div>
          )}

          <div>
            <Label className="text-base font-semibold mb-3 block">
              Where do you want to receive results?
            </Label>
            <RadioGroup value={notifyVia} onValueChange={(v) => setNotifyVia(v as any)}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="cursor-pointer">
                  📧 Email
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="telegram" id="telegram" />
                <Label htmlFor="telegram" className="cursor-pointer">
                  💬 Telegram
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="cursor-pointer">
                  📨 Both Email & Telegram
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => onSubmit(notifyVia)} className="flex-1">
              Add to Queue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Step 2: Update Backtest Page

Modify your backtest submission logic:

```typescript
import { useState, useEffect } from 'react';
import BacktestQueueDialog from '@/components/BacktestQueueDialog';

export default function BacktestPage() {
  const [showQueueDialog, setShowQueueDialog] = useState(false);
  const [queueStats, setQueueStats] = useState(null);
  const [backtestPayload, setBacktestPayload] = useState(null);

  // Fetch queue stats when opening dialog
  useEffect(() => {
    if (showQueueDialog) {
      fetchQueueStats();
    }
  }, [showQueueDialog]);

  const fetchQueueStats = async () => {
    try {
      const res = await fetch('/api/backtest/queue/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setQueueStats(data);
    } catch (error) {
      console.error('Failed to fetch queue stats:', error);
    }
  };

  const handleRunBacktest = (payload) => {
    // Instead of running immediately, show queue dialog
    setBacktestPayload(payload);
    setShowQueueDialog(true);
  };

  const handleSubmitToQueue = async (notifyVia) => {
    try {
      const res = await fetch('/api/backtest/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          payload: backtestPayload,
          notifyVia,
        }),
      });

      const result = await res.json();

      if (result.success) {
        // Show success message
        toast.success(
          `Backtest added to queue! You are #${result.position} in line. ` +
          `Estimated wait: ${result.estimatedWait} minutes.`
        );

        // Optional: Track queue status
        trackQueueStatus(result.queueId);
      }
    } catch (error) {
      toast.error('Failed to add backtest to queue');
    } finally {
      setShowQueueDialog(false);
    }
  };

  const trackQueueStatus = async (queueId) => {
    // Optional: Poll queue status
    const interval = setInterval(async () => {
      const res = await fetch(`/api/backtest/queue/position/${queueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.status === 'completed') {
        clearInterval(interval);
        toast.success('Backtest completed! Check your notifications.');
        // Refresh backtest results
        refetchResults();
      } else if (data.status === 'failed') {
        clearInterval(interval);
        toast.error('Backtest failed. Check your email for details.');
      }
    }, 30000); // Check every 30 seconds

    // Clean up after 1 hour
    setTimeout(() => clearInterval(interval), 3600000);
  };

  return (
    <div>
      {/* Your existing backtest UI */}
      <Button onClick={() => handleRunBacktest(payload)}>
        Run Backtest
      </Button>

      <BacktestQueueDialog
        open={showQueueDialog}
        onClose={() => setShowQueueDialog(false)}
        onSubmit={handleSubmitToQueue}
        queueStats={queueStats}
      />
    </div>
  );
}
```

## Step 3: Add Queue History View

Show user's queue history:

```typescript
import { useEffect, useState } from 'react';

export default function QueueHistory() {
  const [queueItems, setQueueItems] = useState([]);

  useEffect(() => {
    fetchQueueHistory();
  }, []);

  const fetchQueueHistory = async () => {
    const res = await fetch('/api/backtest/queue/my', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setQueueItems(data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Backtest Queue History</h2>
      
      {queueItems.map((item) => (
        <div key={item.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{item.strategyName}</h3>
              <p className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <StatusBadge status={item.status} />
            </div>
          </div>
          
          {item.status === 'processing' && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">{item.progress}% complete</p>
            </div>
          )}
          
          {item.status === 'completed' && item.resultId && (
            <Button
              variant="link"
              onClick={() => router.push(`/backtest/results/${item.resultId}`)}
            >
              View Results →
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    queued: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
```

## API Integration Summary

```typescript
// 1. Add to queue
POST /api/backtest/queue
Body: { payload: BacktestPayload, notifyVia: 'email'|'telegram'|'both' }

// 2. Check position
GET /api/backtest/queue/position/:queueId

// 3. Get my queue items
GET /api/backtest/queue/my

// 4. Get queue stats
GET /api/backtest/queue/stats
```

## Testing

1. Run backtest
2. See queue position dialog
3. Choose notification method
4. Submit
5. Receive notification when complete
6. View results in dashboard

## Notes

- Queue stats update in real-time
- Estimated wait time is approximate (15 min per backtest)
- Users can check queue history at any time
- Notifications sent automatically when complete

