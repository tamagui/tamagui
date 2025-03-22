-- This file adds price records for the "Tamagui Pro Team Seats" plan.
-- Two price options are available:
-- 1. Subscription price: $100/seat/year with auto-renewal
-- 2. One-time price: $100/seat/year without auto-renewal

-- Subscription price with auto-renewal
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES (
  'price_1R3yCAFQGtHoG6xcatVUMGL4',
  'prod_Rxu0x7jR0nWJSv', -- Tamagui Pro Team Seats
  true,
  10000,  -- $100 per seat per year
  'usd',
  'recurring',
  'year',
  1,
  NULL,
  '{"auto_renew": true, "seat_type": "team_member"}'
);

-- One-time price without auto-renewal
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES (
  'price_1R3yCaFQGtHoG6xcwQ8EtfDu',
  'prod_Rxu0x7jR0nWJSv', -- Tamagui Pro Team Seats
  true,
  10000,  -- $100 per seat per year
  'usd',
  'one_time',
  NULL,
  NULL,
  NULL,
  '{"auto_renew": false, "seat_type": "team_member"}'
); 