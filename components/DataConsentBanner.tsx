'use client';

import { useEffect, useState } from 'react';
import { hasDataConsent, setDataConsent } from '@/lib/analytics';

export function DataConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasDataConsent() && window.localStorage.getItem('ys_data_consent') !== 'denied');
  }, []);

  const choose = async (granted: boolean) => {
    await setDataConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-3xl bg-brand-ink p-5 text-white shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-white/85">
          Help improve search, selling, delivery, and local recommendations by allowing consent-based analytics.
        </p>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => choose(false)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Not now
          </button>
          <button onClick={() => choose(true)} className="rounded-full bg-brand-red px-4 py-2 text-sm font-bold">
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
