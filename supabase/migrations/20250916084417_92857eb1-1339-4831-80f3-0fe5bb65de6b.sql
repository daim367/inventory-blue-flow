-- Add customer_name and phone_number to sales table
ALTER TABLE public.sales 
ADD COLUMN customer_name TEXT,
ADD COLUMN phone_number TEXT;