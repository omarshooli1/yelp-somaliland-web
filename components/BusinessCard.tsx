import Image from 'next/image';
import Link from 'next/link';
import { getCategory } from '@/lib/categories';
import type { Business } from '@/lib/types';

type BusinessCardProps = {
  business: Business;
};

export function BusinessCard({ business }: BusinessCardProps) {
  const category = getCategory(business.category);
  const image = business.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200';

  return (
    <Link
      href={`/businesses/${business.id}`}
      className="grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-soft md:grid-cols-[220px_1fr]"
    >
      <div className="relative h-52 md:h-full">
        <Image src={image} alt={business.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 220px" />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-green">
              <span>{category?.icon}</span>
              <span>{category?.label || business.category}</span>
              {business.verified && <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-brand-green">Verified</span>}
            </div>
            <h2 className="text-xl font-extrabold text-brand-ink">{business.name}</h2>
          </div>
          <div className="rounded-xl bg-brand-red px-3 py-2 text-center text-white">
            <div className="text-sm font-black">{business.rating.toFixed(1)}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wide">{business.review_count} reviews</div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{business.description}</p>
        <div className="mt-auto flex flex-wrap gap-3 text-sm text-slate-500">
          <span>📍 {business.address}, {business.city}</span>
          {business.phone && <span>☎ {business.phone}</span>}
        </div>
      </div>
    </Link>
  );
}
