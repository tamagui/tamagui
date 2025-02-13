-- This file adds a price record for the "Tamagui Start" plan.
-- The plan is priced at $200 per year.
-- The metadata may include information about auto-renewal options.
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES (
  'price_1QrujmFQGtHoG6xc4UIilvAy',
  'prod_RlRd2DVrG0frHe', -- Tamagui Pro
  true,
  2000,  -- equivalent to $20
  'usd',
  'recurring',
  'month',
  1,
  NULL,
  '{"auto_renew": true}'
);
