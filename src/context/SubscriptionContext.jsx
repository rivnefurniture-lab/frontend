"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { apiFetch } from "@/lib/api";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const status = await apiFetch("/subscription/status");
      setSubscription(status);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      // Default to free plan on error
      setSubscription({
        plan: "free",
        isActive: false,
        expiresAt: null,
        limits: {
          backtestsPerDay: 3,
          maxSavedStrategies: 3,
          historicalDataYears: 1,
        },
        usage: {
          backtestsToday: 0,
          savedStrategies: 0,
        },
        canRunBacktest: true,
        canSaveStrategy: true,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Refresh subscription status
  const refresh = useCallback(() => {
    setLoading(true);
    fetchSubscription();
  }, [fetchSubscription]);

  const value = {
    subscription,
    loading,
    refresh,
    // Convenience getters
    plan: subscription?.plan || "free",
    isPro: subscription?.plan === "pro" || subscription?.plan === "enterprise",
    isEnterprise: subscription?.plan === "enterprise",
    canBacktest: subscription?.canRunBacktest ?? true,
    canSaveStrategy: subscription?.canSaveStrategy ?? true,
    backtestsRemaining: subscription?.limits?.backtestsPerDay === -1 
      ? "unlimited" 
      : Math.max(0, (subscription?.limits?.backtestsPerDay || 3) - (subscription?.usage?.backtestsToday || 0)),
    strategiesRemaining: subscription?.limits?.maxSavedStrategies === -1
      ? "unlimited"
      : Math.max(0, (subscription?.limits?.maxSavedStrategies || 3) - (subscription?.usage?.savedStrategies || 0)),
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

