export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}

export function getSupabaseServiceConfig() {
  const config = getSupabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!config || !secretKey) return null;

  return { ...config, secretKey };
}

export function getPaystackConfig() {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!publicKey || !secretKey) return null;

  return { publicKey, secretKey };
}

export const CURRENCY = "USD";
export const PAYMENT_CURRENCY = "NGN";

const DEFAULT_NGN_PER_USD = 1600;

export function getNgnPerUsd() {
  const raw = process.env.NGN_PER_USD;
  const rate = raw ? Number(raw) : DEFAULT_NGN_PER_USD;

  if (!Number.isFinite(rate) || rate <= 0) return null;

  return rate;
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}
