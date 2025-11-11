import { supabase, Customer } from './supabase';

export const customerService = {
  async createCustomer(userId: string, customerData: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    // Try insert; if foreign-key to users(id) is missing, attempt to create a minimal
    // profile row for the current authenticated user and retry once.
    const attemptInsert = async () => {
      // Ensure start_date is set
      const dataWithDefaults = {
        ...customerData,
        start_date: customerData.start_date || new Date().toISOString().split('T')[0],
        skipped_dates: customerData.skipped_dates || [],
        billing_cycle: customerData.billing_cycle || 'monthly',
      };

      const { data, error } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          ...dataWithDefaults,
        })
        .select()
        .single();

      return { data: data as Customer | null, error };
    };

    let res = await attemptInsert();

    if (res.error) {
      const msg = String(res.error.message ?? res.error.details ?? res.error);
      // Detect foreign key violation on customers.user_id -> users.id
      if (msg.toLowerCase().includes('foreign key') || msg.toLowerCase().includes('customers_user_id_fkey')) {
        try {
          // Try to ensure profile exists for current authenticated user
          const { data: authData } = await supabase.auth.getUser();
          const u = authData?.user ?? null;
          if (u) {
            // insert minimal profile if missing
            const { data: existing } = await supabase.from('users').select('id').eq('id', u.id).maybeSingle();
            if (!existing) {
              const metadata = u.user_metadata as Record<string, unknown> | undefined;
              const name = typeof metadata?.name === 'string' ? metadata.name : null;
              const phone = typeof metadata?.phone === 'string' ? metadata.phone : null;
              await supabase.from('users').insert({
                id: u.id,
                email: u.email ?? null,
                name,
                phone,
                subscription_plan: 'free',
                subscription_active: false,
              });
            }
            // retry insert once
            res = await attemptInsert();
          }
        } catch (err) {
          // ignore and rethrow original error below
          console.warn('Failed to auto-create profile after FK error', err);
        }
      }
    }

    if (res.error) throw res.error;
    return res.data as Customer;
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
