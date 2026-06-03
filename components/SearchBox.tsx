'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

type SearchBoxProps = {
  large?: boolean;
  initialQuery?: string;
};

export function SearchBox({ large = false, initialQuery = '' }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location.trim()) params.set('near', location.trim());
    router.push(`/businesses${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full overflow-hidden rounded-lg shadow-soft ring-1 ring-black/10 ${large ? 'max-w-3xl' : ''}`}
    >
      <label className="flex flex-1 items-center gap-2 border-r border-slate-200 bg-white px-4">
        <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Restaurants, clinics, hotels..."
          className="min-h-12 w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-slate-400"
        />
      </label>
      <label className="flex flex-1 items-center gap-2 border-r border-slate-200 bg-white px-4">
        <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Hargeisa, Somaliland"
          className="min-h-12 w-full bg-transparent text-sm text-brand-ink outline-none placeholder:text-slate-400"
        />
      </label>
      <button
        type="submit"
        className="min-h-12 bg-brand-red px-8 text-sm font-bold text-white transition hover:bg-red-800"
      >
        Search
      </button>
    </form>
  );
}
