# Yelp Somaliland MVP

Next.js + Supabase MVP for a Somaliland business directory.

## Run locally

```powershell
cd "C:\Users\Gabileytech\OneDrive\Desktop\LandFind_Desktop_Copy\yelp-somaliland-web"
npm.cmd run dev -- --port 3001
```

Open `http://localhost:3001`.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

5. Seed sample Hargeisa businesses:

```powershell
npm.cmd run seed
```

Without Supabase keys, the app uses local demo data so the UI still works.

## Cloud deployment

See `DEPLOYMENT.md` and `PRODUCTION_CHECKLIST.md`.

## Included

- Homepage search
- Business listing page
- Business profile page
- OpenStreetMap business map page
- Restaurant ordering page
- Driver dispatch page for accepting open delivery orders
- Marketplace selling and buyer-request flow
- Vendor signup, storefronts, vendor products, and product reviews
- Taxi hailing request page and driver accept board
- Protected admin dashboard at `/admin`
- Consent-based analytics tables for product, order, and search insights
- Categories: restaurants, cafes, hotels, pharmacies, clinics, gyms, barbers, supermarkets
- Supabase schema for `businesses` and `reviews`
- Hargeisa seed script
- TypeScript and Tailwind CSS
