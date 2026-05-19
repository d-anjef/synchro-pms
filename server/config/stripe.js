import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
  : null;

export default stripe;

export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
  business_yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
};