# Takeout Subscription Management Scripts

## Overview

These scripts help manage the sync between Stripe subscriptions and GitHub team access for Tamagui's takeout products (Tamagui Pro, Takeout Stack, Team Seats).

## How It Works

1. **Customers subscribe** to Tamagui Pro or Takeout Stack in Stripe
2. **Webhook creates claim** in database with `team_slug: 'early-access'`
3. **User claims access** via the website, which adds them to GitHub `early-access` team
4. **Subscription cancels** → webhook marks claim as unclaimed and removes from GitHub team

## Products That Grant Early Access

- **Tamagui Pro** (`prod_RlRd2DVrG0frHe`) - includes takeout access
- **Takeout Stack** (`prod_NzLEazaqBgoKnC`) - standalone takeout
- **Tamagui Pro Team Seats** (`prod_Rxu0x7jR0nWJSv`) - team subscriptions

## Available Scripts

### 1. `check-discord-sync.ts`
**Purpose:** Audit Discord Takeout role vs active Stripe subscriptions

```bash
npx tsx scripts/takeout/check-discord-sync.ts
```

**Shows:**
- Discord users with Takeout role
- Active Stripe subscriptions
- Users who should be removed (no active subscription)
- Users without mapping (old accounts)

**Creates:** `tmp/discord-users-to-remove-*.json` with users to remove

**Use when:** You want to audit Discord access or find stale Discord users

---

### 2. `remove-discord-users.ts`
**Purpose:** Remove Discord Takeout role from users based on analysis file

```bash
# Dry run first
npx tsx scripts/takeout/remove-discord-users.ts tmp/discord-users-to-remove-*.json --dry-run

# Then actually remove
npx tsx scripts/takeout/remove-discord-users.ts tmp/discord-users-to-remove-*.json
```

**Use when:** After reviewing the discord-users-to-remove file and confirming it's safe

---

### 3. `check-subscription-sync.ts`
**Purpose:** Audit sync between Stripe subscriptions and GitHub team membership

```bash
npx tsx scripts/takeout/check-subscription-sync.ts
```

**Shows:**
- Active Stripe subscriptions count
- GitHub team members (active + pending)
- Database claims count
- Discrepancies between systems

**Use when:** You suspect sync issues or want to verify everything is working

---

### 2. `check-webhook-events.ts`
**Purpose:** View recent Stripe webhook events to debug issues

```bash
npx tsx scripts/takeout/check-webhook-events.ts [--limit 100]
```

**Shows:**
- Recent webhook events by type
- Recent subscription events (created/updated/deleted)
- Webhook endpoint configuration

**Use when:** Debugging webhook issues or verifying webhooks are being received

---

### 3. `analyze-stale-claims.ts`
**Purpose:** Find claims for cancelled subscriptions that need cleanup

```bash
npx tsx scripts/takeout/analyze-stale-claims.ts
```

**Creates files in `/tmp/`:**
- `active-subscriptions-*.json` - All active Stripe subscription IDs
- `valid-claims-*.json` - Claims that should be kept
- `stale-claims-*.json` - Claims to clean up (subscriptions cancelled)
- `cleanup-summary-*.txt` - Summary report

**Use when:** You want to identify and review stale claims before cleanup

---

### 4. `cleanup-stale-claims.ts`
**Purpose:** Clean up stale claims (mark as unclaimed)

```bash
# Dry run first
npx tsx scripts/takeout/cleanup-stale-claims.ts tmp/stale-claims-*.json --dry-run

# Then actually clean up
npx tsx scripts/takeout/cleanup-stale-claims.ts tmp/stale-claims-*.json
```

**Use when:** After reviewing the stale claims file and confirming it's safe to clean up

---

## Bug History

### Critical Bug Fixed (Nov 2024)

**Location:** `code/tamagui.dev/features/api/unclaimProduct.ts`

**Problem:** When subscriptions were cancelled, the webhook tried to update claims but was missing the WHERE clause:

```typescript
// BEFORE (BROKEN)
await supabaseAdmin.from('claims').update({
  unclaimed_at: Number(new Date()).toString(),
})
// This tried to update ALL claims in the database!
```

