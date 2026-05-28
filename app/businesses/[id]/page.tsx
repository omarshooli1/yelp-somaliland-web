import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategory } from '@/lib/categories';
import { getBusinessById, getReviewsForBusiness } from '@/lib/supabase';

type BusinessProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function BusinessProfilePage({ params }: BusinessProfilePageProps) {
  const { id } = await params;
  const business = await getBusinessById(id);
  if (!business) notFound();

  const reviews = await getReviewsForBusiness(business.id);
  const category = getCategory(business.category);
  const heroImage = business.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200';
  const mapUrl = business.latitude && business.longitude
    ? `https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=16/${business.latitude}/${business.longitude}`
    : null;
  const embeddedMapUrl = business.latitude && business.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(`${business.longitude - 0.01},${business.latitude - 0.01},${business.longitude + 0.01},${business.latitude + 0.01}`)}&layer=mapnik&marker=${encodeURIComponent(`${business.latitude},${business.longitude}`)}`
    : null;

  return (
    <main>
      <section className="relative min-h-[360px] bg-slate-900">
        <Image src={heroImage} alt={business.name} fill priority className="object-cover opacity-60" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="relative mx-auto flex min-h-[360px] max-w-6xl flex-col justify-end px-4 py-10 text-white">
          <Link href="/businesses" className="mb-6 w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-white/25">
            ← Back to businesses
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-brand-ink">
              {category?.icon} {category?.label}
            </span>
            {business.verified && <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-black">Verified</span>}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black sm:text-6xl">{business.name}</h1>
          <p className="mt-3 text-lg font-semibold text-white/85">{business.address}, {business.city}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-brand-red px-4 py-3 text-white">
                <div className="text-2xl font-black">{business.rating.toFixed(1)}</div>
                <div className="text-xs font-bold uppercase">{business.review_count} reviews</div>
              </div>
              <div>
                <h2 className="text-2xl font-black">About</h2>
                <p className="text-slate-500">Business details and contact information</p>
              </div>
            </div>
            <p className="text-lg leading-8 text-slate-700">{business.description}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Reviews</h2>
            <div className="mt-5 space-y-4">
              {reviews.length ? reviews.map((review) => (
                <article key={review.id} className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-2 font-black text-brand-red">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p className="leading-7 text-slate-700">{review.comment}</p>
                </article>
              )) : (
                <p className="rounded-2xl bg-slate-50 p-5 text-slate-600">No reviews yet. This business is ready for its first customer story.</p>
              )}
            </div>
          </div>

          {embeddedMapUrl && (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="p-6">
                <h2 className="text-2xl font-black">Location</h2>
                <p className="mt-2 text-slate-600">
                  {business.address}, {business.city}
                </p>
              </div>
              <iframe
                title={`${business.name} location map`}
                src={embeddedMapUrl}
                className="h-[360px] w-full border-0"
              />
              <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
                <span>Map data from OpenStreetMap contributors</span>
                {mapUrl && (
                  <a href={mapUrl} target="_blank" className="font-bold text-brand-red">
                    Open full map
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-black">Contact</h2>
          <div className="mt-5 space-y-3 text-sm">
            {business.category === 'restaurants' || business.category === 'cafes' ? (
              <Link className="block rounded-2xl bg-brand-red p-4 text-center font-bold text-white" href={`/order/${business.id}`}>
                Order delivery
              </Link>
            ) : null}
            {business.phone && <a className="block rounded-2xl bg-slate-50 p-4 font-bold text-brand-ink" href={`tel:${business.phone}`}>☎ {business.phone}</a>}
            {business.whatsapp && <a className="block rounded-2xl bg-green-50 p-4 font-bold text-brand-green" href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}>WhatsApp {business.whatsapp}</a>}
            <div className="rounded-2xl bg-slate-50 p-4 text-slate-700">
              <p className="font-bold text-brand-ink">Address</p>
              <p className="mt-1">{business.address}, {business.city}</p>
            </div>
            {mapUrl && <a className="block rounded-2xl bg-brand-ink p-4 text-center font-bold text-white" href={mapUrl} target="_blank">Open map</a>}
          </div>
        </aside>
      </section>
    </main>
  );
}
