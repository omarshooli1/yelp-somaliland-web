import type { ServiceCategory, ServiceProvider, ServiceReview } from './types';
import { sampleServiceProviders, sampleServiceReviews } from './services-data';
import { supabase } from './supabase';

export const getServiceProviders = async ({
  query,
  category,
}: { query?: string; category?: string } = {}): Promise<ServiceProvider[]> => {
  const cleanQuery = query?.trim().toLowerCase();

  if (!supabase) {
    return sampleServiceProviders.filter((p) => {
      const matchesQuery = !cleanQuery
        || p.name.toLowerCase().includes(cleanQuery)
        || p.description.toLowerCase().includes(cleanQuery)
        || p.city.toLowerCase().includes(cleanQuery);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory && p.available;
    });
  }

  let request = supabase
    .from('service_providers')
    .select('*')
    .eq('available', true)
    .order('verified', { ascending: false })
    .order('rating', { ascending: false });

  if (category) request = request.eq('category', category);
  if (query?.trim()) {
    const term = query.trim();
    request = request.or(`name.ilike.%${term}%,description.ilike.%${term}%,city.ilike.%${term}%`);
  }

  const { data, error } = await request;
  if (error) return sampleServiceProviders;
  return (data || []) as ServiceProvider[];
};

export const getServiceProviderById = async (id: string): Promise<ServiceProvider | null> => {
  if (!supabase) return sampleServiceProviders.find((p) => p.id === id) || null;

  const { data, error } = await supabase.from('service_providers').select('*').eq('id', id).single();
  if (error) return sampleServiceProviders.find((p) => p.id === id) || null;
  return data as ServiceProvider;
};

export const getServiceReviews = async (providerId: string): Promise<ServiceReview[]> => {
  if (!supabase) return sampleServiceReviews.filter((r) => r.provider_id === providerId);

  const { data, error } = await supabase
    .from('service_reviews')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) return sampleServiceReviews.filter((r) => r.provider_id === providerId);
  return (data || []) as ServiceReview[];
};

export const createServiceReview = async (
  input: Omit<ServiceReview, 'id' | 'created_at'>
): Promise<{ id: string }> => {
  if (!supabase) return { id: `demo-review-${Date.now()}` };

  const { data, error } = await supabase
    .from('service_reviews')
    .insert({ ...input })
    .select('id')
    .single();

  if (error) throw error;
  return data;
};