**Fix:**
```typescript
// AFTER (FIXED)
await supabaseAdmin
  .from('claims')
  .update({
    unclaimed_at: new Date().toISOString(),
  })
  .eq('id', claim.id)  // ← Added WHERE clause
```

**Additional fixes:**
- Added `await` before `unclaimRepoAccess()` call
- Added fallback to 'early-access' team for old claims without `team_slug`
- Fixed date format to use ISO string
- **Added Discord role removal** - now removes Takeout role from Discord when subscriptions cancel

---

## Migration History (Nov 2024)

Migrated from direct repo collaborator access to GitHub team-based access:

**Before:**
- Users added as collaborators to individual repos
- Claims had `repository_name: 'takeout'` or `'unistack'`

**After:**
- Users added to `early-access` GitHub team
- Team has access to all relevant repos
- Claims have `team_slug: 'early-access'`

**Migration Stats:**
- Invited 197 active subscribers to GitHub team
- Removed 40 users from Discord Takeout role (cancelled subscriptions)
- Cleaned up 590 stale claims from cancelled subscriptions
- Fixed webhook bugs preventing future stale claims and Discord cleanup

---

## Current State (as of Nov 2024)

- **Active Stripe Subscriptions:** ~370
- **GitHub Team Members:** ~350 (active + pending)
- **Discord Takeout Role:** ~27 users (active subscriptions only)
- **Webhooks:** Working correctly
- **Claim Creation:** Properly sets `team_slug`
- **Claim Cleanup:** Properly marks as unclaimed on cancellation
- **Discord Cleanup:** Removes Takeout role and deletes discord_invites on cancellation

---

## Environment Variables Required

All scripts need these environment variables (automatically loaded from `code/tamagui.dev/.env`):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `GITHUB_ADMIN_TOKEN` - GitHub PAT with org/team admin access
- `DISCORD_BOT_TOKEN` - Discord bot token (for Discord sync scripts)

---

## Common Tasks

### Check if sync is healthy
```bash
npx tsx scripts/takeout/check-subscription-sync.ts
npx tsx scripts/takeout/check-discord-sync.ts
```

### Debug webhook issues
```bash
npx tsx scripts/takeout/check-webhook-events.ts
```

### Monthly cleanup of stale claims
```bash
# 1. Analyze
npx tsx scripts/takeout/analyze-stale-claims.ts

# 2. Review the files in /tmp/

# 3. Clean up
npx tsx scripts/takeout/cleanup-stale-claims.ts tmp/stale-claims-*.json
```

### Monthly Discord cleanup
```bash
# 1. Check Discord sync
npx tsx scripts/takeout/check-discord-sync.ts

# 2. Review tmp/discord-users-to-remove-*.json

# 3. Remove users with cancelled subscriptions
npx tsx scripts/takeout/remove-discord-users.ts tmp/discord-users-to-remove-*.json
```

---

## Troubleshooting

### "Subscriptions without claims"
Some subscriptions may not have claims if:
- User hasn't clicked "Claim Access" on the website yet
- Webhook failed when subscription was created
- User subscribed before claim system existed

**Solution:** Users can claim access by visiting their account page on tamagui.dev

### "Users not in GitHub team"
If active subscribers aren't in the team:
- Check if they have claimed access on the website
- Run `check-subscription-sync.ts` to identify missing users
- Verify webhooks are working with `check-webhook-events.ts`

### "Stale claims piling up"
If claims aren't being marked as unclaimed:
- Verify the bug fix in `unclaimProduct.ts` is deployed
- Check webhook events are being received
- Look for errors in webhook logs

---

## Related Files

- `code/tamagui.dev/app/api/stripe/webhook+api.ts` - Stripe webhook handler
- `code/tamagui.dev/features/api/unclaimProduct.ts` - Unclaim logic (GitHub + Discord removal)
- `code/tamagui.dev/features/user/claim-product.ts` - Claim creation logic
- `code/tamagui.dev/features/github/helpers.ts` - GitHub team management
- `code/tamagui.dev/features/discord/helpers.ts` - Discord client and constants
- `code/tamagui.dev/app/api/discord/channel+api.ts` - Discord channel management
- Database tables: `claims`, `discord_invites`, `subscriptions`
