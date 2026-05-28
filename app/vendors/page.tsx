import Image from 'next/image';
import Link from 'next/link';
import { getVendors } from '@/lib/marketplace';

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Vendors</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Shop trusted Somaliland vendors</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Browse storefronts, products, seller ratings, and customer reviews.</p>
          </div>
          <Link href="/vendors/signup" className="w-fit rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white">
            Become a vendor
          </Link>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <Link key={vendor.id} href={`/vendors/${vendor.id}`} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="relative h-40 bg-slate-100">
              {vendor.cover_url ? (
                <Image src={vendor.cover_url} alt={vendor.vendor_name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
              ) : (
                <div className="grid h-full place-items-center bg-brand-ink text-3xl font-black text-white">{vendor.vendor_name.slice(0, 2)}</div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{vendor.vendor_name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{vendor.city}</p>
                </div>
                {vendor.verified && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-brand-green">Verified</span>}
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{vendor.description}</p>
              <div className="mt-4 flex justify-between text-sm">
                <strong className="text-brand-red">{vendor.rating.toFixed(1)} stars</strong>
                <span className="text-slate-500">{vendor.review_count} reviews</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
