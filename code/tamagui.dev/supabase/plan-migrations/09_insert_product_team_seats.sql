-- This file creates a new product record for the "Tamagui Pro Team Seats" plan.
-- The Team Seats plan allows customers to add additional seats to their Pro plan.
INSERT INTO products (id, active, name, description, image, metadata)
VALUES (
  'prod_Rxu0x7jR0nWJSv',
  true,
  'Tamagui Pro Team Seats',
  'Additional seats for Tamagui Pro plan, allowing team members to access all Pro features.',
  '', -- No image needed for add-on product
  '{"features": ["Additional team member access", "All Pro features per seat"], "claim_type": "team_seats"}'
); 