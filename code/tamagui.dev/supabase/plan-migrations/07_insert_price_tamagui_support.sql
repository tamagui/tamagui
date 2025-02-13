-- This file adds a price record for the "Tamagui Support" add-on.
-- It is set at $1000 per tier per month.
-- Users will specify the number of tiers (quantity) when subscribing.
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES (
  'price_1QrulKFQGtHoG6xcDs9OYTFu',
  'prod_RlRebXO307MLoH', -- Tamagui Support
  true,
  100000,  -- equivalent to $1000 per tier
  'usd',
  'recurring',
  'month',
  1,
  NULL,
  '{"plan": "support", "description": "Each tier provides 2 hours of prioritized development."}'
);