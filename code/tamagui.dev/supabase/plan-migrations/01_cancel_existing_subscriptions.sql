-- This file cancels all active and trialing subscriptions.
-- It is used to cancel the old Takeout and Bento subscriptions
-- in preparation for migrating to the new Tamagui subscription models.
UPDATE subscriptions
SET status = 'canceled',
    canceled_at = NOW(),
    cancel_at = NOW(),
    cancel_at_period_end = true
WHERE status IN ('active', 'trialing');
