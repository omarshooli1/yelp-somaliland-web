import type { DeliveryOrder, DeliveryOrderItem, MenuItem } from './types';
import { sampleDeliveryOrders, sampleMenuItems } from './delivery-data';
import { supabase } from './supabase';
import { normalizeBusiness } from './supabase';

type CreateOrderInput = {
  business_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_latitude?: number | null;
  delivery_longitude?: number | null;
  items: DeliveryOrderItem[];
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeMenuItem = (item: Record<string, unknown>): MenuItem => ({
  id: String(item.id),
  business_id: String(item.business_id),
  name: String(item.name || ''),
  description: String(item.description || ''),
  price_usd: toNumber(item.price_usd),
  image: item.image ? String(item.image) : null,
  available: Boolean(item.available)
});

const normalizeOrderItems = (items: unknown): DeliveryOrderItem[] => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const orderItem = item as Record<string, unknown>;

    return {
      menu_item_id: String(orderItem.menu_item_id || ''),
      name: String(orderItem.name || ''),
      quantity: Math.max(0, Math.trunc(toNumber(orderItem.quantity))),
      price_usd: toNumber(orderItem.price_usd)
    };
  });
};

const normalizeDeliveryOrder = (order: Record<string, unknown>): DeliveryOrder => ({
  id: String(order.id),
  business_id: String(order.business_id),
  customer_name: String(order.customer_name || ''),
  customer_phone: String(order.customer_phone || ''),
  delivery_address: String(order.delivery_address || ''),
  delivery_latitude: order.delivery_latitude === null || order.delivery_latitude === undefined ? null : toNumber(order.delivery_latitude),
  delivery_longitude: order.delivery_longitude === null || order.delivery_longitude === undefined ? null : toNumber(order.delivery_longitude),
  items: normalizeOrderItems(order.items),
  subtotal_usd: toNumber(order.subtotal_usd),
  delivery_fee_usd: toNumber(order.delivery_fee_usd),
  total_usd: toNumber(order.total_usd),
  status: order.status as DeliveryOrder['status'],
  driver_id: order.driver_id ? String(order.driver_id) : null,
  driver_name: order.driver_name ? String(order.driver_name) : null,
  driver_phone: order.driver_phone ? String(order.driver_phone) : null,
  created_at: String(order.created_at || ''),
  businesses: order.businesses && typeof order.businesses === 'object'
    ? normalizeBusiness(order.businesses as Record<string, unknown>)
    : undefined
});

export const getMenuItemsForBusiness = async (businessId: string): Promise<MenuItem[]> => {
  if (!supabase) return sampleMenuItems.filter((item) => item.business_id === businessId);

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('business_id', businessId)
    .eq('available', true)
    .order('name');

  if (error) return sampleMenuItems.filter((item) => item.business_id === businessId);

  return (data || []).map((item) => normalizeMenuItem(item));
};

export const createDeliveryOrder = async (input: CreateOrderInput) => {
  const subtotal = input.items.reduce((sum, item) => sum + item.price_usd * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  if (!supabase) {
    return {
      id: `demo-${Date.now()}`,
      subtotal_usd: subtotal,
      delivery_fee_usd: deliveryFee,
      total_usd: total
    };
  }

  const { data, error } = await supabase
    .from('delivery_orders')
    .insert({
      ...input,
      subtotal_usd: subtotal,
      delivery_fee_usd: deliveryFee,
      total_usd: total,
      status: 'open'
    })
    .select('id, subtotal_usd, delivery_fee_usd, total_usd')
    .single();

  if (error) throw error;
  return data;
};

export const getOpenDeliveryOrders = async (): Promise<DeliveryOrder[]> => {
  if (!supabase) return sampleDeliveryOrders;

  const { data, error } = await supabase
    .from('delivery_orders')
    .select('*, businesses(*)')
    .in('status', ['open', 'accepted'])
    .order('created_at', { ascending: false });

  if (error) return sampleDeliveryOrders;

  return (data || []).map((order) => normalizeDeliveryOrder(order));
};

export const acceptDeliveryOrder = async ({
  orderId,
  driverName,
  driverPhone
}: {
  orderId: string;
  driverName: string;
  driverPhone: string;
}) => {
  if (!supabase) return { id: orderId, status: 'accepted' };

  const { data, error } = await supabase
    .from('delivery_orders')
    .update({
      status: 'accepted',
      driver_name: driverName,
      driver_phone: driverPhone,
      accepted_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('status', 'open')
    .select('id, status')
    .single();

  if (error) throw error;
  return data;
};
