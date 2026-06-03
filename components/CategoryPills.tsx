import Link from 'next/link';
import { categories } from '@/lib/categories';

type CategoryPillsProps = {
  activeCategory?: string;
};

export function CategoryPills({ activeCategory }: CategoryPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <Link
        href="/businesses"
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ring-1 ${
          !activeCategory ? 'bg-brand-red text-white ring-brand-red' : 'bg-white text-slate-700 ring-slate-200'
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/businesses?category=${category.id}`}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ring-1 ${
            activeCategory === category.id
              ? 'bg-brand-red text-white ring-brand-red'
              : 'bg-white text-slate-700 ring-slate-200 hover:ring-brand-red/40 hover:text-brand-red'
          }`}
        >
          {category.icon} {category.label}
        </Link>
      ))}
    </div>
  );
}
