-- First, update RLS policies to require authentication
-- Drop existing public policies
DROP POLICY IF EXISTS "Products are publicly accessible" ON public.products;
DROP POLICY IF EXISTS "Sales are publicly accessible" ON public.sales;
DROP POLICY IF EXISTS "Stock entries are publicly accessible" ON public.stock_entries;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sales" 
ON public.sales 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage stock entries" 
ON public.stock_entries 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

create policy "Enable insert for authenticated users only"
on "public"."stock_entries"
for insert to authenticated
with check (true);