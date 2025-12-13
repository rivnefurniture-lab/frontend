'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { X, Minimize2, Maximize2, XCircle } from 'lucide-react';

/**
 * Floating draggable backtest monitor
 * Shows running backtests, queue position, progress, and allows cancellation
 */
export function BacktestMonitor({ user }) {
  const [backtests, setBacktests] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const monitorRef = useRef(null);

  // Fetch user's queue items
  useEffect(() => {
    if (!user) return;

    const fetchBacktests = async () => {
      try {
        const myQueue = await apiFetch('/backtest/queue/my');
        // Only show active (queued or processing) backtests
        const active = myQueue.filter(
          (b) => b.status === 'queued' || b.status === 'processing'
        );
        setBacktests(active);
      } catch (e) {
        console.log('Could not fetch backtests');
      }
    };

    fetchBacktests();
    const interval = setInterval(fetchBacktests, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

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

  // Don't show if no active backtests
  if (!user || backtests.length === 0) return null;

  const getStatusColor = (status) => {
    if (status === 'processing') return 'bg-blue-500';
    if (status === 'queued') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getEstimatedTime = (queuePosition) => {
    if (queuePosition === null || queuePosition <= 0) return 'Processing now...';
    const minutes = queuePosition * 10; // Estimate 10 min per backtest
    if (minutes < 60) return `~${minutes} min`;
    return `~${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
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
                        style={{ width: `${backtest.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {backtest.progress || 0}% complete
                    </p>
                  </div>
                )}

                {/* Queue Info (if queued) */}
                {backtest.status === 'queued' && backtest.queuePosition !== null && (
                  <div className="text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Position in queue:</span>
                      <span className="font-medium">#{backtest.queuePosition}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Estimated wait:</span>
                      <span className="font-medium">
                        {getEstimatedTime(backtest.queuePosition)}
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
  );
}

