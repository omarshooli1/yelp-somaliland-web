import Image from 'next/image';
import Link from 'next/link';
import { getCategory } from '@/lib/categories';
import type { Business } from '@/lib/types';

type BusinessCardProps = {
  business: Business;
  rank?: number;
};

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-semibold text-slate-600">{rating.toFixed(1)}</span>
      <span className="text-sm text-slate-400 ml-0.5">({reviewCount})</span>
    </div>
  );
}

export function BusinessCard({ business, rank }: BusinessCardProps) {
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
        <div className="flex items-start gap-4">
          {rank !== undefined && (
            <span className="mt-0.5 text-2xl font-black text-slate-300 leading-none">{rank}</span>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-brand-ink">{business.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StarRating rating={business.rating} reviewCount={business.review_count} />
              <span className="rounded-full bg-brand-red/10 px-2.5 py-0.5 text-xs font-bold text-brand-red">
                {category?.icon} {category?.label || business.category}
              </span>
              {business.verified && (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-brand-green">Verified</span>
              )}
            </div>
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
