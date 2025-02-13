-- This file creates a new product record for the unified "Tamagui Start" plan.
-- The Tamagui Start plan integrates Takeout, Bento, Theme AI, Chat AI,
-- Discord #support, and Early Access features into a single subscription.
INSERT INTO products (id, active, name, description, image, metadata)
VALUES (
  'prod_RlRd2DVrG0frHe',
  true,
  'Tamagui Pro',
  'Unified plan including Takeout, Bento, Theme AI, Chat AI, Discord #support and early access to new features.',
  '', -- TODO: Add image
  '{"features": ["Takeout", "Bento", "Theme AI", "Chat AI", "Discord #support", "Early access"]}'
);
