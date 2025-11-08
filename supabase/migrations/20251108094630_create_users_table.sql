/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User ID from Supabase Auth
      - `email` (text, unique)
      - `phone` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
      - `subscription_plan` (text: 'free', 'plus', 'pro')
      - `subscription_active` (boolean)
      - `subscription_expires` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Users can only read/update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone text UNIQUE,
  name text,
  created_at timestamptz DEFAULT now(),
  subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'plus', 'pro')),
  subscription_active boolean DEFAULT false,
  subscription_expires timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
