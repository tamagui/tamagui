# 📦 Stripe Local Testing Guide (Tamagui Dev Environment)

This document explains how to properly test Stripe subscriptions in the local development environment for Tamagui, including webhook configuration, database caveats, and reset operations.

---

## ✅ Prerequisites

- Supabase only has a **production database** (no separate dev DB)
- Stripe is operated in **test mode**
- Webhook events are handled locally via `stripe listen`

---

## 1. Enable Stripe Test Mode

Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard) and toggle **"Test mode"** in the top-right corner.

---

## 2. Obtain API Keys and Setup `.env`

From the **Developers > API keys** section in the dashboard, copy the following:

- **Publishable key** → `pk_test_...`
- **Secret key** → `sk_test_...`

Update your `.env` as follows:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
```

---

## 3. How Subscription Flows Work

The Tamagui site handles Stripe subscriptions in the following way:

### 💳 Subscription API Endpoints

- `create-subscription+api.ts`
- `upgrade-subscription+api.ts`

These endpoints initiate the Stripe checkout session.

### 📡 Webhook Receiver

- `webhook+api.ts`

This endpoint receives Stripe events and persists subscription data into Supabase.
Stripe events like `checkout.session.completed`, `customer.subscription.created`, and `invoice.paid` are handled here.

---

## 4. Start Stripe Webhook Listener Locally

To capture webhook events locally while running your dev server, use the following command:

```bash
stripe listen --load-from-webhooks-api --forward-to http://localhost:8081/api/stripe/webhook
```

This forwards all webhook events configured in your Stripe dashboard to your local server.

📚 Ref: [Stripe Webhook Docs](https://docs.stripe.com/webhooks)

---

## 5. Important: Stripe Test Data vs Production DB

Since you're using Stripe in test mode and Supabase in production mode, a mismatch can occur:

- The `customers` table in Supabase uses a foreign key to `auth.user.id`
- You **cannot insert duplicate Stripe customers** for the same user
- Attempting to create test customers for an already-existing user in production will fail

---

## 6. Resetting Customer & Subscription for Testing

### 🔻 Delete Existing Customer Record

Use the primary key (`auth.user.id`) to find and delete the corresponding record from the `customers` table manually or via Supabase UI/SQL.

### 🔻 Delete Existing Subscription Record

Use the provided script to remove active subscriptions for a user:

```bash
cd code/tamagui.dev
node ./scripts/cancel-subscription.mjs <USER_ID>
```

This script will:

- Check if the user exists in Supabase
- Find all active subscriptions for the user
- Update the `subscriptions` table in Supabase with status: `canceled`

📄 Script file:
`code/tamagui.dev/scripts/cancel-subscription.mjs`

---

## 7. How "Pro Plan" Status is Determined

A user is considered to be on the "Pro" plan if they have an active or trialing subscription named **"Tamagui Pro"**.

This status is determined by checking the `subscriptions` table in Supabase.

📄 Logic from:
`code/tamagui.dev/features/user/subscription/eligibility.ts`

```ts
const hasProductAccess = (subscriptions, productName) =>
  subscriptions?.some(
    (sub) =>
      (sub.status === 'active' || sub.status === 'trialing') &&
      sub.subscription_items?.some((item) => item.price?.product?.name === productName)
  )
```

This logic is used to check access to specific features like Pro, Chat, or Support tiers.

---

## 8. Local Dev Workflow Summary

### 🧪 Steps to Prepare for Testing

1. Set up your `.env` with Stripe test keys
2. Remove the user's row from the `customers` table
3. Run the subscription cancel script if needed
4. Start `stripe listen` in parallel with the dev server
5. Go through the subscription flow in the frontend

---

## 9. Common Errors

### ❌ No such PaymentMethod: 'pm_XXXX'

**Causes:**

- Invalid or deleted `payment_method.id`
- Mixing test and live API keys
- Attempting to reuse expired or session-only methods

**Solutions:**

- Confirm the payment method ID is valid
- Check whether you're using the correct `sk_test_...` or `sk_live_...` key
- Use stripe `paymentMethods.list` to view available methods
