/*
  # Create Subscription Payments Table

  1. New Tables
    - `subscription_payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `amount` (numeric)
      - `plan` (text: 'plus', 'pro')
      - `period` (text: 'monthly', 'annual')
      - `razorpay_order_id` (text, optional)
      - `razorpay_payment_id` (text, optional)
      - `status` (text: 'pending', 'completed', 'failed')
      - `payment_date` (date)
      - `expires_at` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `subscription_payments` table
    - Users can only access their own subscription payments
*/

CREATE TABLE IF NOT EXISTS subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  plan text NOT NULL CHECK (plan IN ('plus', 'pro')),
  period text NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'annual')),
  razorpay_order_id text,
  razorpay_payment_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date date,
  expires_at date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_subscription_payments_user_id ON subscription_payments(user_id);
CREATE INDEX idx_subscription_payments_status ON subscription_payments(status);

ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription payments"
  ON subscription_payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscription payments"
  ON subscription_payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription payments"
  ON subscription_payments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
