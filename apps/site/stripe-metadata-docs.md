We rely on metadata to handle custom features with Stripe. You can search for the mentioned key and values to see them used across the codebase. Here are some docs on all the metadata we use:

## Coupon metadata

### `show_on_site`

May be set to `1` to show on the takeout landing page - only one will be shown there.

## Product metadata

### `claim_type`

How the product can be claimed. could be one of the following values:

- `repo_access` - should be used with [`repository_name`](#repository_name)

### repository_name

Will be used to invite user to the repository if [`claim_type`](#claim_type) is set to `repo_access`.

### `install_instructions`

A text that'll be shown under the product on subscriptions page on how to install/claim it.

### `slug`

A URL friendly text that may be used for querying. e.g. starter-pack, icon-packs.

## Price metadata

`is_one_time`

May be set to `1` to apply automatic 100% discount after the first payment for subsequent invoices.
