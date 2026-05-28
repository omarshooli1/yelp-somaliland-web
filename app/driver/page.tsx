import { DriverOrders } from './DriverOrders';
import { getOpenDeliveryOrders } from '@/lib/delivery';

const HARGEISA_BBOX = '44.0200,9.5250,44.1150,9.5900';
const HARGEISA_MARKER = '9.5596,44.0650';

export default async function DriverPage() {
  const orders = await getOpenDeliveryOrders();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Driver dispatch</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Accept delivery orders</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Drivers can see open restaurant orders, check restaurant and customer map links, and accept a job.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <iframe
            title="Driver order map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(HARGEISA_BBOX)}&layer=mapnik&marker=${encodeURIComponent(HARGEISA_MARKER)}`}
            className="h-[520px] w-full border-0"
          />
          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            Map data from OpenStreetMap contributors
          </div>
        </div>

        <DriverOrders orders={orders} />
      </section>
    </main>
  );
}
