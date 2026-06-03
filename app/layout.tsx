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
        <header className="sticky top-0 z-30 bg-[#C41200]">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-2xl font-black italic text-white tracking-tight">
              yelp
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/" className="px-3 py-2 text-sm font-semibold text-white hover:text-white/80">
                Home
              </Link>
              <Link href="/marketplace" className="px-3 py-2 text-sm font-semibold text-white hover:text-white/80">
                Market
              </Link>
              <Link href="/vendors" className="px-3 py-2 text-sm font-semibold text-white hover:text-white/80">
                Vendors
              </Link>
              <Link href="/taxi" className="px-3 py-2 text-sm font-semibold text-white hover:text-white/80">
                Taxi
              </Link>
              <Link href="/map" className="px-3 py-2 text-sm font-semibold text-white hover:text-white/80">
                Map
              </Link>
              <Link href="/businesses" className="px-3 py-2 text-sm font-semibold text-white hover:text-white/80">
                Browse
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/write-review" className="rounded border border-white px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/10">
                Write a Review
              </Link>
              <Link href="/login" className="rounded bg-white px-4 py-1.5 text-sm font-semibold text-[#C41200] hover:bg-white/90">
                Log In
              </Link>
              <Link href="/signup" className="rounded border border-white px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/10">
                Sign Up
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
