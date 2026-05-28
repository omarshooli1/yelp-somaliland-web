# Production Checklist

## Supabase

- Run `supabase/schema.sql`.
- Enable email or phone auth.
- Create roles: admin, vendor, driver, customer.
- Tighten RLS policies before public launch.
- Create image storage buckets.
- Add indexes for high-traffic search fields.
- Back up the database.

## Vercel

- Add environment variables for Production and Preview.
- Confirm build command: `npm run build`.
- Confirm root directory: `yelp-somaliland-web`.
- Add custom domain.
- Enable deployment protection for Preview if needed.

## App

- Add admin dashboard.
- Add vendor approval workflow.
- Add driver approval workflow.
- Add report/remove flow for bad reviews.
- Add privacy policy.
- Add terms of service.
- Add public contact/support page.

## Launch

- Seed real Hargeisa businesses.
- Recruit first vendors.
- Recruit first taxi and delivery drivers.
- Test end-to-end with real phones.
- Start with manual payments: cash, Zaad, eDahab.
