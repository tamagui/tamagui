-- This file adds a price record for the "Tamagui Chat" add-on.
-- The add-on is priced at $100 per month.
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES (
  'price_1QrukQFQGtHoG6xcMpB125IR',
  'prod_RlRdUMAas8elvJ', -- Tamagui Chat
  true,
  10000,  -- equivalent to $100
  'usd',
  'recurring',
  'month',
  1,
  NULL,
  '{"plan": "chat"}'
);
