import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  name: string;
  company?: string;
  formula?: string;
  quantity: number;
  price: number;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  product_id?: string;
  product_name: string;
  company?: string;
  customer_name?: string;
  phone_number?: string;
  quantity: number;
  price: number;
  total: number;
  user_id?: string;
  sale_date: string;
  created_at: string;
}

export interface StockEntry {
  id: string;
  product_id?: string;
  product_name: string;
  company?: string;
  formula?: string;
  quantity: number;
  entry_type: string;
  user_id?: string;
  entry_date: string;
  created_at: string;
}

// Products queries and mutations
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...product, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProductQuantity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ quantity })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product quantity",
        variant: "destructive",
      });
    },
  });
};

// Sales queries and mutations
export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });
      
      if (error) throw error;
      return data as Sale[];
    },
  });
};

export const useAddSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateProductQuantity = useUpdateProductQuantity();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sale: Omit<Sale, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('sales')
        .insert([{ ...sale, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      
      // Update product quantity if product_id is provided
      if (variables.product_id) {
        // Get current product and reduce quantity
        queryClient.setQueryData(['products'], (oldData: Product[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(product => 
            product.id === variables.product_id 
              ? { ...product, quantity: Math.max(0, product.quantity - variables.quantity) }
              : product
          );
        });
        
        // Also update in the database
        supabase
          .from('products')
          .select('quantity')
          .eq('id', variables.product_id)
          .single()
          .then(({ data: productData, error }) => {
            if (!error && productData) {
              const newQuantity = Math.max(0, productData.quantity - variables.quantity);
              updateProductQuantity.mutate({ id: variables.product_id!, quantity: newQuantity });
            }
          });
      }
      
      toast({
        title: "Success",
        description: "Sale recorded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      });
    },
  });
};

// Stock entries queries and mutations
export const useStockEntries = () => {
  return useQuery({
    queryKey: ['stock_entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_entries')
        .select('*')
        .order('entry_date', { ascending: false });
      
      if (error) throw error;
      return data as StockEntry[];
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });
};

export const useAddStockEntry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entry: Omit<StockEntry, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('stock_entries')
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock_entries'] });
      toast({
        title: "Success",
        description: "Stock entry logged successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log stock entry",
        variant: "destructive",
      });
    },
  });
};