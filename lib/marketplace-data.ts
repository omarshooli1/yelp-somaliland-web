import type { Product, ProductReview, Vendor } from './types';

export const productCategories = [
  'Food',
  'Groceries',
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Services'
];

export const sampleProducts: Product[] = [
  {
    id: 'fresh-camel-milk',
    business_id: null,
    vendor_id: 'hodan-market',
    seller_name: 'Hodan Market',
    seller_phone: '+252 63 600 1111',
    title: 'Fresh camel milk',
    category: 'Groceries',
    description: 'Fresh camel milk available for same-day pickup or delivery in Hargeisa.',
    price_usd: 4,
    city: 'Hargeisa',
    address: 'Jigjiga Yar',
    latitude: 9.5558,
    longitude: 44.0614,
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1200'],
    status: 'active',
    verified_seller: true
  },
  {
    id: 'samsung-phone',
    business_id: null,
    vendor_id: 'telesom-tech-corner',
    seller_name: 'Telesom Tech Corner',
    seller_phone: '+252 63 600 2222',
    title: 'Samsung Android phone',
    category: 'Electronics',
    description: 'Clean Android phone, dual SIM, charger included.',
    price_usd: 120,
    city: 'Hargeisa',
    address: 'Downtown Hargeisa',
    latitude: 9.5612,
    longitude: 44.0672,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200'],
    status: 'active',
    verified_seller: false
  },
  {
    id: 'barber-home-service',
    business_id: 'classic-cuts-barber',
    vendor_id: 'classic-cuts-vendor',
    seller_name: 'Classic Cuts Barber',
    seller_phone: '+252 63 470 7700',
    title: 'Home haircut service',
    category: 'Services',
    description: 'Book a barber to come to your home or office in Hargeisa.',
    price_usd: 8,
    city: 'Hargeisa',
    address: 'Shaab Area',
    latitude: 9.5662,
    longitude: 44.0488,
    images: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200'],
    status: 'active',
    verified_seller: true
  }
];

export const sampleVendors: Vendor[] = [
  {
    id: 'hodan-market',
    business_id: null,
    owner_user_id: null,
    vendor_name: 'Hodan Market',
    owner_name: 'Hodan Ahmed',
    phone: '+252 63 600 1111',
    whatsapp: '+252 63 600 1111',
    email: 'hodan@example.com',
    description: 'Local grocery seller offering fresh food, pantry items, and delivery around Hargeisa.',
    city: 'Hargeisa',
    address: 'Jigjiga Yar',
    latitude: 9.5558,
    longitude: 44.0614,
    logo_url: null,
    cover_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200',
    rating: 4.6,
    review_count: 12,
    verified: true,
    status: 'active'
  },
  {
    id: 'telesom-tech-corner',
    business_id: null,
    owner_user_id: null,
    vendor_name: 'Telesom Tech Corner',
    owner_name: 'Abdi Yusuf',
    phone: '+252 63 600 2222',
    whatsapp: '+252 63 600 2222',
    email: 'tech@example.com',
    description: 'Phones, accessories, chargers, and small electronics in downtown Hargeisa.',
    city: 'Hargeisa',
    address: 'Downtown Hargeisa',
    latitude: 9.5612,
    longitude: 44.0672,
    logo_url: null,
    cover_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200',
    rating: 4.2,
    review_count: 7,
    verified: false,
    status: 'active'
  }
];

export const sampleProductReviews: ProductReview[] = [
  {
    id: 'product-review-1',
    product_id: 'fresh-camel-milk',
    vendor_id: 'hodan-market',
    reviewer_name: 'Ayan',
    reviewer_phone: null,
    rating: 5,
    comment: 'Fresh product and fast delivery.',
    images: [],
    created_at: new Date().toISOString()
  },
  {
    id: 'vendor-review-1',
    product_id: null,
    vendor_id: 'hodan-market',
    reviewer_name: 'Mohamed',
    reviewer_phone: null,
    rating: 4,
    comment: 'Good communication and fair prices.',
    images: [],
    created_at: new Date().toISOString()
  }
];
