'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDeliveryOrder } from '@/lib/delivery';
import type { Business, DeliveryOrderItem, MenuItem } from '@/lib/types';

type OrderFormProps = {
  business: Business;
  menuItems: MenuItem[];
};

export function OrderForm({ business, menuItems }: OrderFormProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const items = useMemo<DeliveryOrderItem[]>(
    () => menuItems
      .map((item) => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: quantities[item.id] || 0,
        price_usd: item.price_usd
      }))
      .filter((item) => item.quantity > 0),
    [menuItems, quantities]
  );

  const subtotal = items.reduce((sum, item) => sum + item.price_usd * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  const setQuantity = (itemId: string, nextQuantity: number) => {
    setQuantities((current) => ({
      ...current,
      [itemId]: Math.max(0, nextQuantity)
    }));
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!items.length) {
      setMessage('Choose at least one item.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setMessage('Add your name, phone, and delivery address.');
      return;
    }

    setSubmitting(true);

    try {
      const order = await createDeliveryOrder({
        business_id: business.id,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: deliveryAddress.trim(),
        items
      });

      setMessage(`Order placed. Total: $${Number(order.total_usd).toFixed(2)}. A driver can now accept it.`);
      setQuantities({});
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      router.refresh();
    } catch (error) {
      setMessage('Could not place order. Check Supabase settings and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black">{item.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-3 font-black text-brand-red">${item.price_usd.toFixed(2)}</p>
              </div>
              <div className="flex w-fit items-center rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, (quantities[item.id] || 0) - 1)}
                  className="h-10 w-10 rounded-full bg-white text-lg font-black"
                >
                  -
                </button>
                <span className="w-12 text-center font-black">{quantities[item.id] || 0}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, (quantities[item.id] || 0) + 1)}
                  className="h-10 w-10 rounded-full bg-brand-red text-lg font-black text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        {!menuItems.length && (
          <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
            <h2 className="text-xl font-black">No menu items yet</h2>
            <p className="mt-2 text-slate-600">Add items to `menu_items` in Supabase for this restaurant.</p>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black">Delivery details</h2>
        <div className="mt-5 space-y-4">
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Customer name"
            className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
          <input
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="+252 phone number"
            className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
          <textarea
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            placeholder="Delivery address or landmark"
            rows={4}
            className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
        </div>

        <div className="my-5 space-y-2 border-y border-slate-200 py-5 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div className="flex justify-between"><span>Delivery</span><strong>${deliveryFee.toFixed(2)}</strong></div>
          <div className="flex justify-between text-lg"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
        </div>

        {message && <p className="mb-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-brand-red px-5 py-4 font-black text-white disabled:opacity-60"
        >
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </aside>
    </form>
  );
}
