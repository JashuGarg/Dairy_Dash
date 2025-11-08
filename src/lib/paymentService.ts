import { supabase, Payment } from './supabase';

export const paymentService = {
  async createPayment(userId: string, paymentData: Omit<Payment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        ...paymentData,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  async getPayments(userId: string, filters?: { customerId?: string; startDate?: string; endDate?: string }) {
    let query = supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId);

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters?.startDate) {
      query = query.gte('payment_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('payment_date', filters.endDate);
    }

    const { data, error } = await query.order('payment_date', { ascending: false });

    if (error) throw error;
    return data as Payment[];
  },

  async getCustomerPayments(userId: string, customerId: string, month?: string) {
    let query = supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .eq('customer_id', customerId);

    if (month) {
      const startDate = `${month}-01`;
      const endDate = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0)
        .toISOString()
        .split('T')[0];

      query = query.gte('payment_date', startDate).lte('payment_date', endDate);
    }

    const { data, error } = await query.order('payment_date', { ascending: false });

    if (error) throw error;
    return data as Payment[];
  },

  async updatePayment(paymentId: string, userId: string, updates: Partial<Payment>) {
    const { data, error } = await supabase
      .from('payments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  async deletePayment(paymentId: string, userId: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
