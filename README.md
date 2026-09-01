# CR Acoustic Frontend

Customer-facing storefront for the CR Acoustic e-commerce platform.

## Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- Axios

## Features
- Homepage with category and featured product sections
- Product listing and filtering by category, brand, and price
- Product detail pages with wishlist and cart flows
- Cart, checkout, and order confirmation screens
- Responsive storefront UI for desktop and mobile

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in this folder if needed:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Production build
```bash
npm run build
```

## Notes
- The frontend loads catalog data from the backend API instead of local mock arrays.
- For deployment, set the `VITE_API_URL` value to the live backend URL.
- The app is intended to be deployed on Vercel or another static hosting platform.
