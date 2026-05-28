'use client';

import { FormEvent, useState } from 'react';
import { acceptTaxiRide } from '@/lib/taxi';
import type { TaxiRide } from '@/lib/types';

type TaxiDriverBoardProps = {
  rides: TaxiRide[];
};

export function TaxiDriverBoard({ rides }: TaxiDriverBoardProps) {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleLabel, setVehicleLabel] = useState('');
  const [acceptedRides, setAcceptedRides] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');

  const acceptRide = async (event: FormEvent<HTMLFormElement>, rideId: string) => {
    event.preventDefault();
    setMessage('');

    if (!driverName.trim() || !driverPhone.trim() || !vehicleLabel.trim()) {
      setMessage('Add driver name, phone, and vehicle first.');
      return;
    }

    try {
      await acceptTaxiRide({
        rideId,
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        vehicleLabel: vehicleLabel.trim()
      });
      setAcceptedRides((current) => ({ ...current, [rideId]: true }));
      setMessage('Ride accepted. Contact the customer and head to pickup.');
    } catch (error) {
      setMessage('Could not accept ride. It may already be taken.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black">Driver details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input value={driverName} onChange={(event) => setDriverName(event.target.value)} placeholder="Driver name" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
          <input value={driverPhone} onChange={(event) => setDriverPhone(event.target.value)} placeholder="Driver phone" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
          <input value={vehicleLabel} onChange={(event) => setVehicleLabel(event.target.value)} placeholder="Vehicle, plate, color" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        </div>
        {message && <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}
      </div>

      {rides.map((ride) => {
        const pickupMapUrl = ride.pickup_latitude && ride.pickup_longitude
          ? `https://www.openstreetmap.org/?mlat=${ride.pickup_latitude}&mlon=${ride.pickup_longitude}#map=16/${ride.pickup_latitude}/${ride.pickup_longitude}`
          : null;
        const dropoffMapUrl = ride.dropoff_latitude && ride.dropoff_longitude
          ? `https://www.openstreetmap.org/?mlat=${ride.dropoff_latitude}&mlon=${ride.dropoff_longitude}#map=16/${ride.dropoff_latitude}/${ride.dropoff_longitude}`
          : null;
        const routeUrl = ride.pickup_latitude && ride.pickup_longitude && ride.dropoff_latitude && ride.dropoff_longitude
          ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${ride.pickup_latitude},${ride.pickup_longitude};${ride.dropoff_latitude},${ride.dropoff_longitude}`
          : null;

        return (
          <article key={ride.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-green">{ride.status}</p>
                <h3 className="mt-1 text-xl font-black">{ride.pickup_address}</h3>
                <p className="mt-1 text-sm text-slate-500">To {ride.dropoff_address}</p>
              </div>
              <div className="rounded-2xl bg-brand-red px-4 py-3 text-center text-white">
                <div className="text-lg font-black">${Number(ride.estimated_fare_usd || 0).toFixed(2)}</div>
                <div className="text-xs font-bold uppercase">estimate</div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-bold">Customer</p>
                <p className="mt-1 text-slate-600">{ride.customer_name}</p>
                <p className="text-slate-600">{ride.customer_phone}</p>
              </div>
              <div>
                <p className="font-bold">Ride</p>
                <p className="mt-1 text-slate-600">{ride.passenger_count} passenger(s)</p>
                <p className="text-slate-600">{ride.notes || 'No notes'}</p>
              </div>
            </div>

            <form onSubmit={(event) => acceptRide(event, ride.id)} className="mt-5 flex flex-wrap gap-2">
              {pickupMapUrl && <a href={pickupMapUrl} target="_blank" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">Pickup map</a>}
              {dropoffMapUrl && <a href={dropoffMapUrl} target="_blank" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">Dropoff map</a>}
              {routeUrl && <a href={routeUrl} target="_blank" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">Route</a>}
              <button
                type="submit"
                disabled={acceptedRides[ride.id] || ride.status !== 'open'}
                className="rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white disabled:bg-slate-300"
              >
                {acceptedRides[ride.id] || ride.status !== 'open' ? 'Accepted' : 'Accept ride'}
              </button>
            </form>
          </article>
        );
      })}

      {!rides.length && (
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
          <h2 className="text-xl font-black">No open taxi requests</h2>
          <p className="mt-2 text-slate-600">New taxi requests will appear here.</p>
        </div>
      )}
    </div>
  );
}
