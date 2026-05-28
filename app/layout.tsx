import type { Metadata } from 'next';
import Link from 'next/link';
import { DataConsentBanner } from '@/components/DataConsentBanner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yelp Somaliland',
  description: 'Find trusted businesses in Somaliland.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-brand-ink antialiased">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-black">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-red text-white">YS</span>
              <span>Yelp Somaliland</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Home
              </Link>
              <Link href="/marketplace" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Market
              </Link>
              <Link href="/vendors" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Vendors
              </Link>
              <Link href="/taxi" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Taxi
              </Link>
              <Link href="/admin" className="rounded-full bg-brand-ink px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
                Admin
              </Link>
              <Link href="/driver" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Driver
              </Link>
              <Link href="/map" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Map
              </Link>
              <Link href="/businesses" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Browse
              </Link>
            </div>
          </nav>
        </header>
        {children}
        <DataConsentBanner />
      </body>
    </html>
  );
}
