import { BusinessCard } from '@/components/BusinessCard';
import { CategoryPills } from '@/components/CategoryPills';
import { SearchBox } from '@/components/SearchBox';
import { getCategory } from '@/lib/categories';
import { getBusinesses } from '@/lib/supabase';

type BusinessesPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

export default async function BusinessesPage({ searchParams }: BusinessesPageProps) {
  const params = await searchParams;
  const businesses = await getBusinesses({ query: params.q, category: params.category });
  const category = params.category ? getCategory(params.category) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-red">Business directory</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          {category ? `${category.label} in Somaliland` : 'Browse Somaliland businesses'}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Search by name, service, address, or filter by category. Listings include phone, WhatsApp, reviews, verification, and map coordinates.
        </p>
        <div className="mt-6">
          <SearchBox initialQuery={params.q || ''} />
        </div>
      </div>

      <div className="mb-5">
        <CategoryPills activeCategory={params.category} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{businesses.length} businesses found</p>
        {params.q && <p className="text-sm text-slate-500">Search: “{params.q}”</p>}
      </div>

      <div className="grid gap-5">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>

      {!businesses.length && (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200">
          <h2 className="text-xl font-black">No businesses found</h2>
          <p className="mt-2 text-slate-600">Try another category or search term.</p>
        </div>
      )}
    </main>
  );
}
