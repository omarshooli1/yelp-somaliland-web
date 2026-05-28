import Image from 'next/image';
import Link from 'next/link';
import { productCategories } from '@/lib/marketplace-data';
import { getProducts } from '@/lib/marketplace';

type MarketplacePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const products = await getProducts({ query: params.q, category: params.category });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Marketplace</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Buy and sell in Somaliland</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              List products, services, groceries, electronics, and offers from trusted local sellers.
            </p>
          </div>
          <Link href="/sell" className="w-fit rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white">
            Sell something
          </Link>
        </div>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/marketplace">
          <input
            name="q"
            defaultValue={params.q || ''}
            placeholder="Search products or sellers..."
            className="min-h-12 flex-1 rounded-2xl bg-slate-50 px-4 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
          <select
            name="category"
            defaultValue={params.category || ''}
            className="min-h-12 rounded-2xl bg-slate-50 px-4 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          >
            <option value="">All categories</option>
            {productCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button className="min-h-12 rounded-2xl bg-brand-ink px-6 font-bold text-white">Search</button>
        </form>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={`/marketplace/${product.id}`} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="relative h-52 bg-slate-100">
              <Image
                src={product.images[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{product.category}</span>
                {product.verified_seller && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-brand-green">Verified</span>}
              </div>
              <h2 className="text-lg font-black">{product.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <strong className="text-xl text-brand-red">${product.price_usd.toFixed(2)}</strong>
                <span className="text-sm text-slate-500">{product.city}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
