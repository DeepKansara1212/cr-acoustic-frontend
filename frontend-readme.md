# CR Acoustic Customer Frontend

Responsive customer storefront for browsing and purchasing musical instruments. This React/Vite SPA is independent from `../cr-admin`.

## Stack, setup, and commands

React 19, TypeScript, Vite, React Router 7, Tailwind CSS 4, Radix UI, Zustand 5, Axios, TanStack React Query dependencies, GSAP, Three.js/React Three Fiber/Drei, Lucide React, and Oxlint. Requires Node.js 18+ and npm.

```bash
npm install
copy .env.example .env
npm run dev
```

PowerShell: `Copy-Item .env.example .env`. Default URL is `http://localhost:5173`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL in `src/lib/api.ts`. |

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run build` | TypeScript build and production bundle |
| `npm run lint` | Oxlint |
| `npm run preview` | Preview production bundle |

## Routes and features

| Route | Page | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/products`, `/products/:slug` | Listing and detail | Public |
| `/cart`, `/wishlist` | Cart and wishlist | Public |
| `/login`, `/signup`, `/forgot-password` | Authentication screens | Public |
| `/checkout`, `/order-confirmation/:orderId`, `/account` | Checkout, confirmation, account | `ProtectedRoute` |

Features include a Three.js hero scene, category/featured/best-seller sections, catalog search/filter/sort, brand and price browsing, related products, wishlist, cart totals, checkout, order confirmation, account/profile editing, saved addresses, responsive navigation, mobile layouts, and toasts. The Razorpay-style modal is simulated and does not charge a card.

## State and API boundary

`src/lib/api.ts` is an Axios client with `withCredentials: true`. `catalogStore.ts` reads products/categories from the backend. Other persisted Zustand stores drive the demo:

| Store | Responsibility | Storage |
| --- | --- | --- |
| `authStore.ts` | Demo users, auth, profile | `cr-auth` |
| `catalogStore.ts` | Products and categories | Zustand |
| `cartStore.ts` | Cart and totals | Browser |
| `wishlistStore.ts` | Wishlist | Browser |
| `addressStore.ts` | Addresses | Browser |
| `orderStore.ts` | Demo orders/status | Browser |
| `toastStore.ts` | Notifications | Memory |

This is a hybrid demo: auth, cart, wishlist, addresses, and orders do not synchronize with backend endpoints. Demo login is `demo@cracoustic.com` / `password123`. The auth store persists plaintext demo passwords and is not production authentication. Forgot-password is UI-only and the backend has no reset route.

## Source and deployment

```text
src/App.tsx                 Routes, navbar, footer, toaster
src/pages                  Home, catalog, auth, cart, checkout, account
src/components             Layout, product, auth, checkout, Three.js, UI
src/store                  Persisted Zustand stores
src/lib/api.ts              Axios client
src/data, src/assets        Supporting data and static assets
vite.config.ts              Port 5173
vercel.json                 SPA fallback
```

Run `npm run build` and deploy `dist` to Vercel or another static host. Set `VITE_API_URL` at build time and backend `CLIENT_URL` to this exact HTTPS origin. Do not expose backend secrets in Vite variables. Production work still needed: API-backed auth/cart/order/payment flows and replacement of placeholder seeded imagery.
