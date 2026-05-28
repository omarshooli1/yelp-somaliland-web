import { VendorSignupForm } from './VendorSignupForm';

export default function VendorSignupPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Vendor onboarding</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Become a marketplace vendor</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Vendors can create a storefront, list products, receive buyer requests, and build reviews.
        </p>
      </div>
      <VendorSignupForm />
    </main>
  );
}
