# Wanderly

A premium travel agency website focused on India, with selected international journeys. Frontend only: all data is mock data and every booking, login and payment is simulated in the browser.

## Stack

React 19 + Vite, React Router, Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger, Lenis smooth scroll, Lottie, React Hook Form + Zod, Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Pages

Home, Destinations and destination details, Tour packages and package details, Custom trip planner, Booking flow, Booking confirmation, Track booking, Login and signup, Customer dashboard, Saved trips, Offers, About, Contact, Journal and articles, FAQ, Privacy, Terms, Cancellation and refund policy, Admin dashboard, and a 404 page.

## Project notes

- Brand name and wordmark styling live in `src/config/brand.js`.
- Mock data lives in `src/data/` (destinations, packages, bookings, reviews, offers, blog, FAQs).
- App state (auth, wishlist, bookings, admin catalogue, enquiries) is kept in `src/context/AppContext.jsx` and persisted to `localStorage`.
- Demo booking IDs for the tracking page: `WL-48217`, `WL-51934`, `WL-29014`, `WL-33480`.
- Coupon codes: `WANDER10`, `HONEYMOON15`, `WINTER5K`, `FAMILY8`.
- Photography from Unsplash.
