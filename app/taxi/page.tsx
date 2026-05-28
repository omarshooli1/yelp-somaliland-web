import Link from 'next/link';
import { TaxiRequestForm } from './TaxiRequestForm';

export default function TaxiPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Taxi hailing</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Request a taxi in Hargeisa</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Customers can request a ride with pickup and dropoff details. Drivers on route can accept open requests.
        </p>
        <Link href="/taxi/driver" className="mt-5 inline-flex rounded-full bg-brand-ink px-5 py-3 text-sm font-bold text-white">
          Driver taxi board
        </Link>
      </div>
      <TaxiRequestForm />
    </main>
  );
}
