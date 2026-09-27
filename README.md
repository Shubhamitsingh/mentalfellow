# Mental Fellow

A fashion storefront for Mental Fellow. Phase 1 is the design system, layout, and a catalog service. Product rows are seed data until you connect Supabase.

Photography in the catalog is placeholder stock. Replace it with licensed brand assets before a public launch.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Supabase project URL and anon key to `.env.local`. Never put the service role key in frontend env files.

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_URL=http://localhost:5173
```

## Scripts

- `npm run dev` — local storefront
- `npm run build` — production build
- `npm run preview` — preview the build
- `npm run lint` — oxlint

## Where things live

- `src/components` — UI, layout, product cards
- `src/features` — pages by area (home, catalog, product, cart)
- `src/services/catalog.js` — product reads. This is the seam to swap for Supabase queries.
- `src/lib/supabase.js` — browser client, anon key only

Guest bag and wishlist are stored on the device. Accounts use Supabase Auth when the keys are set. Checkout does not create orders or take payment until the payment phase.
