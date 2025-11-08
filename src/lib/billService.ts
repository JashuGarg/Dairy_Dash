import { supabase, Bill } from './supabase';
import { deliveryService } from './deliveryService';
import { paymentService } from './paymentService';

export const billService = {
  async generateBillForMonth(userId: string, customerId: string, month: string) {
    const deliveries = await deliveryService.getDeliveriesByMonth(userId, month);
    const customerDeliveries = deliveries.filter(d => d.customer_id === customerId);

    const totalLiters = customerDeliveries.reduce((sum, d) => sum + d.liters_delivered, 0);
    const totalAmount = customerDeliveries.reduce((sum, d) => sum + d.liters_delivered * d.rate_used, 0);

    const payments = await paymentService.getCustomerPayments(userId, customerId, month);
    const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    const status = paidAmount === 0 ? 'draft' : paidAmount >= totalAmount ? 'paid' : 'partial';

    const { data, error } = await supabase
      .from('bills')
      .upsert({
        user_id: userId,
        customer_id: customerId,
        month: `${month}-01`,
        total_liters: totalLiters,
        total_amount: totalAmount,
        paid_amount: paidAmount,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Bill;
  },

  async getBills(userId: string, filters?: { customerId?: string; month?: string }) {
    let query = supabase
      .from('bills')
      .select('*')
      .eq('user_id', userId);

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters?.month) {
      const monthStart = `${filters.month}-01`;
      query = query.eq('month', monthStart);
    }

    const { data, error } = await query.order('month', { ascending: false });

    if (error) throw error;
    return data as Bill[];
  },

  async getBill(billId: string, userId: string) {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('id', billId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as Bill | null;
  },

  async updateBillStatus(billId: string, userId: string, status: Bill['status']) {
    const { data, error } = await supabase
      .from('bills')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', billId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Bill;
  },

  async markBillSentViaWhatsApp(billId: string, userId: string) {
    const { data, error } = await supabase
      .from('bills')
      .update({
        sent_via_whatsapp: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', billId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Bill;
  },

  async getOutstandingBills(userId: string) {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'paid');

    if (error) throw error;
    return data as Bill[];
  },
};
