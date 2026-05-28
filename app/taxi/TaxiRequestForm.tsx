'use client';

import { FormEvent, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { createTaxiRide } from '@/lib/taxi';

export function TaxiRequestForm() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const customer_name = String(form.get('customer_name') || '').trim();
    const customer_phone = String(form.get('customer_phone') || '').trim();
    const pickup_address = String(form.get('pickup_address') || '').trim();
    const dropoff_address = String(form.get('dropoff_address') || '').trim();
    const city = String(form.get('city') || 'Hargeisa').trim();
    const passenger_count = Number(form.get('passenger_count') || 1);
    const notes = String(form.get('notes') || '').trim();
    const pickupLatitude = String(form.get('pickup_latitude') || '').trim();
    const pickupLongitude = String(form.get('pickup_longitude') || '').trim();
    const dropoffLatitude = String(form.get('dropoff_latitude') || '').trim();
    const dropoffLongitude = String(form.get('dropoff_longitude') || '').trim();

    if (!customer_name || !customer_phone || !pickup_address || !dropoff_address) {
      setMessage('Add your name, phone, pickup, and dropoff.');
      setSubmitting(false);
      return;
    }

    try {
      const ride = await createTaxiRide({
        customer_name,
        customer_phone,
        pickup_address,
        pickup_latitude: pickupLatitude ? Number(pickupLatitude) : null,
        pickup_longitude: pickupLongitude ? Number(pickupLongitude) : null,
        dropoff_address,
        dropoff_latitude: dropoffLatitude ? Number(dropoffLatitude) : null,
        dropoff_longitude: dropoffLongitude ? Number(dropoffLongitude) : null,
        city,
        passenger_count: Math.max(1, passenger_count),
        notes
      });

      await trackEvent({
        event_name: 'taxi_ride_requested',
        entity_type: 'taxi_ride',
        entity_id: ride.id,
        city,
        metadata: { passenger_count, estimated_fare_usd: ride.estimated_fare_usd }
      });

      event.currentTarget.reset();
      setMessage(`Taxi requested. Estimated fare: $${Number(ride.estimated_fare_usd).toFixed(2)}. A driver can now accept it.`);
    } catch (error) {
      setMessage('Could not request taxi. Check Supabase settings and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="customer_name" placeholder="Your name" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="customer_phone" placeholder="+252 phone number" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="pickup_address" placeholder="Pickup address or landmark" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="dropoff_address" placeholder="Dropoff address or landmark" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="city" defaultValue="Hargeisa" placeholder="City" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="passenger_count" type="number" min="1" defaultValue="1" placeholder="Passengers" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="pickup_latitude" type="number" step="any" placeholder="Pickup latitude optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="pickup_longitude" type="number" step="any" placeholder="Pickup longitude optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="dropoff_latitude" type="number" step="any" placeholder="Dropoff latitude optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="dropoff_longitude" type="number" step="any" placeholder="Dropoff longitude optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      </div>
      <textarea name="notes" rows={4} placeholder="Notes for driver" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      {message && <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}
      <button disabled={submitting} className="rounded-2xl bg-brand-red px-5 py-4 font-black text-white disabled:opacity-60">
        {submitting ? 'Requesting...' : 'Request taxi'}
      </button>
    </form>
  );
}
