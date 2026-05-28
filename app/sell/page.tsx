import { SellForm } from './SellForm';

export default function SellPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Seller tools</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Sell on Yelp Somaliland</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Add products, services, food items, or local offers. Buyer requests are saved so sellers can follow up.
        </p>
      </div>
      <SellForm />
    </main>
  );
}
