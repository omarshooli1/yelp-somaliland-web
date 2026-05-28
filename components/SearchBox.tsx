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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    router.push(`/businesses${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full flex-col gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5 sm:flex-row ${
        large ? 'max-w-3xl' : ''
      }`}
    >
      <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4">
        <span className="text-lg">🔎</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search restaurants, clinics, hotels..."
          className="w-full bg-transparent text-base text-brand-ink outline-none placeholder:text-slate-400"
        />
      </label>
      <button
        type="submit"
        className="min-h-12 rounded-xl bg-brand-red px-6 text-sm font-bold text-white transition hover:bg-red-700"
      >
        Search
      </button>
    </form>
  );
}
