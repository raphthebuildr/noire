# NOIRÉ v1 Implementation Plan

Status: implemented; pending live Supabase and Paystack verification  
Last updated: 2026-10-26

## 1. Context

NOIRÉ is a clothing e-commerce concept store. The build must match the WooCommerce v1 functionality described in Notion and use the Stitch designs as the visual source.

- Brief: `NOIRÉ Clothing E-commerce Store` (`3fe691dd-026c-811e-a058-edeba50a9cc7`)
- Tracker: `02 — NOIRÉ Clothing (WooCommerce Fashion Store)` (`3fe691dd-026c-818f-9776-d7a4880e4507`)
- Stitch project: `projects/9027528679702386160` — “NOIRÉ Editorial Fashion Storefront”
- Current codebase: bare Next.js 16.4.3 app; no storefront implementation yet

## 2. Locked Decisions

- Homepage: **Home B**.
- Visual direction: editorial fashion, warm stone background, restrained palette, square corners, no gradients or shadows.
- Typography: **EB Garamond** headings, Inter body/nav/labels, `NOIRÉ` wordmark with `0.2em` tracking.
- Backend: **Supabase** for Postgres, Auth, Storage, and RLS.
- Payments: display prices in **USD**; convert to **NGN** for Paystack at checkout. Test mode first.
- Admin: lightweight custom admin inside the app.
- Imagery: extract Stitch imagery, plus a small 3-image generation pass for missing catalog shots.
- Seed data: demo admin, demo customer, sample orders, reviews, coupon, and full catalog.
- Deferred to v2: Journal, Lookbook, separate Collections pages, standalone Size Guide, Shipping and Returns pages, Wishlist, upsells.

## 3. Design System

- Background: `#F5F2EC`
- Charcoal: `#1C1C1C`
- Muted stone: `#CFC8BC`
- Secondary grey: `#8A8A85`
- Oxblood: `#6B2D2D` — less than 2% of any screen
- Border radius: `0`
- Shadows: none
- Grid: 12-column desktop, 4-column mobile
- Breakpoints: mobile `390px`, tablet `768px`, desktop `1440px`
- Motion: subtle opacity/translate transitions only; respect reduced motion

Stitch screen references:

- About: `c0274424f4114363a6f241a3702e34c0`
- Contact: `a4bc93ffe94c4b679784feeb7ab8fc1f`
- Policies: `281255c5451744f392d8b65861901b81`
- Login: `fb11e5d2ab6c44889008adee30050932`
- Account dashboard: `09466f3a61074f7683945aa1a48877dc`

Missing screens will be composed from the design system:

- Single product
- Checkout
- Order confirmation
- Search results
- 404
- Mobile variants for Home, Cart, Account, Product, and Checkout

## 4. Scope

### Included

- Home
- Shop with same-page category filtering and sorting
- Single product
- Cart
- Checkout and order confirmation
- My Account: login, register, password reset, overview, orders, addresses, details
- About
- FAQ: shipping, returns, sizing
- Contact
- Combined Policies
- Search results
- 404
- Custom admin

### Deferred

- Journal
- Lookbook
- Separate Collections pages
- Standalone Size Guide
- Separate Shipping and Returns pages
- Wishlist
- Upsells and cross-sells
- Real transactional email
- Tax calculation
- Multi-currency

## 5. Architecture

- Next.js 16 App Router
- TypeScript
- Tailwind v4 with CSS theme tokens
- Supabase Auth, Postgres, Storage, RLS
- Paystack InlineJS with hosted redirect fallback
- Zod validation
- Server Components by default
- Client Components only for drawers, filters, quantity controls, forms, and payment popup
- Server Actions for cart, checkout, account, and admin mutations
- Route Handler for the Paystack webhook
- `src/proxy.ts` for Supabase session refresh
- Service-role Supabase client only on the server

### Proposed Routes

