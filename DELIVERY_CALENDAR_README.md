# Delivery Calendar Feature - Implementation Guide

## 🎉 What's New

A complete calendar-based delivery tracking system has been added to DairyDash! This allows you to:
- Track daily milk deliveries for each customer
- Mark days as delivered or skipped
- Auto-calculate bills based on actual deliveries
- Export billing reports as CSV
- View delivery history in an interactive calendar

## 📦 Files Created/Modified

### New Files:
1. `supabase/migrations/20251111_add_delivery_calendar.sql` - Database migration
2. `src/lib/deliveryCalendarService.ts` - Service for calendar operations
3. `src/components/DeliveryCalendar.tsx` - Interactive calendar component
4. `src/components/VoiceAddModal.tsx` - Improved voice input modal

### Modified Files:
1. `src/lib/supabase.ts` - Added new types (DeliveryCalendar, BillingSummary, DeliveryStatus)
2. `src/lib/customerService.ts` - Added start_date, skipped_dates, billing_cycle defaults
3. `src/components/CustomerTable.tsx` - Added calendar button and start date column
4. `src/pages/Dashboard.tsx` - Integrated calendar modal and voice modal

## 🗄️ Database Setup

### Step 1: Run the Migration

You have two options:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `supabase/migrations/20251111_add_delivery_calendar.sql`
5. Paste it into the SQL editor
6. Click **Run** button
7. Wait for success message

#### Option B: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push

# Or apply the specific migration
supabase migration up
```

### Step 2: Verify Migration

Run this query in Supabase SQL Editor to verify:
```sql
-- Check if delivery_calendar table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'delivery_calendar';

-- Check if new columns were added to customers
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND column_name IN ('start_date', 'skipped_dates', 'billing_cycle');

-- Check if function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'calculate_customer_bill';
```

## 🚀 Features

### 1. **Delivery Calendar**
- Click the 📅 calendar icon next to any customer in the table
- Interactive month-by-month calendar view
- Click any date to toggle between delivered/skipped
- Visual indicators:
  - 🟢 Green = Delivered
  - 🔴 Red = Skipped
  - ⚪ Gray = Not marked
  - 🔵 Blue ring = Today

### 2. **Smart Bill Calculation**
The system automatically calculates bills using this formula:
```
Total Bill = Delivered Days × Rate per Liter × Daily Liters
```

Real-time summary shows:
- Total days since start
- Delivered days
- Skipped days
- Calculated bill amount

### 3. **Export Reports**
- Click "Export Report" in calendar modal
- Downloads CSV with complete delivery summary
- Includes customer details, delivery stats, and bill calculation

### 4. **Voice Input Enhancement**
- Improved voice recognition for adding customers
- Better error handling and validation
- Visual feedback for extracted data
- Example format: "customer Ramesh Kumar phone 9876543210 cow milk quantity 2 liters rate 60 rupees"

## 🎨 UI/UX Features

- **Dark theme** matching existing design
- **Responsive** layout for mobile and desktop
- **Real-time updates** when marking deliveries
- **Disabled states** for future dates and dates before start
- **Loading indicators** during data fetch
- **Smooth animations** and transitions

## 📝 Usage Examples

### Adding a Customer with Start Date
```typescript
await customerService.createCustomer(userId, {
  name: "Ramesh Kumar",
  phone: "9876543210",
  milk_type: "cow",
  daily_liters: 2,
  rate_per_liter: 60,
  outstanding_amount: 0,
  start_date: "2025-11-01", // Optional, defaults to today
  skipped_dates: [],
  billing_cycle: "monthly"
});
```

### Marking Deliveries
```typescript
// Mark a date as delivered
await deliveryCalendarService.updateDeliveryStatus(
  userId,
  customerId,
  "2025-11-10",
  "delivered",
  2.0 // liters delivered
);

// Mark a date as skipped
await deliveryCalendarService.updateDeliveryStatus(
  userId,
  customerId,
  "2025-11-11",
  "skipped",
  0
);
```

### Calculating Bills
```typescript
// Get billing summary for a customer
const summary = await deliveryCalendarService.calculateBill(
  customerId,
  "2025-11-01", // start date
  "2025-11-30"  // end date
);

console.log(summary.calculated_bill); // Auto-calculated amount
```

## 🔒 Security

- **Row Level Security (RLS)** enabled on delivery_calendar table
- Users can only view/edit their own delivery records
- Foreign key constraints ensure data integrity
- Timestamps auto-updated on every change

## 🐛 Troubleshooting

### Migration Fails
- Check if you have necessary permissions
- Ensure you're connected to the correct Supabase project
- Try running each section of the migration separately

### Calendar Not Loading
- Check browser console for errors
- Verify customer has a start_date set
- Ensure you're authenticated

### Bill Calculation Issues
- Verify delivery records exist in delivery_calendar table
- Check if customer has rate_per_liter and daily_liters set
- Run the calculate_customer_bill function manually in SQL Editor

### Voice Input Not Working
- Works only in Chrome, Edge, and Safari
- Requires HTTPS (works on localhost in dev mode)
- Check microphone permissions in browser settings

## 📊 Database Schema

### delivery_calendar table:
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users.id)
- customer_id (UUID, Foreign Key → customers.id)
- delivery_date (DATE)
- status (TEXT: 'delivered', 'skipped', 'pending')
- liters_delivered (NUMERIC)
- notes (TEXT, Optional)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- UNIQUE constraint on (customer_id, delivery_date)
```

### customers table additions:
```sql
- start_date (DATE, Default: today)
- skipped_dates (DATE[], Default: empty array)
- billing_cycle (TEXT: 'daily', 'weekly', 'monthly')
```

## 🎯 Next Steps

1. **Run the migration** in Supabase dashboard
2. **Restart your dev server**: `npm run dev`
3. **Test the calendar** by clicking the calendar icon on any customer
4. **Mark some deliveries** to see bill calculation in action
5. **Export a report** to verify CSV generation

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Supabase connection in `.env` file
3. Ensure all migration steps completed successfully
4. Check that customer has start_date populated

---

🎉 **You're all set!** The delivery calendar feature is now fully integrated into your DairyDash application.
