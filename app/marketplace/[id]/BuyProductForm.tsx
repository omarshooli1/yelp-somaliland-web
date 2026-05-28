'use client';

import { FormEvent, useState } from 'react';
import { createMarketplaceOrder } from '@/lib/marketplace';
import type { Product } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

export function BuyProductForm({ product }: { product: Product }) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!buyerName.trim() || !buyerPhone.trim()) {
      setMessage('Add your name and phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const order = await createMarketplaceOrder({
        product,
        buyer_name: buyerName.trim(),
        buyer_phone: buyerPhone.trim(),
        buyer_address: buyerAddress.trim(),
        quantity
      });
      await trackEvent({
        event_name: 'marketplace_order_created',
        entity_type: 'product',
        entity_id: product.id,
        category: product.category,
        city: product.city,
        metadata: { total_usd: order.total_usd, quantity }
      });
      setMessage(`Request sent. Total: $${Number(order.total_usd).toFixed(2)}. Seller will contact you.`);
      setBuyerName('');
      setBuyerPhone('');
      setBuyerAddress('');
      setQuantity(1);
    } catch (error) {
      setMessage('Could not send request. Check Supabase settings and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} placeholder="Your name" className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      <input value={buyerPhone} onChange={(event) => setBuyerPhone(event.target.value)} placeholder="+252 phone number" className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      <input value={buyerAddress} onChange={(event) => setBuyerAddress(event.target.value)} placeholder="Address or landmark" className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      <div className="rounded-2xl bg-slate-50 p-4 text-sm">
        Total: <strong>${(Math.max(1, quantity) * product.price_usd).toFixed(2)}</strong>
      </div>
      {message && <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}
      <button disabled={submitting} className="w-full rounded-2xl bg-brand-red px-5 py-4 font-black text-white disabled:opacity-60">
        {submitting ? 'Sending...' : 'Request to buy'}
      </button>
    </form>
  );
}
