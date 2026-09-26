/**
 * Canonical origin for the public site. Set NEXT_PUBLIC_SITE_URL in production
 * (e.g. https://bahsclub.vercel.app). Falls back to Vercel's auto URL, then localhost.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000"
).replace(/\/+$/, "");
