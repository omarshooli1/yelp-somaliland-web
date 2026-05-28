'use client';

import { FormEvent, useState } from 'react';
import { createProductReview } from '@/lib/marketplace';
import type { Product } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

export function ProductReviewForm({ product }: { product: Product }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const reviewer_name = String(form.get('reviewer_name') || '').trim();
    const reviewer_phone = String(form.get('reviewer_phone') || '').trim();
    const rating = Number(form.get('rating') || 5);
    const comment = String(form.get('comment') || '').trim();

    if (!reviewer_name || !comment) {
      setMessage('Add your name and review comment.');
      setSubmitting(false);
      return;
    }

    try {
      await createProductReview({
        product_id: product.id,
        vendor_id: product.vendor_id || null,
        reviewer_name,
        reviewer_phone: reviewer_phone || null,
        rating,
        comment
      });
      await trackEvent({
        event_name: 'product_review_created',
        entity_type: 'product',
        entity_id: product.id,
        category: product.category,
        city: product.city,
        metadata: { rating }
      });
      event.currentTarget.reset();
      setMessage('Review submitted. Thank you.');
    } catch (error) {
      setMessage('Could not submit review. Check Supabase settings and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="reviewer_name" placeholder="Your name" className="rounded-xl bg-white px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
        <input name="reviewer_phone" placeholder="Phone optional" className="rounded-xl bg-white px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      </div>
      <select name="rating" defaultValue="5" className="rounded-xl bg-white px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red">
        <option value="5">5 stars</option>
        <option value="4">4 stars</option>
        <option value="3">3 stars</option>
        <option value="2">2 stars</option>
        <option value="1">1 star</option>
      </select>
      <textarea name="comment" rows={4} placeholder="Write your review" className="rounded-xl bg-white px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red" />
      {message && <p className="text-sm font-bold text-slate-700">{message}</p>}
      <button disabled={submitting} className="rounded-xl bg-brand-ink px-4 py-3 font-bold text-white disabled:opacity-60">
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  );
}
