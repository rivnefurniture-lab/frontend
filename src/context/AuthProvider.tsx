"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AuthChangeEvent, Session, AuthError } from "@supabase/supabase-js";

type User = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  country?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
    phone?: string,
    country?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isConfigured: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured] = useState(isSupabaseConfigured());

  const mapUser = (session: Session | null): User | null => {
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
      phone: session.user.user_metadata?.phone || null,
      country: session.user.user_metadata?.country || null,
      facebook: session.user.user_metadata?.facebook || null,
      linkedin: session.user.user_metadata?.linkedin || null,
      twitter: session.user.user_metadata?.twitter || null,
    };
  };

  const handleAuthError = (err: AuthError | Error): string => {
    const message = err.message || 'An error occurred';
    
    // Common Supabase errors with user-friendly messages
    if (message.includes('Failed to fetch')) {
      return 'Unable to connect to authentication server. Please check your internet connection.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Please verify your email before logging in.';
    }
    if (message.includes('User already registered')) {
      return 'This email is already registered. Please login instead.';
    }
    if (message.includes('Password should be')) {
      return 'Password must be at least 6 characters long.';
    }
    
    return message;
  };

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      setError('Authentication is not configured. Please set up Supabase environment variables.');
      return;
    }

    // Initial session fetch
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('Session fetch error:', error);
          setError(handleAuthError(error));
        } else {
          setUser(mapUser(data.session));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Session fetch exception:', err);
        setError(handleAuthError(err));
        setLoading(false);
      });

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(mapUser(session));
        setError(null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [isConfigured]);

  const login = async (email: string, password: string) => {
    if (!isConfigured) {
      throw new Error('Authentication is not configured');
    }
    
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      const message = handleAuthError(err);
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (
    email: string,
    password: string,
    name?: string,
    phone?: string,
    country?: string,
  ) => {
    if (!isConfigured) {
      throw new Error('Authentication is not configured');
    }

    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            country,
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      const message = handleAuthError(err);
      setError(message);
      throw new Error(message);
    }
  };

  const loginWithGoogle = async () => {
    if (!isConfigured) {
      throw new Error('Authentication is not configured');
    }

    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' 
            ? `${window.location.origin}/auth/callback`
            : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      const message = handleAuthError(err);
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setError(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthCtx.Provider value={{ 
      user, 
      loading, 
      error, 
      isConfigured,
      login, 
      register, 
      logout,
      loginWithGoogle,
    }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
