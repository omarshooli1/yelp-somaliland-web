import { createClient } from '@supabase/supabase-js';
import { sampleDeliveryOrders } from './delivery-data';
import { sampleProducts, sampleVendors } from './marketplace-data';
import { sampleBusinesses } from './sample-data';
import { sampleTaxiRides } from './taxi-data';
import { normalizeBusiness } from './supabase';
import type { Business, DeliveryOrder, Product, TaxiRide, Vendor } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasAdminSupabase = Boolean(
  supabaseUrl
    && serviceRoleKey
    && !supabaseUrl.includes('your-project')
    && !serviceRoleKey.includes('your-service-role-key')
);

export const adminSupabase = hasAdminSupabase
  ? createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: { persistSession: false }
    })
  : null;

const toNumber = (value: unknown, fallback = 0) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

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

const normalizeDeliveryOrder = (order: Record<string, unknown>): DeliveryOrder => ({
  id: String(order.id),
  business_id: String(order.business_id),
  customer_name: String(order.customer_name || ''),
  customer_phone: String(order.customer_phone || ''),
  delivery_address: String(order.delivery_address || ''),
  delivery_latitude: order.delivery_latitude === null || order.delivery_latitude === undefined ? null : toNumber(order.delivery_latitude),
  delivery_longitude: order.delivery_longitude === null || order.delivery_longitude === undefined ? null : toNumber(order.delivery_longitude),
  items: Array.isArray(order.items) ? order.items as DeliveryOrder['items'] : [],
  subtotal_usd: toNumber(order.subtotal_usd),
  delivery_fee_usd: toNumber(order.delivery_fee_usd),
  total_usd: toNumber(order.total_usd),
  status: order.status as DeliveryOrder['status'],
  driver_id: order.driver_id ? String(order.driver_id) : null,
  driver_name: order.driver_name ? String(order.driver_name) : null,
  driver_phone: order.driver_phone ? String(order.driver_phone) : null,
  created_at: String(order.created_at || '')
});

const normalizeTaxiRide = (ride: Record<string, unknown>): TaxiRide => ({
  id: String(ride.id),
  customer_name: String(ride.customer_name || ''),
  customer_phone: String(ride.customer_phone || ''),
  pickup_address: String(ride.pickup_address || ''),
  pickup_latitude: ride.pickup_latitude === null || ride.pickup_latitude === undefined ? null : toNumber(ride.pickup_latitude),
  pickup_longitude: ride.pickup_longitude === null || ride.pickup_longitude === undefined ? null : toNumber(ride.pickup_longitude),
  dropoff_address: String(ride.dropoff_address || ''),
  dropoff_latitude: ride.dropoff_latitude === null || ride.dropoff_latitude === undefined ? null : toNumber(ride.dropoff_latitude),
  dropoff_longitude: ride.dropoff_longitude === null || ride.dropoff_longitude === undefined ? null : toNumber(ride.dropoff_longitude),
  city: String(ride.city || ''),
  passenger_count: Math.max(1, Math.trunc(toNumber(ride.passenger_count, 1))),
  notes: String(ride.notes || ''),
  estimated_fare_usd: ride.estimated_fare_usd === null || ride.estimated_fare_usd === undefined ? null : toNumber(ride.estimated_fare_usd),
  status: ride.status as TaxiRide['status'],
  driver_id: ride.driver_id ? String(ride.driver_id) : null,
  driver_name: ride.driver_name ? String(ride.driver_name) : null,
  driver_phone: ride.driver_phone ? String(ride.driver_phone) : null,
  vehicle_label: ride.vehicle_label ? String(ride.vehicle_label) : null,
  created_at: String(ride.created_at || '')
});

export const getAdminDashboardData = async () => {
  if (!adminSupabase) {
    return {
      businesses: sampleBusinesses,
      vendors: sampleVendors,
      products: sampleProducts,
      deliveryOrders: sampleDeliveryOrders,
      taxiRides: sampleTaxiRides,
      usingDemoData: true
    };
  }

  const [businesses, vendors, products, deliveryOrders, taxiRides] = await Promise.all([
    adminSupabase.from('businesses').select('*').order('created_at', { ascending: false }).limit(50),
    adminSupabase.from('vendors').select('*').order('created_at', { ascending: false }).limit(50),
    adminSupabase.from('products').select('*').order('created_at', { ascending: false }).limit(50),
    adminSupabase.from('delivery_orders').select('*').order('created_at', { ascending: false }).limit(50),
    adminSupabase.from('taxi_rides').select('*').order('created_at', { ascending: false }).limit(50)
  ]);

  return {
    businesses: businesses.data?.map((business) => normalizeBusiness(business)) || [],
    vendors: vendors.data?.map((vendor) => normalizeVendor(vendor)) || [],
    products: products.data?.map((product) => normalizeProduct(product)) || [],
    deliveryOrders: deliveryOrders.data?.map((order) => normalizeDeliveryOrder(order)) || [],
    taxiRides: taxiRides.data?.map((ride) => normalizeTaxiRide(ride)) || [],
    usingDemoData: false
  };
};
