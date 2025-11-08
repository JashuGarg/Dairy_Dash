# DairyDash Supabase Integration Guide

## Overview

DairyDash is fully integrated with Supabase for user authentication, customer management, and transaction tracking. All data is securely stored and accessible only by authenticated users through Row-Level Security (RLS) policies.

## Database Schema

### Tables

#### 1. **users**
Stores user profile information and subscription details.
- `id` (uuid) - Linked to Supabase Auth user
- `email` (text, unique) - User email
- `phone` (text, unique) - User phone number
- `name` (text) - User full name
- `subscription_plan` (text) - 'free', 'plus', or 'pro'
- `subscription_active` (boolean) - Current subscription status
- `subscription_expires` (timestamp) - Subscription expiry date
- `created_at` / `updated_at` (timestamp)

#### 2. **customers**
Stores customer information for each vendor.
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `name` (text) - Customer name
- `phone` (text) - Customer phone number
- `milk_type` (text) - 'cow' or 'buffalo'
- `daily_liters` (numeric) - Daily delivery quantity
- `rate_per_liter` (numeric) - Price per liter
- `outstanding_amount` (numeric) - Amount customer owes
- `created_at` / `updated_at` (timestamp)
- Unique constraint on (user_id, phone)

#### 3. **deliveries**
Tracks milk deliveries to customers.
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `customer_id` (uuid) - Foreign key to customers
- `liters_delivered` (numeric) - Quantity delivered
- `rate_used` (numeric) - Rate applied
- `delivery_date` (date) - Date of delivery
- `notes` (text, optional) - Additional notes
- `created_at` / `updated_at` (timestamp)

#### 4. **payments**
Records payment transactions from customers.
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `customer_id` (uuid) - Foreign key to customers
- `amount` (numeric) - Payment amount
- `payment_method` (text) - 'cash', 'upi', 'card', 'bank'
- `payment_date` (date) - Date of payment
- `reference_id` (text, optional) - Transaction reference
- `notes` (text, optional) - Payment notes
- `created_at` / `updated_at` (timestamp)

#### 5. **bills**
Monthly billing records for customers.
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `customer_id` (uuid) - Foreign key to customers
- `month` (date) - Billing month (first day)
- `total_liters` (numeric) - Total liters delivered
- `total_amount` (numeric) - Total bill amount
- `paid_amount` (numeric) - Amount paid
- `status` (text) - 'draft', 'sent', 'paid', 'partial'
- `sent_via_whatsapp` (boolean) - WhatsApp delivery status
- `created_at` / `updated_at` (timestamp)
- Unique constraint on (user_id, customer_id, month)

#### 6. **subscription_payments**
Tracks Premium plan subscription payments.
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `amount` (numeric) - Payment amount
- `plan` (text) - 'plus' or 'pro'
- `period` (text) - 'monthly' or 'annual'
- `razorpay_order_id` (text, optional) - Razorpay order ID
- `razorpay_payment_id` (text, optional) - Razorpay payment ID
- `status` (text) - 'pending', 'completed', 'failed'
- `payment_date` (date) - Payment date
- `expires_at` (date) - Subscription expiry
- `created_at` / `updated_at` (timestamp)

## Security

All tables have Row-Level Security (RLS) enabled with the following policies:

### Authentication
- Only authenticated users can access data
- Users can only access their own data (filtered by `user_id`)

### Policies
- **SELECT**: Users can view their own records
- **INSERT**: Users can create records with their own `user_id`
- **UPDATE**: Users can update only their own records
- **DELETE**: Users can delete only their own records

## API Services

### Authentication (`src/lib/auth.ts`)
```typescript
// Sign up with email
authService.signUpWithEmail(email, password, name, phone)

// Sign in
authService.signInWithEmail(email, password)

// Sign out
authService.signOut()

// Get current user
authService.getCurrentUser()

// Get user profile
authService.getUserProfile()

// Listen to auth state changes
authService.onAuthStateChange(callback)
```

### Customers (`src/lib/customerService.ts`)
```typescript
// Create customer
customerService.createCustomer(userId, customerData)

// Get all customers
customerService.getCustomers(userId)

// Get single customer
customerService.getCustomer(customerId, userId)

// Update customer
customerService.updateCustomer(customerId, userId, updates)

// Delete customer
customerService.deleteCustomer(customerId, userId)

// Update outstanding amount
customerService.updateOutstandingAmount(customerId, userId, amount)
```

