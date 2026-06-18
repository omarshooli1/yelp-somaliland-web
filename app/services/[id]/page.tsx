import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serviceCategories } from '@/lib/services-data';
import { getServiceProviderById, getServiceReviews } from '@/lib/services';
import { ServiceReviewForm } from './ServiceReviewForm';

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };
  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-200'}>★</span>
      ))}
    </div>
  );
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const provider = await getServiceProviderById(id);
  if (!provider) notFound();

  const reviews = await getServiceReviews(id);
  const cat = serviceCategories.find((c) => c.id === provider.category);
  const image = provider.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200';

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/services" className="text-sm font-bold text-brand-red hover:underline">← Back to Services</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Hero image */}
          <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
            <Image src={image} alt={provider.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 660px" />
            {provider.available && (
              <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white">
                Available now
              </span>
            )}
          </div>

          {/* Provider info */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-green">
              <span>{cat?.icon}</span>
              <span>{cat?.label}</span>
              {provider.verified && (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-brand-green">✓ Verified</span>
              )}
            </div>
            <h1 className="text-3xl font-black text-brand-ink">{provider.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={provider.rating} size="lg" />
              <span className="text-lg font-black text-brand-ink">{provider.rating.toFixed(1)}</span>
              <span className="text-slate-500">({provider.review_count} reviews)</span>
            </div>

            <p className="mt-4 leading-7 text-slate-600">{provider.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {provider.years_experience && (
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <div className="text-xl">🛠</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">Experience</div>
                  <div className="font-black text-brand-ink">{provider.years_experience} yrs</div>
                </div>
              )}
              {provider.price_range && (
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <div className="text-xl">💰</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">Price range</div>
                  <div className="font-black text-brand-ink">{provider.price_range}</div>
                </div>
              )}
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-xl">⭐</div>
                <div className="mt-1 text-xs font-bold text-slate-500">Rating</div>
                <div className="font-black text-brand-ink">{provider.rating.toFixed(1)} / 5</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-xl">📍</div>
                <div className="mt-1 text-xs font-bold text-slate-500">City</div>
                <div className="font-black text-brand-ink">{provider.city}</div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-brand-ink">Customer reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-slate-500">No reviews yet — be the first!</p>
            ) : (
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="font-black text-brand-ink">{review.reviewer_name}</span>
                        <span className="ml-2 text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave a review */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-2xl font-black text-brand-ink">Leave a review</h2>
            <ServiceReviewForm providerId={provider.id} />
          </div>
        </div>

        {/* Right column — Contact card */}
        <div className="space-y-4">
          <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-black text-brand-ink">Contact {provider.name}</h3>

            <div className="mt-4 space-y-3">
              <a
                href={`tel:${provider.phone}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-red py-3 font-bold text-white hover:opacity-90"
              >
                ☎ Call {provider.phone}
              </a>

              {provider.whatsapp && (
                <a
                  href={`https://wa.me/${provider.whatsapp.replace(/\s+/g, '').replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 font-bold text-white hover:opacity-90"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <span>📍</span>
                <span>{provider.address ? `${provider.address}, ` : ''}{provider.city}</span>
              </div>
              {provider.years_experience && (
                <div className="flex items-center gap-2">
                  <span>🛠</span>
                  <span>{provider.years_experience} years of experience</span>
                </div>
              )}
              {provider.price_range && (
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span>Typical range: {provider.price_range}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>{provider.available ? '🟢' : '🔴'}</span>
                <span className="font-bold">{provider.available ? 'Currently available' : 'Currently unavailable'}</span>
              </div>
            </div>
          </div>

          {/* Map */}
          {provider.latitude && provider.longitude && (
            <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${provider.longitude - 0.01},${provider.latitude - 0.01},${provider.longitude + 0.01},${provider.latitude + 0.01}&layer=mapnik&marker=${provider.latitude},${provider.longitude}`}
                width="100%"
                height="220"
                title={`${provider.name} location`}
                className="border-0"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
