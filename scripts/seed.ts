import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const businesses = [
  {
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
    name: 'Hargeisa Family Clinic',
    category: 'clinics',
    description: 'General consultation, lab tests, maternal care, and walk-in appointments.',
    phone: '+252 63 450 5500',
    whatsapp: '+252 63 450 5500',
    address: 'New Hargeisa District',
    city: 'Hargeisa',
    latitude: 9.5754,
    longitude: 44.0557,
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200'],
    rating: 4.4,
    review_count: 31,
    verified: true
  },
  {
    name: 'SomFit Gym',
    category: 'gyms',
    description: 'Strength equipment, cardio machines, personal training, and flexible memberships.',
    phone: '+252 63 460 6600',
    whatsapp: '+252 63 460 6600',
    address: '26 June Avenue',
    city: 'Hargeisa',
    latitude: 9.5587,
    longitude: 44.0733,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200'],
    rating: 4.2,
    review_count: 17,
    verified: false
  },
  {
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
  },
  {
    name: 'Horn Supermarket',
    category: 'supermarkets',
    description: 'Groceries, household essentials, imported goods, and fresh produce.',
    phone: '+252 63 480 8800',
    whatsapp: '+252 63 480 8800',
    address: 'Hero Awr Road',
    city: 'Hargeisa',
    latitude: 9.5526,
    longitude: 44.0509,
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200'],
    rating: 4.1,
    review_count: 28,
    verified: false
  }
];

const run = async () => {
  const { error: deleteError } = await supabase
    .from('businesses')
    .delete()
    .in('name', businesses.map((business) => business.name));

  if (deleteError) throw deleteError;

  const { error } = await supabase.from('businesses').insert(businesses);
  if (error) throw error;

  console.log(`Seeded ${businesses.length} Hargeisa businesses.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
