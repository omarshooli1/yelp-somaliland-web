import type { Business, Review } from './types';

export const sampleBusinesses: Business[] = [
  {
    id: 'damal-restaurant',
    name: 'Damal Restaurant',
    category: 'restaurants',
    description: 'Somali rice, grilled meats, fresh juices, and family dining near central Hargeisa.',
    phone: '+252 63 410 1000',
    whatsapp: '+252 63 410 1000',
    address: 'Maka Al Mukarama Road',
    city: 'Hargeisa',
    latitude: 9.5609,
    longitude: 44.0651,
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200'],
    rating: 4.7,
    review_count: 38,
    verified: true
  },
  {
    id: 'hiddo-cafe',
    name: 'Hiddo Cafe',
    category: 'cafes',
    description: 'Modern cafe with Somali tea, espresso, breakfast plates, and quiet seating.',
    phone: '+252 63 420 2200',
    whatsapp: '+252 63 420 2200',
    address: 'Jigjiga Yar',
    city: 'Hargeisa',
    latitude: 9.5558,
    longitude: 44.0614,
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200'],
    rating: 4.5,
    review_count: 24,
    verified: true
  },
  {
    id: 'maansoor-hotel',
    name: 'Maansoor Hotel',
    category: 'hotels',
    description: 'Comfortable hotel with conference rooms, gardens, restaurant, and airport access.',
    phone: '+252 63 430 3300',
    whatsapp: '+252 63 430 3300',
    address: 'Airport Road',
    city: 'Hargeisa',
    latitude: 9.5471,
    longitude: 44.0882,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200'],
    rating: 4.6,
    review_count: 56,
    verified: true
  },
  {
    id: 'shaafi-pharmacy',
    name: 'Shaafi Pharmacy',
    category: 'pharmacies',
    description: 'Prescription medicine, wellness items, and pharmacist support near the city center.',
    phone: '+252 63 440 4400',
    whatsapp: '+252 63 440 4400',
    address: 'Independence Road',
    city: 'Hargeisa',
    latitude: 9.5622,
    longitude: 44.0702,
    images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200'],
    rating: 4.3,
    review_count: 19,
    verified: true
  },
  {
    id: 'classic-cuts-barber',
    name: 'Classic Cuts Barber',
    category: 'barbers',
    description: 'Haircuts, beard trims, grooming packages, and walk-in service.',
    phone: '+252 63 470 7700',
    whatsapp: '+252 63 470 7700',
    address: 'Shaab Area',
    city: 'Hargeisa',
    latitude: 9.5662,
    longitude: 44.0488,
    images: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200'],
    rating: 4.8,
    review_count: 42,
    verified: true
  }
];

export const sampleReviews: Review[] = [
  {
    id: 'review-1',
    business_id: 'damal-restaurant',
    user_id: null,
    rating: 5,
    comment: 'Great food and quick service. The rice and grilled camel were excellent.',
    images: [],
    created_at: new Date().toISOString()
  },
  {
    id: 'review-2',
    business_id: 'damal-restaurant',
    user_id: null,
    rating: 4,
    comment: 'Clean place, good family seating, and fair prices.',
    images: [],
    created_at: new Date().toISOString()
  }
];
