'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Business } from '@/lib/types';

type BusinessImageCarouselProps = {
  businesses: Business[];
};

export function BusinessImageCarousel({ businesses }: BusinessImageCarouselProps) {
  const slides = useMemo(
    () => businesses.filter((business) => business.images[0]).slice(0, 5),
    [businesses]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-[2rem] bg-brand-ink p-8 text-center text-white shadow-soft">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-white/60">Featured</p>
          <h2 className="mt-3 text-3xl font-black">Somaliland businesses</h2>
        </div>
      </div>
    );
  }

  const activeBusiness = slides[activeIndex];

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-brand-ink shadow-soft">
      {slides.map((business, index) => (
        <Image
          key={business.id}
          src={business.images[0]}
          alt={business.name}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 45vw"
          className={`object-cover transition-opacity duration-700 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-wide text-white/70">Featured business</p>
        <h2 className="mt-2 text-3xl font-black">{activeBusiness.name}</h2>
        <p className="mt-2 text-sm font-semibold text-white/80">
          {activeBusiness.city} · {activeBusiness.rating.toFixed(1)} stars · {activeBusiness.review_count} reviews
        </p>
        <Link
          href={`/businesses/${activeBusiness.id}`}
          className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-brand-ink"
        >
          View business
        </Link>
        <div className="mt-5 flex gap-2">
          {slides.map((business, index) => (
            <button
              key={business.id}
              type="button"
              aria-label={`Show ${business.name}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/45'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