### Deliveries (`src/lib/deliveryService.ts`)
```typescript
// Create delivery
deliveryService.createDelivery(userId, deliveryData)

// Get deliveries
deliveryService.getDeliveries(userId, filters)

// Get deliveries by month
deliveryService.getDeliveriesByMonth(userId, month)

// Get today's deliveries
deliveryService.getTodayDeliveries(userId)

// Update delivery
deliveryService.updateDelivery(deliveryId, userId, updates)

// Delete delivery
deliveryService.deleteDelivery(deliveryId, userId)
```

### Payments (`src/lib/paymentService.ts`)
```typescript
// Create payment
paymentService.createPayment(userId, paymentData)

// Get payments
paymentService.getPayments(userId, filters)

// Get customer payments
paymentService.getCustomerPayments(userId, customerId, month)

// Update payment
paymentService.updatePayment(paymentId, userId, updates)

// Delete payment
paymentService.deletePayment(paymentId, userId)
```

### Bills (`src/lib/billService.ts`)
```typescript
// Generate bill for month
billService.generateBillForMonth(userId, customerId, month)

// Get bills
billService.getBills(userId, filters)

// Get single bill
billService.getBill(billId, userId)

// Update bill status
billService.updateBillStatus(billId, userId, status)

// Mark bill sent via WhatsApp
billService.markBillSentViaWhatsApp(billId, userId)

// Get outstanding bills
billService.getOutstandingBills(userId)
```

## Context Hooks

### Authentication Context (`src/contexts/AuthContext.tsx`)
```typescript
const { user, loading, error, signUp, signIn, signOut } = useAuth()
```

### Customer Context (`src/contexts/CustomerContext.tsx`)
```typescript
const {
  customers,
  loading,
  error,
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
} = useCustomers()
```

## Usage Example

### Fetching Customers
```typescript
import { useAuth } from './contexts/AuthContext'
import { useCustomers } from './contexts/CustomerContext'

function MyComponent() {
  const { user } = useAuth()
  const { customers, fetchCustomers } = useCustomers()

  useEffect(() => {
    if (user) {
      fetchCustomers()
    }
  }, [user])

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  )
}
```

### Creating a Customer
```typescript
const { createCustomer } = useCustomers()

const handleAddCustomer = async () => {
  try {
    const newCustomer = await createCustomer({
      name: 'John Doe',
      phone: '+91 98765 43210',
      milk_type: 'cow',
      daily_liters: 3,
      rate_per_liter: 60,
      outstanding_amount: 0,
    })
    console.log('Customer created:', newCustomer)
  } catch (error) {
    console.error('Failed to create customer:', error)
  }
}
```

### Recording a Delivery
```typescript
import { deliveryService } from './lib/deliveryService'

const handleAddDelivery = async (userId: string, customerId: string) => {
  try {
    const delivery = await deliveryService.createDelivery(userId, {
      customer_id: customerId,
      liters_delivered: 3,
      rate_used: 60,
      delivery_date: new Date().toISOString().split('T')[0],
    })
    console.log('Delivery recorded:', delivery)
  } catch (error) {
    console.error('Failed to record delivery:', error)
  }
}
```

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Error Handling

All service methods throw errors that can be caught:

```typescript
try {
  await customerService.createCustomer(userId, data)
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(message)
}
```

## RLS Security Notes

1. **Data Isolation**: Each user's data is completely isolated
2. **No Admin Access**: Front-end can only access data through RLS policies
3. **Automatic Filtering**: Database automatically filters results based on `auth.uid()`
4. **No Cross-User Access**: Users cannot access other users' data even with direct queries

## Testing the Integration

1. Create a test account via the login page
2. Add a customer
3. Record deliveries
4. Create payments
5. Generate bills
6. All data persists in Supabase

## Troubleshooting

### No data appearing
- Check that you're authenticated (check browser console)
- Verify RLS policies are enabled on tables
- Check Network tab for SQL errors

### Authentication issues
- Ensure environment variables are set correctly
- Check Supabase Auth settings in dashboard
- Verify email confirmation is disabled (if using email login)

### Permission denied errors
- Confirm authenticated user is logged in
- Check RLS policies match user ID
- Verify table foreign keys are correct
