import Image from 'next/image';
import Link from 'next/link';
import { serviceCategories } from '@/lib/services-data';
import { getServiceProviders } from '@/lib/services';
import type { ServiceCategory } from '@/lib/types';

type ServicesPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-200'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const providers = await getServiceProviders({ query: params.q, category: params.category });
  const activeCategory = serviceCategories.find((c) => c.id === params.category);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Home Services</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              {activeCategory ? `${activeCategory.icon} ${activeCategory.label} in Somaliland` : 'Find trusted service professionals'}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Verified plumbers, electricians, AC technicians, carpenters, and more — rated by real customers in Somaliland.
            </p>
          </div>
          <Link
            href="/services/register"
            className="w-fit rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            List your services
          </Link>
        </div>

        {/* Search */}
        <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/services">
          <input
            name="q"
            defaultValue={params.q || ''}
            placeholder="Search by name, city, or service…"
            className="min-h-12 flex-1 rounded-2xl bg-slate-50 px-4 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
          {params.category && <input type="hidden" name="category" value={params.category} />}
          <button className="min-h-12 rounded-2xl bg-brand-ink px-6 font-bold text-white">Search</button>
        </form>
      </section>

      {/* Category Pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            !params.category
              ? 'bg-brand-red text-white'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          All Services
        </Link>
        {serviceCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/services?category=${cat.id}`}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              params.category === cat.id
                ? 'bg-brand-red text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.icon} {cat.label}
          </Link>
        ))}
      </div>

      {/* Count */}
      <p className="mt-5 text-sm font-bold text-slate-500">{providers.length} professionals found</p>

      {/* Provider Cards */}
      <div className="mt-4 grid gap-5">
        {providers.map((provider) => {
          const cat = serviceCategories.find((c) => c.id === provider.category);
          const image = provider.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200';

          return (
            <Link
              key={provider.id}
              href={`/services/${provider.id}`}
              className="grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[220px_1fr]"
            >
              <div className="relative h-52 md:h-full">
                <Image src={image} alt={provider.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 220px" />
                {provider.available && (
                  <span className="absolute left-3 top-3 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                    Available
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-green">
                      <span>{cat?.icon}</span>
                      <span>{cat?.label || provider.category}</span>
                      {provider.verified && (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-brand-green">Verified</span>
                      )}
                    </div>
                    <h2 className="text-xl font-extrabold text-brand-ink">{provider.name}</h2>
                  </div>
                  <div className="rounded-xl bg-brand-red px-3 py-2 text-center text-white">
                    <div className="text-sm font-black">{provider.rating.toFixed(1)}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide">{provider.review_count} reviews</div>
                  </div>
                </div>

                <StarRating rating={provider.rating} />

                <p className="line-clamp-2 text-sm leading-6 text-slate-600">{provider.description}</p>

                <div className="mt-auto flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>📍 {provider.city}{provider.address ? `, ${provider.address}` : ''}</span>
                  <span>☎ {provider.phone}</span>
                  {provider.years_experience && <span>🛠 {provider.years_experience} yrs experience</span>}
                  {provider.price_range && <span>💰 {provider.price_range}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!providers.length && (
        <div className="mt-6 rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
          <h2 className="text-xl font-black">No professionals found</h2>
          <p className="mt-2 text-slate-600">Try a different category or search term.</p>
        </div>
      )}
    </main>
  );
}
