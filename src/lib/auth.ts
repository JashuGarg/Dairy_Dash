import { supabase } from './supabase';

export const authService = {
  async signUpWithEmail(email: string, password: string, name: string, phone: string) {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('No user created');

    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        phone,
        name,
        subscription_plan: 'free',
        subscription_active: false,
      });

      
// CREATE TABLE IF NOT EXISTS users (
//   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
//   email text UNIQUE NOT NULL,
//   phone text UNIQUE,
//   name text,
//   created_at timestamptz DEFAULT now(),
//   subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'plus', 'pro')),
//   subscription_active boolean DEFAULT false,
//   subscription_expires timestamptz,
//   updated_at timestamptz DEFAULT now()
// );
    if (profileError) throw profileError;
      console.log(authData.user);
      
    return authData.user;
  },

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    console.log(data.user);
    
    return data.user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (user: any | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  },
};
