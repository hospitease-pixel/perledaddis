import { supabase } from '@/integrations/supabase/client';
import * as Sonner from 'sonner';

export interface Product {
  id: string;
  brand: string;
  name: string;
  size: string;
  category: 'For Her' | 'For Him' | 'Unisex';
  price: number;
  imageUrl: string;
}

export interface Order {
  clientName: string;
  phone: string;
  neighborhood: string;
  items: any;
  total: number;
}

function toastSupabaseError(error: any, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = String(error.message || fallback);
    const details = 'details' in error ? String(error.details) : undefined;
    const text = details ? msg + ' — ' + details : msg || fallback;
    Sonner.toast.error(text);
    return;
  }
  Sonner.toast.error(fallback);
}

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    toastSupabaseError(error, 'Could not fetch products.');
    return [];
  }

  return (data || []).map(p => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    size: p.size,
    category: p.category as any,
    price: p.price,
    imageUrl: p.image_url,
  }));
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      brand: product.brand,
      name: product.name,
      size: product.size,
      category: product.category,
      price: product.price,
      image_url: product.imageUrl,
    }])
    .select()
    .single();

  if (error) {
    toastSupabaseError(error, 'Could not add product.');
    return null;
  }
  return data;
};

export const updateProduct = async (product: Product) => {
  const { error } = await supabase
    .from('products')
    .update({
      brand: product.brand,
      name: product.name,
      size: product.size,
      category: product.category,
      price: product.price,
      image_url: product.imageUrl,
    })
    .eq('id', product.id);

  if (error) {
    toastSupabaseError(error, 'Could not update product.');
    return false;
  }
  return true;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    toastSupabaseError(error, 'Could not delete product.');
    return false;
  }
  return true;
};

export const saveOrder = async (order: Order) => {
  const { error } = await supabase
    .from('orders')
    .insert([{
      client_name: order.clientName,
      phone: order.phone,
      neighborhood: order.neighborhood,
      items: order.items,
      total: order.total,
    }]);

  if (error) {
    toastSupabaseError(error, 'Could not save order record.');
    return false;
  }
  return true;
};
