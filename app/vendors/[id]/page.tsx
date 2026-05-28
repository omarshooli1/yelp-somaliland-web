import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductReviews, getProductsForVendor, getVendorById } from '@/lib/marketplace';

type VendorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params;
  const vendor = await getVendorById(id);
  if (!vendor) notFound();

  const [products, reviews] = await Promise.all([
    getProductsForVendor(vendor.id),
    getProductReviews({ vendorId: vendor.id })
  ]);

  return (
    <main>
      <section className="relative min-h-[320px] bg-brand-ink">
        {vendor.cover_url && <Image src={vendor.cover_url} alt={vendor.vendor_name} fill priority className="object-cover opacity-50" sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="relative mx-auto flex min-h-[320px] max-w-6xl flex-col justify-end px-4 py-10 text-white">
          <Link href="/vendors" className="mb-6 w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">← Vendors</Link>
          <div className="flex flex-wrap gap-2">
            {vendor.verified && <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-black">Verified vendor</span>}
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-brand-ink">{vendor.status}</span>
          </div>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">{vendor.vendor_name}</h1>
          <p className="mt-3 text-lg text-white/85">{vendor.city} · {vendor.rating.toFixed(1)} stars · {vendor.review_count} reviews</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">About vendor</h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">{vendor.description || 'No vendor description yet.'}</p>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-red">Products</p>
                <h2 className="text-2xl font-black">Vendor listings</h2>
              </div>
              <Link href="/sell" className="text-sm font-bold text-brand-red">Add product</Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <Link key={product.id} href={`/marketplace/${product.id}`} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div className="relative h-44 bg-slate-100">
                    <Image src={product.images[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200'} alt={product.title} fill className="object-cover" sizes="50vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black">{product.title}</h3>
                    <p className="mt-2 text-brand-red font-black">${product.price_usd.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Reviews</h2>
            <div className="mt-5 space-y-4">
              {reviews.length ? reviews.map((review) => (
                <article key={review.id} className="rounded-2xl bg-slate-50 p-5">
                  <div className="font-black text-brand-red">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p className="mt-2 font-bold">{review.reviewer_name}</p>
                  <p className="mt-2 text-slate-700">{review.comment}</p>
                </article>
              )) : <p className="text-slate-600">No reviews yet.</p>}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-black">Contact vendor</h2>
          <div className="mt-5 space-y-3 text-sm">
            <a href={`tel:${vendor.phone}`} className="block rounded-2xl bg-slate-50 p-4 font-bold">☎ {vendor.phone}</a>
            {vendor.whatsapp && <a href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`} className="block rounded-2xl bg-green-50 p-4 font-bold text-brand-green">WhatsApp {vendor.whatsapp}</a>}
            {vendor.address && <div className="rounded-2xl bg-slate-50 p-4 text-slate-700">{vendor.address}, {vendor.city}</div>}
          </div>
        </aside>
      </section>
    </main>
  );
}
