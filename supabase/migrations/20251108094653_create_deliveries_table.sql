/*
  # Create Deliveries Table

  1. New Tables
    - `deliveries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `customer_id` (uuid, foreign key to customers)
      - `liters_delivered` (numeric)
      - `rate_used` (numeric)
      - `delivery_date` (date)
      - `notes` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `deliveries` table
    - Users can only access their own deliveries
*/

CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  liters_delivered numeric NOT NULL CHECK (liters_delivered > 0),
  rate_used numeric NOT NULL CHECK (rate_used > 0),
  delivery_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_deliveries_user_id ON deliveries(user_id);
CREATE INDEX idx_deliveries_customer_id ON deliveries(customer_id);
CREATE INDEX idx_deliveries_date ON deliveries(delivery_date);

ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deliveries"
  ON deliveries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deliveries"
  ON deliveries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deliveries"
  ON deliveries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
