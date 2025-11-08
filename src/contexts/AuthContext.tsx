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

    // Ensure a profile row exists in `users` table for the authenticated user.
    // This avoids foreign-key violations when other tables reference users(id).
    const ensureUserProfile = async (u: User | null) => {
      if (!u) return;
      try {
        const { data: existing, error: selectError } = await supabase
          .from('users')
          .select('id')
          .eq('id', u.id)
          .maybeSingle();

        if (selectError) {
          console.warn('Could not check user profile existence:', selectError);
          return;
        }

        if (!existing) {
          // Insert a minimal profile row (do not overwrite any existing data)
          const metadata = u.user_metadata as Record<string, unknown> | undefined;
          const name = typeof metadata?.name === 'string' ? metadata.name : null;
          const phone = typeof metadata?.phone === 'string' ? metadata.phone : null;

          const { error: insertError } = await supabase.from('users').insert({
            id: u.id,
            email: u.email ?? null,
            name,
            phone,
            subscription_plan: 'free',
            subscription_active: false,
          });

          if (insertError) {
            // Non-fatal: warn and continue. Foreign-key violations should no longer occur
            // once this profile exists.
            console.warn('Failed to create user profile row:', insertError);
          } else {
            console.info('Created missing user profile row for', u.id);
          }
        }
      } catch (err) {
        console.warn('Error ensuring user profile exists:', err);
      }
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        // ensure profile exists for current session user
        ensureUserProfile(data.session.user);
      }
      setLoading(false);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
      // ensure profile exists whenever auth state changes and we have a user
      ensureUserProfile(sess?.user ?? null);
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