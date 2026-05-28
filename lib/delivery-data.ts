import type { DeliveryOrder, MenuItem } from './types';

export const sampleMenuItems: MenuItem[] = [
  {
    id: 'damal-rice',
    business_id: 'damal-restaurant',
    name: 'Somali Rice with Chicken',
    description: 'Basmati rice, spiced chicken, banana, salad, and house sauce.',
    price_usd: 6.5,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1200',
    available: true
  },
  {
    id: 'damal-grill',
    business_id: 'damal-restaurant',
    name: 'Mixed Grill Plate',
    description: 'Grilled beef, chicken, vegetables, and flatbread.',
    price_usd: 8,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200',
    available: true
  },
  {
    id: 'hiddo-tea',
    business_id: 'hiddo-cafe',
    name: 'Somali Tea and Sambuus',
    description: 'Spiced tea served with three crispy sambuus.',
    price_usd: 3,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=1200',
    available: true
  },
  {
    id: 'hiddo-breakfast',
    business_id: 'hiddo-cafe',
    name: 'Cafe Breakfast Plate',
    description: 'Eggs, beans, bread, fruit, and coffee.',
    price_usd: 5,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1200',
    available: true
  }
];

export const sampleDeliveryOrders: DeliveryOrder[] = [
  {
    id: 'order-1001',
    business_id: 'damal-restaurant',
    customer_name: 'Amina Hassan',
    customer_phone: '+252 63 555 0101',
    delivery_address: 'Near Shaab School, Hargeisa',
    delivery_latitude: 9.5685,
    delivery_longitude: 44.0512,
    items: [
      { menu_item_id: 'damal-rice', name: 'Somali Rice with Chicken', quantity: 2, price_usd: 6.5 }
    ],
    subtotal_usd: 13,
    delivery_fee_usd: 2,
    total_usd: 15,
    status: 'open',
    driver_id: null,
    driver_name: null,
    driver_phone: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'order-1002',
    business_id: 'hiddo-cafe',
    customer_name: 'Mohamed Ali',
    customer_phone: '+252 63 555 0202',
    delivery_address: 'Jigjiga Yar Apartments',
    delivery_latitude: 9.5568,
    delivery_longitude: 44.0581,
    items: [
      { menu_item_id: 'hiddo-tea', name: 'Somali Tea and Sambuus', quantity: 3, price_usd: 3 }
    ],
    subtotal_usd: 9,
    delivery_fee_usd: 1.5,
    total_usd: 10.5,
    status: 'open',
    driver_id: null,
    driver_name: null,
    driver_phone: null,
    created_at: new Date().toISOString()
  }
];
