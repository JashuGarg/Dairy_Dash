import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable persistent sessions across browser refreshes
    persistSession: true,
    // Store session in localStorage (default behavior)
    storage: window.localStorage,
    // Automatically refresh tokens before expiry
    autoRefreshToken: true,
    // Detect session from URL (for email confirmations, password resets)
    detectSessionInUrl: true,
    // Flow type for authentication
    flowType: 'pkce',
  },
});

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  milk_type: 'cow' | 'buffalo';
  daily_liters: number;
  rate_per_liter: number;
  outstanding_amount: number;
  payment_status: 'paid' | 'unpaid';
  start_date: string;
  skipped_dates: string[];
  billing_cycle: 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
};

export type DeliveryStatus = 'delivered' | 'skipped' | 'pending';

export type DeliveryCalendar = {
  id: string;
  user_id: string;
  customer_id: string;
  delivery_date: string;
  status: DeliveryStatus;
  liters_delivered: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type BillingSummary = {
  customer_id: string;
  user_id: string;
  name: string;
  phone: string;
  start_date: string;
  rate_per_liter: number;
  daily_liters: number;
  total_days: number;
  delivered_days: number;
  skipped_days: number;
  calculated_bill: number;
  outstanding_amount: number;
};

export type Delivery = {
  id: string;
  user_id: string;
  customer_id: string;
  liters_delivered: number;
  rate_used: number;
  delivery_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  customer_id: string;
  amount: number;
  payment_method: 'cash' | 'upi' | 'card' | 'bank';
  payment_date: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Bill = {
  id: string;
  user_id: string;
  customer_id: string;
  month: string;
  total_liters: number;
  total_amount: number;
  paid_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'partial';
  sent_via_whatsapp: boolean;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  subscription_plan: 'free' | 'plus' | 'pro';
  subscription_active: boolean;
  subscription_expires?: string;
  created_at: string;
  updated_at: string;
};

