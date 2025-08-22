-- Add missing columns to products table to match the current interface
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS formula TEXT;

-- Update stock_entries table to include missing columns for full compatibility
ALTER TABLE public.stock_entries ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.stock_entries ADD COLUMN IF NOT EXISTS formula TEXT;

-- Add company column to sales table for better tracking
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS company TEXT;