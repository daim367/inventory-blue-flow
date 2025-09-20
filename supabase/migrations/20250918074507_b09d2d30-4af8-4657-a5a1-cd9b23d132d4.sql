-- Ensure RLS is enabled on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

DROP POLICY IF EXISTS "Users can view their own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can create their own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can update their own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can delete their own sales" ON public.sales;

DROP POLICY IF EXISTS "Users can view their own stock entries" ON public.stock_entries;
DROP POLICY IF EXISTS "Users can create their own stock entries" ON public.stock_entries;
DROP POLICY IF EXISTS "Users can update their own stock entries" ON public.stock_entries;
DROP POLICY IF EXISTS "Users can delete their own stock entries" ON public.stock_entries;

-- Products table RLS policies
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

-- Sales table RLS policies
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

-- Stock entries table RLS policies
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