-- Add payment_status column to customers table
-- This replaces the outstanding_amount logic with a simple paid/unpaid status

-- Add the payment_status column with default value 'unpaid'
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid' 
CHECK (payment_status IN ('paid', 'unpaid'));

-- Update existing records: if outstanding_amount > 0, set to 'unpaid', otherwise 'paid'
UPDATE customers 
SET payment_status = CASE 
  WHEN outstanding_amount > 0 THEN 'unpaid' 
  ELSE 'paid' 
END
WHERE payment_status IS NULL OR payment_status = 'unpaid';

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_customers_payment_status ON customers(payment_status);

-- Add comment
COMMENT ON COLUMN customers.payment_status IS 'Payment status: paid or unpaid';