- `/` — Home B
- `/shop` — catalog with URL-based filters and sorting
- `/products/[slug]` — product detail
- `/cart` — cart
- `/checkout` — checkout
- `/checkout/callback` — Paystack verification callback
- `/checkout/success` — order confirmation
- `/account` — account overview
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/account/orders`
- `/account/orders/[id]`
- `/account/addresses`
- `/account/settings`
- `/about`
- `/faq`
- `/contact`
- `/policies`
- `/search`
- `/admin`
- `/admin/products`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/customers`
- `/admin/coupons`
- `/admin/reviews`
- `/admin/messages`
- `/api/paystack/webhook`
- `/auth/callback`
- `not-found.tsx`
- `error.tsx`
- `loading.tsx`

## 6. Data Model

### Catalog

- `categories` — id, name, slug, description, position
- `collections` — id, name, slug, description
- `products` — id, slug, name, category, collection, short description, description, material, fit, care, price, sale price, status, featured/new flags, timestamps
- `product_variants` — id, product, SKU, colour, size, price override, stock quantity, active flag
- `product_images` — id, product, variant, URL, alt text, position, primary flag

### Customers and Carts

- `profiles` — id, full name, phone, role, timestamps
- `addresses` — id, user, label, recipient, address lines, city, state, postal code, country, phone, default flag
- `carts` — id, token, user, timestamps
- `cart_items` — id, cart, variant, quantity

### Orders

- `orders` — id, order number, user, email, status, payment reference, payment status, subtotal, discount, shipping, tax, total, currency, addresses, shipping method, coupon code, notes, timestamps
- `order_items` — id, order, product, variant, product name, variant label, SKU, unit price, quantity, line total
- `order_events` — id, order, status, note, timestamp

### Marketing and Support

- `coupons` — id, code, type, value, minimum subtotal, maximum discount, start/end, usage limit, usage count, active flag
- `reviews` — id, product, user, author name, rating, title, body, moderation status, sample flag, timestamp
- `contact_messages` — id, name, email, order number, subject, message, status, timestamp
- `newsletter_subscribers` — id, email, source, timestamp

### RLS and Security

- Public read: active categories, collections, products, variants, images, approved reviews
- Public insert: contact messages, newsletter subscribers
- Authenticated read/update: own profile, addresses, orders, order items
- Admin: full access via `app_metadata.role = "admin"`
- Carts, orders, coupons, and payment finalization are server-managed
- Service-role key never exposed to the client
- Product image bucket: public read, admin write

## 7. Storefront Behavior

### Catalog

Normalize the catalog to the brief:

- 12 products
- 6 categories
- Sizes S–XXL for tops
- Sizes 28–36 for trousers
- One size for accessories
- Colours: Black, Bone, Slate, Stone, Charcoal, Sand, Natural
- Two sale products
- Two out-of-stock variants

Product list from the brief:

1. Heavyweight Oversized Tee — $65
2. Everyday Crew Tee — $45
3. Heavyweight Pullover Hoodie — $110
4. Relaxed Zip Hoodie — $115
5. Relaxed Oxford Shirt — $95
6. Linen Blend Overshirt — $95
7. Straight Leg Trousers — $110
8. Pleated Wide Trousers — $120
9. Coach Jacket — $135
10. Lightweight Bomber — $140
11. Canvas Tote — $40
12. Six-Panel Cotton Cap — $35

### Shop

- URL-based filters: category, collection, size, colour, price, availability
- Sorting: featured, best selling, newest, price ascending, price descending
- Product cards with quick add
- Mid-grid manifesto band
- Empty state for no matches
- Responsive filter sidebar with counts and active filter chips

### Product Detail

- Gallery with thumbnail rail
- Breadcrumb
- Title, rating, price, sale price
- Colour and size selection
- Stock state
- Quantity
- Add to bag
- Buy now
- Details, materials, care, shipping and returns accordions
- Related products from the same category

### Cart

- Line items with image, variant, price, quantity, remove
- Coupon entry
- Shipping estimate
- Free-shipping progress toward `$150`
- Summary with subtotal, discount, shipping, tax, total
- Checkout CTA
- Empty state
- “Complete the uniform” curated pairings
- Styling advice and newsletter modules

