-- Add new columns to customers table
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS skipped_dates DATE[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('daily', 'weekly', 'monthly'));

-- Create delivery_calendar table for detailed tracking
CREATE TABLE IF NOT EXISTS delivery_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('delivered', 'skipped', 'pending')),
  liters_delivered NUMERIC(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, delivery_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_delivery_calendar_customer_date 
ON delivery_calendar(customer_id, delivery_date DESC);

CREATE INDEX IF NOT EXISTS idx_delivery_calendar_user 
ON delivery_calendar(user_id);

-- Add RLS policies
ALTER TABLE delivery_calendar ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own delivery records
CREATE POLICY "Users can view own delivery calendar"
ON delivery_calendar
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own delivery records
CREATE POLICY "Users can insert own delivery calendar"
ON delivery_calendar
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own delivery records
CREATE POLICY "Users can update own delivery calendar"
ON delivery_calendar
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own delivery records
CREATE POLICY "Users can delete own delivery calendar"
ON delivery_calendar
FOR DELETE
USING (auth.uid() = user_id);

-- Function to calculate total bill for a customer
CREATE OR REPLACE FUNCTION calculate_customer_bill(
  p_customer_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_days INTEGER,
  delivered_days INTEGER,
  skipped_days INTEGER,
  total_amount NUMERIC
) AS $$
DECLARE
  v_start_date DATE;
  v_rate NUMERIC;
  v_daily_liters NUMERIC;
BEGIN
  -- Get customer details
  SELECT 
    COALESCE(p_start_date, c.start_date, c.created_at::DATE),
    c.rate_per_liter,
    c.daily_liters
  INTO v_start_date, v_rate, v_daily_liters
  FROM customers c
  WHERE c.id = p_customer_id;

  -- Calculate days
  RETURN QUERY
  WITH date_range AS (
    SELECT 
      (p_end_date - v_start_date + 1) AS total_days
  ),
  delivery_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_days,
      COUNT(*) FILTER (WHERE status = 'skipped') AS skipped_days
    FROM delivery_calendar
    WHERE customer_id = p_customer_id
      AND delivery_date BETWEEN v_start_date AND p_end_date
  )
  SELECT
    dr.total_days::INTEGER,
    COALESCE(ds.delivered_days, 0)::INTEGER,
    COALESCE(ds.skipped_days, 0)::INTEGER,
    (COALESCE(ds.delivered_days, dr.total_days - COALESCE(ds.skipped_days, 0)) * v_rate * v_daily_liters) AS total_amount
  FROM date_range dr
  CROSS JOIN delivery_stats ds;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for delivery_calendar
DROP TRIGGER IF EXISTS update_delivery_calendar_updated_at ON delivery_calendar;
CREATE TRIGGER update_delivery_calendar_updated_at
BEFORE UPDATE ON delivery_calendar
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create view for customer billing summary
CREATE OR REPLACE VIEW customer_billing_summary AS
SELECT
  c.id AS customer_id,
  c.user_id,
  c.name,
  c.phone,
  c.start_date,
  c.rate_per_liter,
  c.daily_liters,
  (SELECT total_days FROM calculate_customer_bill(c.id)) AS total_days,
  (SELECT delivered_days FROM calculate_customer_bill(c.id)) AS delivered_days,
  (SELECT skipped_days FROM calculate_customer_bill(c.id)) AS skipped_days,
  (SELECT total_amount FROM calculate_customer_bill(c.id)) AS calculated_bill,
  c.outstanding_amount
FROM customers c;
