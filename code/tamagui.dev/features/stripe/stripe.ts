import Stripe from 'stripe'

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ??
    'sk_test_51MlzkhAbFJBp9fF3V3iJ2iUAijWn103UD7fdPa8V7gnbuVwwpIldBopGDqetvXDKrx3J3BrLnvRTDDLoMmildqOp00daeJS35c',
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'Next.js Subscription Starter',
      version: '0.1.0',
    },
  }
)
