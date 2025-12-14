'use client';

import { useAuth } from '@/context/AuthProvider';
import { BacktestMonitor } from './BacktestMonitor';

export function BacktestMonitorWrapper() {
  const { user } = useAuth();
  
  // Don't render anything if no user
  if (!user) return null;
  
  return <BacktestMonitor user={user} />;
}
