We rely on metadata to handle custom features with Stripe. You can search for the mentioned key and values to see them used across the codebase. Here are some docs on all the metadata we use:

# Important Note

We apply a `TAKEOUT_RENEWAL_COUPON_ID` env var is set, it'll be applied to ALL subscriptions as the renewal coupon. We use this to handle 50% off on Takeout renewals

## Metadata

### Customer metadata

#### `supabaseUUID`

Reference to our internal Supabase ID for user

### Product metadata

#### `has_renewals`

If present, after the product is purchased, we automatically create a subscription with 50% of the product price and start billing after 1 year.

#### `claim_type`

How the product can be claimed. could be one of the following values:

- `repo_access` - should be used with [`repository_name`](#repository_name)

#### `claim_label`

The text on the claim button.

#### `repository_name`

Will be used to invite user to the repository if [`claim_type`](#claim_type) is set to `repo_access`.

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

## Special Promotion Code

The active promotion code called "SITE" will be shown on the takeout landing page.