## 8. Checkout and Paystack

### Defaults

- Guest checkout allowed
- Logged-in orders attach to the account
- Standard shipping: `$8`
- Free standard shipping over `$150`
- Express shipping: `$18`
- Tax: `$0` with a concept-store note
- Demo coupon: `NOIRE10` for 10% off
- Display currency: USD
- Paystack currency: NGN, converted with `NGN_PER_USD`

### Flow

1. Server Action validates cart, coupon, stock, shipping, and totals.
2. Create a pending order with a unique reference.
3. Convert the USD total to NGN subunits and initialize Paystack with the NGN amount, customer email, callback URL, and metadata.
4. Open Paystack popup via `@paystack/inline-js`.
5. Fall back to Paystack `authorization_url` if popup is unavailable.
6. Verify the transaction on callback.
7. Verify `x-paystack-signature` on the webhook using HMAC SHA512 over the raw body.
8. Finalize idempotently through a Postgres RPC.
9. Mark the order paid, decrement stock with row locks, clear the cart, and record an order event.
10. If stock is unavailable after payment, flag the order for admin review/refund.
11. Return `200` from the webhook quickly; Paystack retries failed deliveries.

### Order Statuses

- `pending_payment`
- `paid`
- `processing`
- `shipped`
- `delivered`
- `cancelled`
- `refunded`
- `paid_out_of_stock`

## 9. Auth and Account

- Supabase email/password auth with `@supabase/ssr`
- Register, login, logout
- Forgot password and reset password
- Seed confirmed demo users
- Disable mandatory email confirmation for the demo if needed
- Account overview
- Order history and order detail
- Address book
- Profile details
- Rewrite Stitch account copy to remove fake 2FA, “Footwear”, and unrelated names

## 10. Admin

- Protected `/admin` layout and role check
- Dashboard: revenue, order counts, low stock, recent messages
- Products: create/edit, variants, stock, pricing, images, publish state
- Orders: list, filter, detail, status updates, tracking number, payment state, timeline
- Customers: read-only list and order history
- Coupons: create/edit/deactivate
- Reviews: approve/reject
- Messages: read and mark handled

## 11. Content and Assets

- Use Home B copy and section order
- Rewrite FAQ, policies, About, Contact, and account copy for consistency
- Add a footer concept notice
- Label sample reviews clearly
- Remove fake “verified” badges and unsupported claims
- Extract Stitch images into `public/images/`
- Convert to WebP/AVIF
- Keep an asset register with source screen, product, and notes
- Map 9 products to existing Stitch shots
- Generate 3 missing images:
  - Black pullover hoodie
  - Black straight trousers
  - Stone six-panel cap
- Use closest existing crops where a colourway is only approximate; do not fake precise recolours

## 12. Proposed File Structure

```text
src/
  app/
    (store)/
      layout.tsx
      page.tsx
      shop/page.tsx
      products/[slug]/page.tsx
      cart/page.tsx
      checkout/page.tsx
      checkout/callback/route.ts
      checkout/success/page.tsx
      account/
        layout.tsx
        page.tsx
        login/page.tsx
        register/page.tsx
        forgot-password/page.tsx
        reset-password/page.tsx
        orders/page.tsx
        orders/[id]/page.tsx
        addresses/page.tsx
        details/page.tsx
      about/page.tsx
      faq/page.tsx
      contact/page.tsx
      policies/page.tsx
      search/page.tsx
      not-found.tsx
    admin/
      layout.tsx
      page.tsx
      products/page.tsx
      products/[id]/page.tsx
      orders/page.tsx
      orders/[id]/page.tsx
      customers/page.tsx
      coupons/page.tsx
      reviews/page.tsx
      messages/page.tsx
    api/paystack/webhook/route.ts
    auth/callback/route.ts
    layout.tsx
    globals.css
  components/
    layout/
    commerce/
    product/
    forms/
    admin/
    ui/
  lib/
    supabase/client.ts
    supabase/server.ts
    supabase/admin.ts
    paystack.ts
    auth.ts
    cart.ts
    products.ts
    orders.ts
    validation.ts
    formatting.ts
    constants.ts
  proxy.ts
  types/
supabase/
  migrations/
  seed.sql
scripts/
  seed.ts
public/
  images/
docs/
  asset-register.md
tests/
  e2e/
```

