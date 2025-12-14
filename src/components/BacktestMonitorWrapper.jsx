'use client';

// TEMPORARILY DISABLED - causing SSR issues
// import { useAuth } from '@/context/AuthProvider';
// import { BacktestMonitor } from './BacktestMonitor';

export function BacktestMonitorWrapper() {
  // Disabled temporarily to fix page loading
  return null;
  
  // const { user } = useAuth();
  // if (!user) return null;
  // return <BacktestMonitor user={user} />;
}

