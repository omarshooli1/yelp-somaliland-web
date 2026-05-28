'use client';

import { FormEvent, useState } from 'react';
import { createVendor } from '@/lib/marketplace';
import { trackEvent } from '@/lib/analytics';

export function VendorSignupForm() {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const vendor_name = String(form.get('vendor_name') || '').trim();
    const owner_name = String(form.get('owner_name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const whatsapp = String(form.get('whatsapp') || '').trim();
    const email = String(form.get('email') || '').trim();
    const description = String(form.get('description') || '').trim();
    const city = String(form.get('city') || 'Hargeisa').trim();
    const address = String(form.get('address') || '').trim();
    const cover_url = String(form.get('cover_url') || '').trim();

    if (!vendor_name || !owner_name || !phone) {
      setMessage('Add vendor name, owner name, and phone number.');
      setSubmitting(false);
      return;
    }

    try {
      const vendor = await createVendor({
        business_id: null,
        owner_user_id: null,
        vendor_name,
        owner_name,
        phone,
        whatsapp: whatsapp || null,
        email: email || null,
        description,
        city,
        address: address || null,
        latitude: null,
        longitude: null,
        logo_url: null,
        cover_url: cover_url || null
      });

      await trackEvent({
        event_name: 'vendor_signup',
        entity_type: 'vendor',
        entity_id: vendor.id,
        city,
        metadata: { vendor_name }
      });

      event.currentTarget.reset();
      setMessage('Vendor application submitted. You can approve/verify vendors from Supabase later.');
    } catch (error) {
      setMessage('Could not submit vendor application. Check Supabase settings and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="vendor_name" placeholder="Vendor/store name" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="owner_name" placeholder="Owner name" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="phone" placeholder="+252 phone number" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="whatsapp" placeholder="WhatsApp number" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="email" type="email" placeholder="Email optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="city" defaultValue="Hargeisa" placeholder="City" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="address" placeholder="Address or landmark" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="cover_url" placeholder="Cover image URL optional" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      </div>
      <textarea name="description" rows={5} placeholder="Describe what your vendor sells" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      {message && <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}
      <button disabled={submitting} className="rounded-2xl bg-brand-red px-5 py-4 font-black text-white disabled:opacity-60">
        {submitting ? 'Submitting...' : 'Submit vendor application'}
      </button>
    </form>
  );
}
