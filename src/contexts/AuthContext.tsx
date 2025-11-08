import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

import type { AuthResponse, AuthOtpResponse } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmailOtp: (email: string) => Promise<AuthOtpResponse>;
  signInWithPhoneOtp: (phone: string) => Promise<AuthOtpResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      setLoading(false);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const signInWithEmailOtp = async (email: string) => {
    return supabase.auth.signInWithOtp({ email });
  };

  const signInWithPhoneOtp = async (phone: string) => {
    return supabase.auth.signInWithOtp({ phone });
  };

  const signUp = async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signInWithPassword = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInWithEmailOtp, signInWithPhoneOtp, signUp, signInWithPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};