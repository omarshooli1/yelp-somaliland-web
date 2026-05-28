import type { MarketplaceOrder, Product, ProductReview, Vendor } from './types';
import { sampleProductReviews, sampleProducts, sampleVendors } from './marketplace-data';
import { supabase } from './supabase';

const toNumber = (value: unknown, fallback = 0) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeProduct = (product: Record<string, unknown>): Product => ({
  id: String(product.id),
  business_id: product.business_id ? String(product.business_id) : null,
  vendor_id: product.vendor_id ? String(product.vendor_id) : null,
  seller_name: String(product.seller_name || ''),
  seller_phone: String(product.seller_phone || ''),
  title: String(product.title || ''),
  category: String(product.category || ''),
  description: String(product.description || ''),
  price_usd: toNumber(product.price_usd),
  city: String(product.city || ''),
  address: product.address ? String(product.address) : null,
  latitude: product.latitude === null || product.latitude === undefined ? null : toNumber(product.latitude),
  longitude: product.longitude === null || product.longitude === undefined ? null : toNumber(product.longitude),
  images: Array.isArray(product.images) ? product.images.map(String) : [],
  status: product.status as Product['status'],
  verified_seller: Boolean(product.verified_seller),
  created_at: product.created_at ? String(product.created_at) : undefined
});

const normalizeVendor = (vendor: Record<string, unknown>): Vendor => ({
  id: String(vendor.id),
  business_id: vendor.business_id ? String(vendor.business_id) : null,
  owner_user_id: vendor.owner_user_id ? String(vendor.owner_user_id) : null,
  vendor_name: String(vendor.vendor_name || ''),
  owner_name: String(vendor.owner_name || ''),
  phone: String(vendor.phone || ''),
  whatsapp: vendor.whatsapp ? String(vendor.whatsapp) : null,
  email: vendor.email ? String(vendor.email) : null,
  description: String(vendor.description || ''),
  city: String(vendor.city || ''),
  address: vendor.address ? String(vendor.address) : null,
  latitude: vendor.latitude === null || vendor.latitude === undefined ? null : toNumber(vendor.latitude),
  longitude: vendor.longitude === null || vendor.longitude === undefined ? null : toNumber(vendor.longitude),
  logo_url: vendor.logo_url ? String(vendor.logo_url) : null,
  cover_url: vendor.cover_url ? String(vendor.cover_url) : null,
  rating: toNumber(vendor.rating),
  review_count: Math.trunc(toNumber(vendor.review_count)),
  verified: Boolean(vendor.verified),
  status: vendor.status as Vendor['status'],
  created_at: vendor.created_at ? String(vendor.created_at) : undefined
});

const normalizeProductReview = (review: Record<string, unknown>): ProductReview => ({
  id: String(review.id),
  product_id: review.product_id ? String(review.product_id) : null,
  vendor_id: review.vendor_id ? String(review.vendor_id) : null,
  reviewer_name: String(review.reviewer_name || ''),
  reviewer_phone: review.reviewer_phone ? String(review.reviewer_phone) : null,
  rating: Math.trunc(toNumber(review.rating)),
  comment: String(review.comment || ''),
  images: Array.isArray(review.images) ? review.images.map(String) : [],
  created_at: String(review.created_at || '')
});

