'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { X, Minimize2, Maximize2, XCircle, CheckCircle, Rocket, Eye } from 'lucide-react';
import Link from 'next/link';

/**
 * Floating draggable backtest monitor
 * Shows running backtests, queue position, progress, and allows cancellation
 * Also shows completion notifications
 */
export function BacktestMonitor({ user }) {
  const [backtests, setBacktests] = useState([]);
  const [completedBacktest, setCompletedBacktest] = useState(null); // For the completion popup
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 }); // Safe initial values
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [previousBacktestIds, setPreviousBacktestIds] = useState(new Set());
  const monitorRef = useRef(null);

  // Set proper position after mount (window is available)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setPosition({ x: window.innerWidth - 420, y: 100 });
    }
  }, []);

  // Fetch user's active backtests with time estimates
  useEffect(() => {
    if (!user) return;

    const fetchBacktests = async () => {
      try {
        // Use the new endpoint with time estimates
        const active = await apiFetch('/backtest/queue/my-active');
        const currentActive = active || [];
        
        // Check for newly completed backtests (was in previous list, not in current)
        const currentIds = new Set(currentActive.map(b => b.id));
        for (const prevId of previousBacktestIds) {
          if (!currentIds.has(prevId)) {
            // A backtest was removed (likely completed) - fetch its result
            try {
              const results = await apiFetch('/backtest/results');
              // Find the most recently completed one
              if (results && results.length > 0) {
                const latest = results[0]; // Most recent
                setCompletedBacktest(latest);
                // Auto-hide after 15 seconds
                setTimeout(() => setCompletedBacktest(null), 15000);
              }
            } catch (e) {
              console.log('Could not fetch completed backtest');
            }
          }
        }
        
        setPreviousBacktestIds(currentIds);
        setBacktests(currentActive);
      } catch (e) {
        console.log('Could not fetch backtests');
      }
    };

    fetchBacktests();
    const interval = setInterval(fetchBacktests, 3000); // Update every 3 seconds for smoother progress
    return () => clearInterval(interval);
  }, [user, previousBacktestIds]);

  // Handle dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.monitor-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Cancel backtest
  const handleCancel = async (backtestId) => {
    if (!confirm('Are you sure you want to cancel this backtest?')) return;

    try {
      await apiFetch(`/backtest/queue/${backtestId}/cancel`, { method: 'POST' });
      setBacktests(backtests.filter((b) => b.id !== backtestId));
    } catch (e) {
      alert('Failed to cancel backtest');
    }
  };

  // Don't show the running backtests panel if not mounted or no user
  // But still show completion notification if available
  if (!mounted || !user) return null;
  
  // Show only the completion notification if there are no active backtests
  if (backtests.length === 0 && !completedBacktest) return null;

  const getStatusColor = (status) => {
    if (status === 'processing') return 'bg-blue-500';
    if (status === 'queued') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return 'calculating...';
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCompletionTime = (isoString) => {
    if (!isoString) return 'calculating...';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
    {/* Active Backtests Panel */}
    {backtests.length > 0 && (
    <div
      ref={monitorRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
      className="select-none"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-[380px]">
        {/* Header */}
        <div className="monitor-header bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <h3 className="text-white font-semibold text-sm">
              Running Backtests ({backtests.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="max-h-[400px] overflow-y-auto">
            {backtests.map((backtest) => (
              <div
                key={backtest.id}
                className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
              >
                {/* Strategy Name */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {backtest.strategyName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(backtest.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(backtest.id)}
                    className="text-red-500 hover:text-red-700 transition ml-2"
                    title="Cancel backtest"
                  >
                    <XCircle size={18} />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(backtest.status)}`}></div>
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {backtest.status}
                  </span>
                  {backtest.queuePosition !== null && backtest.queuePosition > 0 && (
                    <span className="text-xs text-gray-500">
                      (#{backtest.queuePosition} in queue)
                    </span>
                  )}
                </div>

                {/* Progress Bar (if processing) */}
                {backtest.status === 'processing' && (
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(95, backtest.progress || 0)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{Math.round(backtest.progress || 0)}% complete</span>
                      <span>ETA: {formatCompletionTime(backtest.estimatedCompletion)}</span>
                    </div>
                  </div>
                )}

                {/* Queue Info (if queued) */}
                {backtest.status === 'queued' && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Position in queue:</span>
                      <span className="font-medium">#{backtest.queuePosition || 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated duration:</span>
                      <span className="font-medium">{formatTime(backtest.estimatedSeconds)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected completion:</span>
                      <span className="font-medium text-blue-600">
                        {formatCompletionTime(backtest.estimatedCompletion)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notification Method */}
                <div className="text-xs text-gray-500 mt-2">
                  📧 Notify via: <span className="font-medium">{backtest.notifyVia}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Minimized State */}
        {isMinimized && (
          <div className="px-4 py-2 text-center">
            <p className="text-xs text-gray-600">
              {backtests.length} backtest{backtests.length > 1 ? 's' : ''} running
            </p>
          </div>
        )}
      </div>
    </div>
    )}
      
      {/* Completion Notification Popup */}
      {completedBacktest && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[10000] bg-black/30 backdrop-blur-sm"
          onClick={() => setCompletedBacktest(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Backtest Complete! 🎉</h3>
                <p className="text-sm text-gray-500">{completedBacktest.strategy_name || completedBacktest.name}</p>
              </div>
              <button 
                onClick={() => setCompletedBacktest(null)} 
                className="ml-auto text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Results Summary */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className={`text-xl font-bold ${
                  (completedBacktest.net_profit || completedBacktest.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {((completedBacktest.net_profit || completedBacktest.netProfit) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Return</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-800">
                  {((completedBacktest.win_rate || completedBacktest.winRate) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">Win Rate</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-800">
                  {completedBacktest.total_trades || completedBacktest.totalTrades}
                </div>
                <div className="text-xs text-gray-500">Trades</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-orange-600">
                  {((completedBacktest.max_drawdown || completedBacktest.maxDrawdown) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Max DD</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href={`/strategies/backtest-${completedBacktest.id}`} className="flex-1">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2">
                  <Eye size={18} />
                  View Details
                </button>
              </Link>
              <Link href={`/strategies/backtest-${completedBacktest.id}#live`} className="flex-1">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2">
                  <Rocket size={18} />
                  Start Live
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

