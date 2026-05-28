# Cloud Deployment Plan

This app should use:

- Supabase for database, auth, storage, and row-level security.
- Vercel for hosting the Next.js app.

## 1. Create Supabase Project

1. Go to Supabase and create a new project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Project Settings > API, copy:
   - Project URL
   - anon/public key
   - service role key

## 2. Local Environment

Create `.env.local` in this folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then seed demo businesses:

```powershell
npm.cmd run seed
```

## 3. Test Locally

```powershell
npm.cmd run dev:clean
```

Open:

```text
http://127.0.0.1:3003
```

## 4. Push To GitHub

Create a GitHub repository for `yelp-somaliland-web` and push the code.

## 5. Deploy To Vercel

1. Go to Vercel.
2. Import the GitHub repository.
3. Set the project root to `yelp-somaliland-web` if deploying from the larger workspace.
4. Add environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
5. Deploy.

Vercel automatically builds Next.js projects. Supabase and Vercel both recommend setting environment variables per environment: Production, Preview, and Development.

## 6. After Deploy

1. Open the live Vercel URL.
2. Test:
   - business listings
   - vendor signup
   - product listing
   - marketplace order
   - delivery driver accept
   - taxi request
   - taxi driver accept
   - consent banner
3. Check Supabase tables to confirm rows are being saved.

## 7. Production Checklist

Before public launch:

- Replace broad MVP RLS policies with stricter user-role policies.
- Add real Supabase Auth for customers, vendors, drivers, and admins.
- Add admin dashboard for approvals.
- Add privacy policy and terms.
- Add storage buckets for product/vendor/business images.
- Add moderation for reviews and listings.
- Add monitoring and error logging.
- Add custom domain.