export const getProducts = async ({ query, category }: { query?: string; category?: string } = {}): Promise<Product[]> => {
  const cleanQuery = query?.trim().toLowerCase();

  if (!supabase) {
    return sampleProducts.filter((product) => {
      const matchesQuery = !cleanQuery
        || product.title.toLowerCase().includes(cleanQuery)
        || product.description.toLowerCase().includes(cleanQuery)
        || product.seller_name.toLowerCase().includes(cleanQuery);
      const matchesCategory = !category || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }

  let request = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('verified_seller', { ascending: false })
    .order('created_at', { ascending: false });

  if (category) request = request.eq('category', category);
  if (query?.trim()) {
    const term = query.trim();
    request = request.or(`title.ilike.%${term}%,description.ilike.%${term}%,seller_name.ilike.%${term}%`);
  }

  const { data, error } = await request;
  if (error) return sampleProducts;

  return (data || []).map((product) => normalizeProduct(product));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!supabase) return sampleProducts.find((product) => product.id === id) || null;

  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return sampleProducts.find((product) => product.id === id) || null;

  return normalizeProduct(data);
};

export const getVendors = async (): Promise<Vendor[]> => {
  if (!supabase) return sampleVendors;

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .in('status', ['active', 'pending'])
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return sampleVendors;
  return (data || []).map((vendor) => normalizeVendor(vendor));
};

export const getVendorById = async (id: string): Promise<Vendor | null> => {
  if (!supabase) return sampleVendors.find((vendor) => vendor.id === id) || null;

  const { data, error } = await supabase.from('vendors').select('*').eq('id', id).single();
  if (error) return sampleVendors.find((vendor) => vendor.id === id) || null;
  return normalizeVendor(data);
};

export const getProductsForVendor = async (vendorId: string): Promise<Product[]> => {
  if (!supabase) return sampleProducts.filter((product) => product.vendor_id === vendorId);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) return sampleProducts.filter((product) => product.vendor_id === vendorId);
  return (data || []).map((product) => normalizeProduct(product));
};

export const createVendor = async (input: Omit<Vendor, 'id' | 'rating' | 'review_count' | 'verified' | 'status'>) => {
  if (!supabase) return { id: `demo-vendor-${Date.now()}` };

  const { data, error } = await supabase
    .from('vendors')
    .insert({
      ...input,
      rating: 0,
      review_count: 0,
      verified: false,
      status: 'pending'
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
};

export const createProduct = async (input: Omit<Product, 'id' | 'status' | 'verified_seller'>) => {
  if (!supabase) return { id: `demo-product-${Date.now()}` };

  const { data, error } = await supabase
    .from('products')
    .insert({ ...input, status: 'active', verified_seller: false })
    .select('id')
    .single();

  if (error) throw error;
  return data;
};

export const getProductReviews = async ({
  productId,
  vendorId
}: {
  productId?: string;
  vendorId?: string;
}): Promise<ProductReview[]> => {
  if (!supabase) {
    return sampleProductReviews.filter((review) => {
      const productMatch = productId ? review.product_id === productId : true;
      const vendorMatch = vendorId ? review.vendor_id === vendorId : true;
      return productMatch && vendorMatch;
    });
  }

  let request = supabase.from('product_reviews').select('*').order('created_at', { ascending: false });
  if (productId) request = request.eq('product_id', productId);
  if (vendorId) request = request.eq('vendor_id', vendorId);

  const { data, error } = await request;
  if (error) return [];
  return (data || []).map((review) => normalizeProductReview(review));
};

export const createProductReview = async (input: Omit<ProductReview, 'id' | 'images' | 'created_at'>) => {
  if (!supabase) return { id: `demo-review-${Date.now()}` };

  const { data, error } = await supabase
    .from('product_reviews')
    .insert({ ...input, images: [] })
    .select('id')
    .single();

  if (error) throw error;
  return data;
};

export const createMarketplaceOrder = async ({
  product,
  buyer_name,
  buyer_phone,
  buyer_address,
  quantity
}: {
  product: Product;
  buyer_name: string;
  buyer_phone: string;
  buyer_address?: string;
  quantity: number;
}): Promise<Pick<MarketplaceOrder, 'id' | 'total_usd'>> => {
  const cleanQuantity = Math.max(1, Math.trunc(quantity));
  const total = cleanQuantity * product.price_usd;

  if (!supabase) return { id: `demo-order-${Date.now()}`, total_usd: total };

  const { data, error } = await supabase
    .from('marketplace_orders')
    .insert({
      product_id: product.id,
      buyer_name,
      buyer_phone,
      buyer_address: buyer_address || null,
      quantity: cleanQuantity,
      total_usd: total,
      status: 'new'
    })
    .select('id, total_usd')
    .single();

  if (error) throw error;
  return data;
};
