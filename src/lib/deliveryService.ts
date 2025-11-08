import { supabase, Delivery } from './supabase';

export const deliveryService = {
  async createDelivery(userId: string, deliveryData: Omit<Delivery, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('deliveries')
      .insert({
        user_id: userId,
        ...deliveryData,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Delivery;
  },

  async getDeliveries(userId: string, filters?: { customerId?: string; startDate?: string; endDate?: string }) {
    let query = supabase
      .from('deliveries')
      .select('*')
      .eq('user_id', userId);

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters?.startDate) {
      query = query.gte('delivery_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('delivery_date', filters.endDate);
    }

    const { data, error } = await query.order('delivery_date', { ascending: false });

    if (error) throw error;
    return data as Delivery[];
  },

  async getDeliveriesByMonth(userId: string, month: string) {
    const startDate = `${month}-01`;
    const endDate = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0)
      .toISOString()
      .split('T')[0];

    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('user_id', userId)
      .gte('delivery_date', startDate)
      .lte('delivery_date', endDate);

    if (error) throw error;
    return data as Delivery[];
  },

  async getTodayDeliveries(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('user_id', userId)
      .eq('delivery_date', today);

    if (error) throw error;
    return data as Delivery[];
  },

  async updateDelivery(deliveryId: string, userId: string, updates: Partial<Delivery>) {
    const { data, error } = await supabase
      .from('deliveries')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', deliveryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Delivery;
  },

  async deleteDelivery(deliveryId: string, userId: string) {
    const { error } = await supabase
      .from('deliveries')
      .delete()
      .eq('id', deliveryId)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
