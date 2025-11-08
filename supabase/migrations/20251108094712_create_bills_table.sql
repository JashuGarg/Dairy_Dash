/*
  # Create Bills Table

  1. New Tables
    - `bills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `customer_id` (uuid, foreign key to customers)
      - `month` (date, first day of month)
      - `total_liters` (numeric)
      - `total_amount` (numeric)
      - `paid_amount` (numeric, default 0)
      - `status` (text: 'draft', 'sent', 'paid', 'partial')
      - `sent_via_whatsapp` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bills` table
    - Users can only access their own bills
*/

CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  month date NOT NULL,
  total_liters numeric NOT NULL CHECK (total_liters > 0),
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  paid_amount numeric DEFAULT 0 CHECK (paid_amount >= 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'partial')),
  sent_via_whatsapp boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, customer_id, month)
);

CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_customer_id ON bills(customer_id);
CREATE INDEX idx_bills_month ON bills(month);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bills"
  ON bills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bills"
  ON bills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bills"
  ON bills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bills"
  ON bills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
