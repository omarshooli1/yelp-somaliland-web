import type { TaxiRide } from './types';

export const sampleTaxiRides: TaxiRide[] = [
  {
    id: 'taxi-ride-1001',
    customer_name: 'Nimco Hassan',
    customer_phone: '+252 63 700 1001',
    pickup_address: 'Maka Al Mukarama Road',
    pickup_latitude: 9.5609,
    pickup_longitude: 44.0651,
    dropoff_address: 'Hargeisa Airport Road',
    dropoff_latitude: 9.5471,
    dropoff_longitude: 44.0882,
    city: 'Hargeisa',
    passenger_count: 2,
    notes: 'Waiting near the restaurant entrance.',
    estimated_fare_usd: 5,
    status: 'open',
    driver_id: null,
    driver_name: null,
    driver_phone: null,
    vehicle_label: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'taxi-ride-1002',
    customer_name: 'Abdirahman Ali',
    customer_phone: '+252 63 700 1002',
    pickup_address: 'Jigjiga Yar',
    pickup_latitude: 9.5558,
    pickup_longitude: 44.0614,
    dropoff_address: 'Shaab Area',
    dropoff_latitude: 9.5662,
    dropoff_longitude: 44.0488,
    city: 'Hargeisa',
    passenger_count: 1,
    notes: 'Call when nearby.',
    estimated_fare_usd: 4,
    status: 'open',
    driver_id: null,
    driver_name: null,
    driver_phone: null,
    vehicle_label: null,
    created_at: new Date().toISOString()
  }
];
