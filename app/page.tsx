import Link from 'next/link';
import { BusinessCard } from '@/components/BusinessCard';
import { BusinessImageCarousel } from '@/components/BusinessImageCarousel';
import { CategoryPills } from '@/components/CategoryPills';
import { SearchBox } from '@/components/SearchBox';
import { categories } from '@/lib/categories';
import { getBusinesses } from '@/lib/supabase';

export default async function HomePage() {
  const businesses = await getBusinesses();
  const featured = businesses.slice(0, 3);

  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-brand-green">
              Hargeisa first, all Somaliland next
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-brand-ink sm:text-5xl md:text-6xl">
              Find trusted local businesses in Somaliland.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Discover restaurants, cafes, hotels, clinics, pharmacies, gyms, barbers, and supermarkets with reviews, contact info, and map-ready locations.
            </p>
            <div className="mt-8">
              <SearchBox large />
            </div>
          </div>

          <BusinessImageCarousel businesses={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-red">Categories</p>
            <h2 className="text-2xl font-black">Browse by need</h2>
          </div>
          <Link href="/businesses" className="text-sm font-bold text-brand-red">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/businesses?category=${category.id}`} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="text-3xl">{category.icon}</div>
              <div className="mt-3 font-extrabold">{category.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Featured</p>
          <h2 className="text-2xl font-black">Top businesses</h2>
        </div>
        <div className="space-y-4">
          <CategoryPills />
          <div className="grid gap-5">
            {featured.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
