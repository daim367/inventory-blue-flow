-- Add user_id column to sales table for user ownership
ALTER TABLE public.sales ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Set existing sales to have no owner (they will need to be claimed or deleted)
-- In production, you might want to assign them to a specific admin user instead
UPDATE public.sales SET user_id = NULL WHERE user_id IS NULL;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage sales" ON public.sales;

-- Create secure RLS policies for sales table
CREATE POLICY "Users can view their own sales" 
ON public.sales 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales" 
ON public.sales 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales" 
ON public.sales 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update products and stock_entries policies to be more secure as well
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage stock entries" ON public.stock_entries;

-- Add user_id to products table
ALTER TABLE public.products ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
UPDATE public.products SET user_id = NULL WHERE user_id IS NULL;

-- Add user_id to stock_entries table  
ALTER TABLE public.stock_entries ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
UPDATE public.stock_entries SET user_id = NULL WHERE user_id IS NULL;

-- Create secure policies for products
CREATE POLICY "Users can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create secure policies for stock_entries
CREATE POLICY "Users can view their own stock entries" 
ON public.stock_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stock entries" 
ON public.stock_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock entries" 
ON public.stock_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock entries" 
ON public.stock_entries 
FOR DELETE 
USING (auth.uid() = user_id);