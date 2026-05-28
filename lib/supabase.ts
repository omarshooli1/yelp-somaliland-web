import { createClient } from '@supabase/supabase-js';
import type { Business, Review } from './types';
import { sampleBusinesses, sampleReviews } from './sample-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfiguredValue = (value: string | undefined) => {
  if (!value) return false;
  if (value.includes('your-project') || value.includes('your-anon-key')) return false;
  return true;
};

export const hasSupabaseConfig = isConfiguredValue(supabaseUrl) && isConfiguredValue(supabaseAnonKey);

export const supabase = (() => {
  if (!hasSupabaseConfig) return null;

  try {
    return createClient(supabaseUrl as string, supabaseAnonKey as string);
  } catch (error) {
    return null;
  }
})();

const toNumber = (value: unknown, fallback = 0) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const normalizeBusiness = (business: Record<string, unknown>): Business => ({
  id: String(business.id),
  name: String(business.name || ''),
  category: business.category as Business['category'],
  description: String(business.description || ''),
  phone: business.phone ? String(business.phone) : null,
  whatsapp: business.whatsapp ? String(business.whatsapp) : null,
  address: String(business.address || ''),
  city: String(business.city || ''),
  latitude: business.latitude === null || business.latitude === undefined ? null : toNumber(business.latitude),
  longitude: business.longitude === null || business.longitude === undefined ? null : toNumber(business.longitude),
  images: Array.isArray(business.images) ? business.images.map(String) : [],
  rating: toNumber(business.rating),
  review_count: Math.trunc(toNumber(business.review_count)),
  verified: Boolean(business.verified)
});

type BusinessFilters = {
  query?: string;
  category?: string;
};

const filterLocalBusinesses = ({ query, category }: BusinessFilters = {}) => {
  const cleanQuery = query?.trim().toLowerCase();

  return sampleBusinesses.filter((business) => {
    const matchesQuery = !cleanQuery
      || business.name.toLowerCase().includes(cleanQuery)
      || business.description.toLowerCase().includes(cleanQuery)
      || business.address.toLowerCase().includes(cleanQuery);
    const matchesCategory = !category || business.category === category;

    return matchesQuery && matchesCategory;
  });
};

export const getBusinesses = async (filters: BusinessFilters = {}): Promise<Business[]> => {
  if (!supabase) return filterLocalBusinesses(filters);

  let request = supabase
    .from('businesses')
    .select('*')
    .order('verified', { ascending: false })
    .order('rating', { ascending: false });

  if (filters.category) request = request.eq('category', filters.category);
  if (filters.query?.trim()) {
    const query = filters.query.trim();
    request = request.or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`);
  }

  const { data, error } = await request;
  if (error) return filterLocalBusinesses(filters);

  return (data || []).map((business) => normalizeBusiness(business));
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  if (!supabase) return sampleBusinesses.find((business) => business.id === id) || null;

  const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single();
  if (error) return sampleBusinesses.find((business) => business.id === id) || null;

  return normalizeBusiness(data);
};

export const getReviewsForBusiness = async (businessId: string): Promise<Review[]> => {
  if (!supabase) return sampleReviews.filter((review) => review.business_id === businessId);

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) return sampleReviews.filter((review) => review.business_id === businessId);

  return (data || []) as Review[];
};
