import Link from 'next/link';
import { getCategory } from '@/lib/categories';
import { getBusinesses } from '@/lib/supabase';

const HARGEISA_BBOX = '44.0200,9.5250,44.1150,9.5900';
const HARGEISA_MARKER = '9.5596,44.0650';

export default async function MapPage() {
  const businesses = await getBusinesses();
  const mappedBusinesses = businesses.filter((business) => business.latitude && business.longitude);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-green">OpenStreetMap</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Business map</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Explore Hargeisa businesses using open map data. Select a business below to open its exact map position.
          </p>
        </div>
        <Link href="/businesses" className="w-fit rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white">
          Browse listings
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <iframe
            title="Hargeisa business map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(HARGEISA_BBOX)}&layer=mapnik&marker=${encodeURIComponent(HARGEISA_MARKER)}`}
            className="h-[520px] w-full border-0"
          />
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            <span>Map data from OpenStreetMap contributors</span>
            <a
              href="https://www.openstreetmap.org/#map=13/9.5596/44.0650"
              target="_blank"
              className="font-bold text-brand-red"
            >
              Open full map
            </a>
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-black">Mapped businesses</h2>
          <p className="mt-1 text-sm text-slate-500">{mappedBusinesses.length} with latitude and longitude</p>
          <div className="mt-5 max-h-[520px] space-y-3 overflow-auto pr-1">
            {mappedBusinesses.map((business) => {
              const category = getCategory(business.category);
              const osmUrl = `https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=17/${business.latitude}/${business.longitude}`;

              return (
                <div key={business.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{category?.icon || '📍'}</div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/businesses/${business.id}`} className="font-extrabold text-brand-ink hover:text-brand-red">
                        {business.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">{business.address}, {business.city}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a href={osmUrl} target="_blank" className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-red ring-1 ring-slate-200">
                          Open point
                        </a>
                        <Link href={`/businesses/${business.id}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                          Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </main>
  );
}
