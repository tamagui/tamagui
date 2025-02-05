-- This file adds a price record for the "Tamagui Start" plan.
-- The plan is priced at $200 per year.
-- The metadata may include information about auto-renewal options.
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES (
  'price_tamagui_start_yearly',
  'prod_tamagui_start',
  true,
  20000,  -- equivalent to $200
  'usd',
  'recurring',
  'year',
  1,
  NULL,
  '{"auto_renew": true}'
);
