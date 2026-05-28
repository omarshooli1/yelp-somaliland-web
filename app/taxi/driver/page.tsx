import Link from 'next/link';
import { getOpenTaxiRides } from '@/lib/taxi';
import { TaxiDriverBoard } from './TaxiDriverBoard';

const HARGEISA_BBOX = '44.0200,9.5250,44.1150,9.5900';
const HARGEISA_MARKER = '9.5596,44.0650';

export default async function TaxiDriverPage() {
  const rides = await getOpenTaxiRides();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Taxi drivers</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Accept taxi requests</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Drivers on route can view open pickup requests, check map links, and accept a ride.
          </p>
        </div>
        <Link href="/taxi" className="w-fit rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white">
          Customer request
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <iframe
            title="Taxi request map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(HARGEISA_BBOX)}&layer=mapnik&marker=${encodeURIComponent(HARGEISA_MARKER)}`}
            className="h-[520px] w-full border-0"
          />
          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            Map data from OpenStreetMap contributors
          </div>
        </div>

        <TaxiDriverBoard rides={rides} />
      </section>
    </main>
  );
}
