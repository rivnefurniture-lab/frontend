'use client';

import { useAuth } from '@/context/AuthProvider';
import { BacktestMonitor } from './BacktestMonitor';

export function BacktestMonitorWrapper() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return <BacktestMonitor user={user} />;
}