## 13. Build Sequence

### Phase 0 — Assets and Content

- Extract Stitch imagery
- Generate the 3 missing product images
- Build the asset register
- Finalize catalog data, copy, FAQ, and policies
- Normalize the 12 products and variants

### Phase 1 — Foundation

- Install dependencies
- Add design tokens and fonts
- Build root layout, announcement bar, header, footer
- Build UI primitives
- Add metadata, sitemap, robots, and concept notice

### Phase 2 — Data

- Create Supabase migrations
- Add RLS policies
- Add storage bucket and policies
- Add auth helpers and `proxy.ts`
- Add seed script and demo data
- Add typed database helpers

### Phase 3 — Storefront

- Home B
- Shop filters, sorting, search
- Product detail
- Cart
- Mini-cart
- Responsive states

### Phase 4 — Checkout

- Checkout form
- Coupon and shipping logic
- Paystack initialization
- Callback verification
- Webhook verification and idempotent finalization
- Order confirmation
- Order history

### Phase 5 — Account and Content

- Login, register, password reset
- Account overview, orders, addresses, details
- About, FAQ, Contact, Policies
- Search results
- 404

### Phase 6 — Admin

- Admin layout and role protection
- Dashboard
- Products and inventory
- Orders
- Customers
- Coupons
- Reviews
- Messages

### Phase 7 — QA and Deploy

- Responsive checks at 390, 768, and 1440
- Accessibility pass
- SEO and structured data
- Playwright critical flows
- `pnpm lint`, typecheck, and build
- Deploy to Vercel
- Configure Supabase redirect URLs
- Configure Paystack webhook
- Run test payment and smoke test

## 14. Acceptance Criteria

- All 12 products render with correct variants, stock, and imagery.
- Shop filtering, sorting, search, quick add, and cart work.
- Coupon, shipping threshold, and totals are correct.
- Paystack test payment creates a paid order, decrements stock, clears the cart, and shows confirmation.
- Webhook signature verification and idempotency work.
- Account registration, login, reset, and order history work.
- Admin can manage products, orders, coupons, reviews, and messages.
- All brief pages exist and are responsive.
- No fake claims, fake verified badges, or misleading tax/email behavior.
- `pnpm lint`, typecheck, build, and critical Playwright flows pass.

## 15. Prerequisites and Blockers

1. The Supabase project URL exists (`https://enwgebmhkykushstnjwd.supabase.co`), but the database is unreachable:
   - `select 1` returns `Database is possibly not accessible at the moment`.
   - Resume/provision the project in the Supabase dashboard.
2. Add the following to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NGN_PER_USD`
3. Confirm the Paystack account can accept NGN.
   - Set `NGN_PER_USD` to the current conversion rate; the local fallback is `1600`.
4. Confirm the 3 generated product images are acceptable before catalog freeze.

## 16. Defaults and Assumptions

- Guest checkout is allowed.
- Tax is `$0` with a concept note.
- Contact and newsletter submissions are stored in Supabase only.
- Auth emails use Supabase’s built-in mailer.
- No real transactional email in v1.
- USD is the only display currency; Paystack charges the NGN equivalent.
- No tax engine.
- No wishlist.
- No cart cross-sells.
- No production deployment until Paystack test flow passes.

## 17. Immediate Next Step

1. Resume the Supabase project and add env keys.
2. Generate the 3 missing product images.
3. Extract and optimize the remaining Stitch assets.
4. Start Phase 1 foundation while the database is being made available.
