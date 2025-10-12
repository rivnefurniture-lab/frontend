"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

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
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
    phone?: string,
    country?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = (session: Session | null): User | null => {
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.name || null,
      phone: session.user.user_metadata?.phone || null,
      country: session.user.user_metadata?.country || null,
      facebook: session.user.user_metadata?.facebook || null,
      linkedin: session.user.user_metadata?.linkedin || null,
      twitter: session.user.user_metadata?.twitter || null,
    };
  };

  useEffect(() => {
    // initial session fetch
    supabase.auth.getSession().then(({ data }) => {
      setUser(mapUser(data.session));
      setLoading(false);
    });

    // subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(mapUser(session));
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (
    email: string,
    password: string,
    name?: string,
    phone?: string,
    country?: string,
  ) => {
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
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
