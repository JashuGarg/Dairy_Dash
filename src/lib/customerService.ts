import { supabase, Customer } from './supabase';

export const customerService = {
  async createCustomer(userId: string, customerData: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        user_id: userId,
        ...customerData,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async getCustomers(userId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Customer[];
  },

  async getCustomer(customerId: string, userId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as Customer | null;
  },

  async updateCustomer(customerId: string, userId: string, updates: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },

  async deleteCustomer(customerId: string, userId: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async updateOutstandingAmount(customerId: string, userId: string, amount: number) {
    const { data, error } = await supabase
      .from('customers')
      .update({
        outstanding_amount: amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  },
};
