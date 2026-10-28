# NOIRÉ

Editorial fashion storefront built with Next.js 16, Supabase, and Paystack.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4 with CSS theme tokens
- Supabase Auth, Postgres, RLS
- Paystack InlineJS with hosted redirect fallback
- Zod validation

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Environment

Fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://enwgebmhkykushstnjwd.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The secret key is server-only. Never expose it to the browser.

## Database

Apply the migrations in `supabase/migrations/` to the Supabase project, then run
`supabase/seed.sql`. The seed creates:

- 6 categories, 3 collections, 12 products, variants, and images
- Demo admin: `admin@noire.test` / `NoireDemo123!`
- Demo customer: `customer@noire.test` / `NoireDemo123!`
- Demo orders, reviews, an address, a contact message, and the `NOIRE10` coupon

If using the Supabase CLI:

```bash
supabase link --project-ref enwgebmhkykushstnjwd
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

Or run the SQL files in the Supabase SQL editor.

The catalog is code-managed in `src/lib/catalog.ts` for v1 so the storefront and
checkout always agree. The database catalog is seeded for admin/account context.

## Payments

Checkout creates a pending order in USD, initializes Paystack in NGN, and
verifies the transaction on callback and webhook. Storefront and order totals
stay in USD; only the Paystack charge is converted.

- Set `NGN_PER_USD` to the current conversion rate. The local fallback is `1600`.
- Paystack amounts are sent in NGN subunits (kobo).
- Webhook URL: `https://<your-domain>/api/paystack/webhook`
- Local webhook testing needs a public tunnel (for example `ngrok` or a deployed
  preview). The browser callback works on localhost.
- The webhook verifies `x-paystack-signature` with HMAC SHA512 over the raw body.
- `finalize_order` is idempotent and decrements database variant stock when a
  variant is linked.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm start
```

## Routes

Storefront: `/`, `/shop`, `/products/[slug]`, `/cart`, `/checkout`,
`/checkout/success`, `/checkout/failure`, `/account/*`, `/login`, `/register`,
`/forgot-password`, `/reset-password`, `/about`, `/faq`, `/contact`, `/policies`,
`/search`.

Admin: `/admin`, `/admin/orders`, `/admin/orders/[id]`, `/admin/products`,
`/admin/customers`, `/admin/coupons`, `/admin/reviews`, `/admin/messages`.

API/callbacks: `/api/checkout`, `/api/checkout/verify`, `/api/paystack/webhook`,
`/checkout/callback`, `/auth/callback`, `/api/contact`, `/api/newsletter`.
