import Link from 'next/link';
import { BusinessCard } from '@/components/BusinessCard';
import { CategoryPills } from '@/components/CategoryPills';
import { SearchBox } from '@/components/SearchBox';
import { categories } from '@/lib/categories';
import { getBusinesses } from '@/lib/supabase';

export default async function HomePage() {
  const businesses = await getBusinesses();
  const ranked = businesses.slice(0, 5);

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600')" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex w-full flex-col items-center px-4 py-16 text-center">
          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Find great local businesses near you
          </h1>
          <p className="mt-3 text-lg text-white/80">Discover restaurants, cafes, hotels, clinics, and more in Somaliland.</p>
          <div className="mt-8 w-full max-w-2xl">
            <SearchBox large />
          </div>
        </div>
      </section>

      {/* Category icons */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-center text-xl font-black text-brand-ink">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/businesses?category=${category.id}`}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl transition hover:bg-red-100">
                {category.icon}
              </span>
              <span className="text-xs font-semibold text-slate-600">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ranked business list */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-red">Top Rated</p>
            <h2 className="text-2xl font-black">Best businesses in Somaliland</h2>
          </div>
          <Link href="/businesses" className="text-sm font-bold text-brand-red hover:underline">See all</Link>
        </div>
        <div className="space-y-4">
          <CategoryPills />
          <div className="grid gap-5">
            {ranked.map((business, index) => (
              <BusinessCard key={business.id} business={business} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-3xl font-black text-brand-ink">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-2xl text-white">
                🔎
              </div>
              <h3 className="text-lg font-extrabold">Search</h3>
              <p className="mt-2 text-sm text-slate-500">Enter what you&apos;re looking for and your location to find nearby businesses.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-2xl text-white">
                ⭐
              </div>
              <h3 className="text-lg font-extrabold">Read Reviews</h3>
              <p className="mt-2 text-sm text-slate-500">Browse ratings and reviews from the community to make the best choice.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-2xl text-white">
                📍
              </div>
              <h3 className="text-lg font-extrabold">Connect</h3>
              <p className="mt-2 text-sm text-slate-500">Call, get directions, or contact the business directly from their listing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-ink text-slate-400">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-4">
          <div>
            <div className="mb-3 text-xl font-black italic text-white">yelp</div>
            <p className="text-sm leading-6">Your guide to the best local businesses in Somaliland.</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-white">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/businesses" className="hover:text-white">Browse Businesses</Link></li>
              <li><Link href="/businesses?category=restaurants" className="hover:text-white">Restaurants</Link></li>
              <li><Link href="/businesses?category=hotels" className="hover:text-white">Hotels</Link></li>
              <li><Link href="/businesses?category=clinics" className="hover:text-white">Clinics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-white">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
              <li><Link href="/vendors" className="hover:text-white">Vendors</Link></li>
              <li><Link href="/taxi" className="hover:text-white">Taxi</Link></li>
              <li><Link href="/map" className="hover:text-white">Map</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/write-review" className="hover:text-white">Write a Review</Link></li>
              <li><Link href="/login" className="hover:text-white">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs">
          © {new Date().getFullYear()} Yelp Somaliland. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
