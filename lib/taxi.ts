import { supabase } from './supabase';
import { sampleTaxiRides } from './taxi-data';
import type { TaxiRide } from './types';

type CreateTaxiRideInput = {
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  dropoff_address: string;
  dropoff_latitude?: number | null;
  dropoff_longitude?: number | null;
  city: string;
  passenger_count: number;
  notes?: string;
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

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

const estimateFare = (passengerCount: number) => {
  const baseFare = 3;
  const passengerFee = Math.max(0, passengerCount - 1) * 0.5;
  return baseFare + passengerFee;
};

export const createTaxiRide = async (input: CreateTaxiRideInput) => {
  const estimatedFare = estimateFare(input.passenger_count);

  if (!supabase) {
    return {
      id: `demo-taxi-${Date.now()}`,
      estimated_fare_usd: estimatedFare
    };
  }

  const { data, error } = await supabase
    .from('taxi_rides')
    .insert({
      ...input,
      notes: input.notes || '',
      estimated_fare_usd: estimatedFare,
      status: 'open'
    })
    .select('id, estimated_fare_usd')
    .single();

  if (error) throw error;
  return data;
};

export const getOpenTaxiRides = async (): Promise<TaxiRide[]> => {
  if (!supabase) return sampleTaxiRides;

  const { data, error } = await supabase
    .from('taxi_rides')
    .select('*')
    .in('status', ['open', 'accepted'])
    .order('created_at', { ascending: false });

  if (error) return sampleTaxiRides;
  return (data || []).map((ride) => normalizeTaxiRide(ride));
};

export const acceptTaxiRide = async ({
  rideId,
  driverName,
  driverPhone,
  vehicleLabel
}: {
  rideId: string;
  driverName: string;
  driverPhone: string;
  vehicleLabel: string;
}) => {
  if (!supabase) return { id: rideId, status: 'accepted' };

  const { data, error } = await supabase
    .from('taxi_rides')
    .update({
      status: 'accepted',
      driver_name: driverName,
      driver_phone: driverPhone,
      vehicle_label: vehicleLabel,
      accepted_at: new Date().toISOString()
    })
    .eq('id', rideId)
    .eq('status', 'open')
    .select('id, status')
    .single();

  if (error) throw error;
  return data;
};
