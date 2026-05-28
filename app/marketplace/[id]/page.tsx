import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProductReviews, getVendorById } from '@/lib/marketplace';
import { BuyProductForm } from './BuyProductForm';
import { ProductReviewForm } from './ProductReviewForm';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const [vendor, reviews] = await Promise.all([
    product.vendor_id ? getVendorById(product.vendor_id) : Promise.resolve(null),
    getProductReviews({ productId: product.id })
  ]);

  const mapUrl = product.latitude && product.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(`${product.longitude - 0.01},${product.latitude - 0.01},${product.longitude + 0.01},${product.latitude + 0.01}`)}&layer=mapnik&marker=${encodeURIComponent(`${product.latitude},${product.longitude}`)}`
    : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/marketplace" className="text-sm font-bold text-brand-red">← Back to marketplace</Link>
      <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="relative h-[420px] bg-slate-100">
              <Image
                src={product.images[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200'}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{product.category}</span>
                {product.verified_seller && <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-brand-green">Verified seller</span>}
              </div>
              <h1 className="mt-4 text-4xl font-black">{product.title}</h1>
              <p className="mt-3 text-2xl font-black text-brand-red">${product.price_usd.toFixed(2)}</p>
              <p className="mt-5 text-lg leading-8 text-slate-700">{product.description}</p>
              {vendor && (
                <Link href={`/vendors/${vendor.id}`} className="mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-brand-ink">
                  Visit vendor: {vendor.vendor_name}
                </Link>
              )}
            </div>
          </div>

          {mapUrl && (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="p-5">
                <h2 className="text-xl font-black">Seller location</h2>
                <p className="mt-1 text-slate-600">{product.address}, {product.city}</p>
              </div>
              <iframe title={`${product.title} seller map`} src={mapUrl} className="h-[320px] w-full border-0" />
            </div>
          )}

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Product reviews</h2>
            <div className="mt-5 space-y-4">
              {reviews.length ? reviews.map((review) => (
                <article key={review.id} className="rounded-2xl bg-slate-50 p-5">
                  <div className="font-black text-brand-red">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p className="mt-2 font-bold">{review.reviewer_name}</p>
                  <p className="mt-2 text-slate-700">{review.comment}</p>
                </article>
              )) : <p className="text-slate-600">No product reviews yet.</p>}
            </div>
            <ProductReviewForm product={product} />
          </div>
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-black">Buy this item</h2>
          <div className="my-5 rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="font-bold">{product.seller_name}</p>
            <p className="mt-1 text-slate-600">{product.seller_phone}</p>
          </div>
          <BuyProductForm product={product} />
        </aside>
      </section>
    </main>
  );
}
