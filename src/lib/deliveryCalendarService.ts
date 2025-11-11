import { supabase } from './supabase';
import type { DeliveryCalendar, DeliveryStatus, BillingSummary } from './supabase';

export const deliveryCalendarService = {
  // Get delivery records for a customer within date range
  async getDeliveryCalendar(
    customerId: string,
    startDate: string,
    endDate: string
  ): Promise<DeliveryCalendar[]> {
    const { data, error } = await supabase
      .from('delivery_calendar')
      .select('*')
      .eq('customer_id', customerId)
      .gte('delivery_date', startDate)
      .lte('delivery_date', endDate)
      .order('delivery_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Mark a day as delivered or skipped
  async updateDeliveryStatus(
    userId: string,
    customerId: string,
    date: string,
    status: DeliveryStatus,
    litersDelivered: number = 0,
    notes?: string
  ): Promise<DeliveryCalendar> {
    // Try to update existing record first
    const { data: existing } = await supabase
      .from('delivery_calendar')
      .select('id')
      .eq('customer_id', customerId)
      .eq('delivery_date', date)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('delivery_calendar')
        .update({
          status,
          liters_delivered: litersDelivered,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('delivery_calendar')
        .insert({
          user_id: userId,
          customer_id: customerId,
          delivery_date: date,
          status,
          liters_delivered: litersDelivered,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Bulk update multiple dates
  async bulkUpdateDeliveryStatus(
    userId: string,
    customerId: string,
    dates: Array<{ date: string; status: DeliveryStatus; litersDelivered?: number }>
  ): Promise<void> {
    const records = dates.map(({ date, status, litersDelivered = 0 }) => ({
      user_id: userId,
      customer_id: customerId,
      delivery_date: date,
      status,
      liters_delivered: litersDelivered,
    }));

    const { error } = await supabase
      .from('delivery_calendar')
      .upsert(records, {
        onConflict: 'customer_id,delivery_date',
      });

    if (error) throw error;
  },

  // Calculate bill for a customer
  async calculateBill(
    customerId: string,
    startDate?: string,
    endDate?: string
  ): Promise<BillingSummary> {
    // Get customer details
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (customerError) throw customerError;

    // Determine start date (use customer's start_date or created_at)
    let calculationStartDate: Date;
    
    if (startDate) {
      calculationStartDate = new Date(startDate);
    } else if (customer.start_date) {
      calculationStartDate = new Date(customer.start_date);
    } else {
      // Fallback to created_at if start_date doesn't exist
      calculationStartDate = new Date(customer.created_at);
    }

    const calculationEndDate = endDate ? new Date(endDate) : new Date();
    
    // Set to start of day for accurate comparison
    calculationStartDate.setHours(0, 0, 0, 0);
    calculationEndDate.setHours(0, 0, 0, 0);

    // Calculate total days from start_date to today (inclusive)
    const totalDays = Math.max(0, Math.floor((calculationEndDate.getTime() - calculationStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    // Get only skipped records from database
    const { data: records, error: recordsError } = await supabase
      .from('delivery_calendar')
      .select('*')
      .eq('customer_id', customerId)
      .eq('status', 'skipped')
      .gte('delivery_date', calculationStartDate.toISOString().split('T')[0])
      .lte('delivery_date', calculationEndDate.toISOString().split('T')[0]);

    if (recordsError) throw recordsError;

    const skippedDays = records?.length || 0;
    const deliveredDays = Math.max(0, totalDays - skippedDays);

    // Calculate bill: delivered_days × daily_liters × rate_per_liter
    const calculatedBill = deliveredDays * customer.daily_liters * customer.rate_per_liter;

    return {
      customer_id: customerId,
      user_id: customer.user_id,
      name: customer.name,
      phone: customer.phone,
      start_date: customer.start_date || customer.created_at.split('T')[0],
      rate_per_liter: customer.rate_per_liter,
      daily_liters: customer.daily_liters,
      total_days: totalDays,
      delivered_days: deliveredDays,
      skipped_days: skippedDays,
      calculated_bill: calculatedBill,
      outstanding_amount: customer.outstanding_amount,
    };
  },

  // Get billing summary for all customers
  async getAllBillingSummaries(userId: string): Promise<BillingSummary[]> {
    const { data, error } = await supabase
      .from('customer_billing_summary')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  // Delete delivery record
  async deleteDeliveryRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('delivery_calendar')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
