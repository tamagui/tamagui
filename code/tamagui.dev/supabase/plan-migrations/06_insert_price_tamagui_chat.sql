-- This file adds a price record for the "Tamagui Chat" add-on.
-- The add-on is priced at $200 per month.
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES (
  'price_1QrukQFQGtHoG6xcMpB125IR',
  'prod_RlRdUMAas8elvJ', -- Tamagui Chat
  true,
  20000,  -- equivalent to $200
  'usd',
  'recurring',
  'month',
  1,
  NULL,
  '{"plan": "chat"}'
);
