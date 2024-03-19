# Developing

To develop using Stripe:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and log in using `stripe login`
2. Start the dev Supabase instance (Docker) using `cd apps/site && npx supabase start`
3. Start listening to the Stripe webhook using `cd apps/site && yarn stripe:listen`

At this point, you're listening to Stripe changes and syncing them with your local Supabase instance using the webhook. If it's the first time you're doing this or you wiped your Supabase database, you can try updating the Stripe products/prices that you care about and it'll automatically "upsert" them in your local DB.

For example, if you want to get the XY product to be synced, just go to the XY product page on the Stripe dashboard, hit Edit and Update Product, or just re-create them. That'll trigger the `product.update` event on your localhost webhoook, which in turn will upsert the product into your Supabase DB (update if it already exists and insert if there's no record).

Alternatively, you can call the `populateStripeData` function from `supabaseAdmin.ts` to automatically sync your local Supabase DB.

## `TAKEOUT_RENEWAL_COUPON_ID`

We apply a `TAKEOUT_RENEWAL_COUPON_ID` env var is set, it'll be applied to ALL subscriptions as the renewal coupon. We use this to handle 50% off on Takeout renewals

## Special Promotion Code

The active promotion code called "SITE" will be shown on the takeout landing page.
The active promotion code called "SITE-PRO-COMPONENTS" will be shown on the takeout landing page.

## Metadata

We rely on metadata to handle custom features with Stripe. You can search for the mentioned key and values to see them used across the codebase. Here are some docs on the metadata keys we use:

### Customer metadata

#### `supabaseUUID`

Reference to our internal Supabase ID for user

### Product metadata

#### `has_renewals`

If present, after the product is purchased, we automatically create a subscription with 50% of the product price and start billing after 1 year.

#### `claim_type`

If this metadata is not present, we assume the product doesn't have a claiming mechanism and not show the claim link.

How the product can be claimed. could be one of the following values:

- `repo_access` - should be used with [`repository_name`](#repository_name)
- `send_to_link` - should be used with [`usage_link`](#usage_link)

#### `claim_label`

The text on the claim button.

#### `repository_name`

Will be used to invite user to the repository if [`claim_type`](#claim_type) is set to `repo_access`.

#### `usage_link`

Will send the user to the link when the user clicks on the Claim button if [`claim_type`](#claim_type) is set to `usage_link`.

#### `install_instructions`

A text that'll be shown under the product on subscriptions page on how to install/claim it.

#### `slug`

A URL friendly text that may be used for querying. e.g. universal-starter, icon-packs.

### Price metadata

#### `hide_from_lists`

If present, we will hide the price from the site

#### `renewal_price_id`

Set on one-time prices to reference a recurring price. If `has_renewals` is set on the one-time price, we automatically create the recurring price and reference its id under this metadata key.

IMPORTANT: Don't just remove auto-generated prices. If you want to remove them, make sure to remove this metadata on the one-time price as well.
