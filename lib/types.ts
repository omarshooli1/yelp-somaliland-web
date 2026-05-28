import type { CategoryId } from './categories';

export type Business = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  rating: number;
  review_count: number;
  verified: boolean;
};

export type Review = {
  id: string;
  business_id: string;
  user_id: string | null;
  rating: number;
  comment: string;
  images: string[];
  created_at: string;
};

export type MenuItem = {
  id: string;
  business_id: string;
  name: string;
  description: string;
  price_usd: number;
  image: string | null;
  available: boolean;
};

export type DeliveryOrderStatus = 'open' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';

export type DeliveryOrderItem = {
  menu_item_id: string;
  name: string;
  quantity: number;
  price_usd: number;
};

export type DeliveryOrder = {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  items: DeliveryOrderItem[];
  subtotal_usd: number;
  delivery_fee_usd: number;
  total_usd: number;
  status: DeliveryOrderStatus;
  driver_id: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  created_at: string;
  businesses?: Business;
};

export type Product = {
  id: string;
  business_id: string | null;
  vendor_id?: string | null;
  seller_name: string;
  seller_phone: string;
  title: string;
  category: string;
  description: string;
  price_usd: number;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  status: 'active' | 'sold' | 'paused' | 'removed';
  verified_seller: boolean;
  created_at?: string;
};

export type MarketplaceOrder = {
  id: string;
  product_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_address: string | null;
  quantity: number;
  total_usd: number;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
};

export type Vendor = {
  id: string;
  business_id: string | null;
  owner_user_id: string | null;
  vendor_name: string;
  owner_name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  description: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  cover_url: string | null;
  rating: number;
  review_count: number;
  verified: boolean;
  status: 'pending' | 'active' | 'paused' | 'rejected';
  created_at?: string;
};

export type ProductReview = {
  id: string;
  product_id: string | null;
  vendor_id: string | null;
  reviewer_name: string;
  reviewer_phone: string | null;
  rating: number;
  comment: string;
  images: string[];
  created_at: string;
};

export type TaxiRideStatus = 'open' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export type TaxiRide = {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  dropoff_address: string;
  dropoff_latitude: number | null;
  dropoff_longitude: number | null;
  city: string;
  passenger_count: number;
  notes: string;
  estimated_fare_usd: number | null;
  status: TaxiRideStatus;
  driver_id: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  vehicle_label: string | null;
  created_at: string;
};
