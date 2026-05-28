import { supabase } from './supabase';

const consentKey = 'ys_data_consent';
const anonymousIdKey = 'ys_anonymous_id';

export const getAnonymousId = () => {
  if (typeof window === 'undefined') return null;
  let id = window.localStorage.getItem(anonymousIdKey);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(anonymousIdKey, id);
  }
  return id;
};

export const hasDataConsent = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(consentKey) === 'granted';
};

export const setDataConsent = async (granted: boolean) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(consentKey, granted ? 'granted' : 'denied');

  if (supabase) {
    await supabase.from('user_consents').insert({
      anonymous_id: getAnonymousId(),
      consent_type: 'analytics_and_marketplace_insights',
      granted,
      source: 'web_app'
    });
  }
};

export const trackEvent = async ({
  event_name,
  entity_type,
  entity_id,
  search_query,
  category,
  city,
  metadata = {}
}: {
  event_name: string;
  entity_type?: string;
  entity_id?: string;
  search_query?: string;
  category?: string;
  city?: string;
  metadata?: Record<string, unknown>;
}) => {
  if (!hasDataConsent() || !supabase) return;

  await supabase.from('analytics_events').insert({
    event_name,
    page_path: window.location.pathname,
    entity_type,
    entity_id,
    search_query,
    category,
    city,
    metadata,
    consent_granted: true,
    anonymous_id: getAnonymousId()
  });
};
