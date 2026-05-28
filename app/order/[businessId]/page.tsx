import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMenuItemsForBusiness } from '@/lib/delivery';
import { getBusinessById } from '@/lib/supabase';
import { OrderForm } from './OrderForm';

type OrderPageProps = {
  params: Promise<{ businessId: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { businessId } = await params;
  const business = await getBusinessById(businessId);
  if (!business) notFound();

  const menuItems = await getMenuItemsForBusiness(business.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Link href={`/businesses/${business.id}`} className="text-sm font-bold text-brand-red">
          ← Back to {business.name}
        </Link>
        <h1 className="mt-4 text-3xl font-black sm:text-4xl">Order from {business.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Pick menu items, add delivery details, and send the order to the driver queue.
        </p>
      </div>
      <OrderForm business={business} menuItems={menuItems} />
    </main>
  );
}
