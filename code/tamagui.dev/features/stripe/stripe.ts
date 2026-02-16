import Stripe from 'stripe'

const isTestMode =
  process.env.STRIPE_TEST_MODE === 'true' || process.env.NODE_ENV === 'development'

const secretKey = isTestMode
  ? process.env.STRIPE_SECRET_KEY_TEST
  : process.env.STRIPE_SECRET_KEY

export const stripe = new Stripe(secretKey!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: 'Next.js Subscription Starter',
    version: '0.1.0',
  },
})
