'use client';

import { FormEvent, useState } from 'react';
import { productCategories } from '@/lib/marketplace-data';
import { createProduct } from '@/lib/marketplace';
import { trackEvent } from '@/lib/analytics';

export function SellForm() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const image = String(form.get('image') || '').trim();
    const title = String(form.get('title') || '').trim();
    const category = String(form.get('category') || '').trim();
    const seller_name = String(form.get('seller_name') || '').trim();
    const seller_phone = String(form.get('seller_phone') || '').trim();
    const description = String(form.get('description') || '').trim();
    const price_usd = Number(form.get('price_usd') || 0);
    const city = String(form.get('city') || 'Hargeisa').trim();
    const address = String(form.get('address') || '').trim();
    const latitudeRaw = String(form.get('latitude') || '').trim();
    const longitudeRaw = String(form.get('longitude') || '').trim();

    if (!title || !category || !seller_name || !seller_phone || !price_usd) {
      setMessage('Add title, category, seller name, seller phone, and price.');
      setSubmitting(false);
      return;
    }

    try {
      const product = await createProduct({
        business_id: null,
        seller_name,
        seller_phone,
        title,
        category,
        description,
        price_usd,
        city,
        address: address || null,
        latitude: latitudeRaw ? Number(latitudeRaw) : null,
        longitude: longitudeRaw ? Number(longitudeRaw) : null,
        images: image ? [image] : []
      });

      await trackEvent({
        event_name: 'product_listed',
        entity_type: 'product',
        entity_id: product.id,
        category,
        city,
        metadata: { price_usd }
      });

      event.currentTarget.reset();
      setMessage('Product listed. Buyers can now find it in the marketplace.');
    } catch (error) {
      setMessage('Could not list product. Check Supabase settings and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="title" placeholder="Product or service title" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <select name="category" defaultValue="" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red">
          <option value="" disabled>Choose category</option>
          {productCategories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <input name="seller_name" placeholder="Seller name" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="seller_phone" placeholder="+252 phone number" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="price_usd" type="number" min="0" step="0.01" placeholder="Price in USD" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="city" defaultValue="Hargeisa" placeholder="City" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="address" placeholder="Address or landmark" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="image" placeholder="Image URL" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="latitude" type="number" step="any" placeholder="Latitude optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="longitude" type="number" step="any" placeholder="Longitude optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      </div>
      <textarea name="description" rows={5} placeholder="Describe what you are selling" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      {message && <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}
      <button disabled={submitting} className="rounded-2xl bg-brand-red px-5 py-4 font-black text-white disabled:opacity-60">
        {submitting ? 'Listing...' : 'List product'}
      </button>
    </form>
  );
}
