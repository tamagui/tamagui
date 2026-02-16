# Subscription Analysis & Fixes (Feb 2026)

## Critical Issues Found & Fixed

### 1. WELCOMEBACK30 Coupon Not Working ✅ FIXED
- **Issue**: We sent 282 emails with WELCOMEBACK30 code, but the coupon had no promotion code
- **Fix**: Created promotion code linking to existing coupon
- **Verified**: API now returns valid for WELCOMEBACK30

### 2. V1_UPGRADE_35 Coupon Not Working ✅ FIXED
- **Issue**: Same problem - coupon existed but no promotion code
- **Fix**: Created promotion code `promo_1T1atsFQGtHoG6xcrCrbfXrS`

### 3. Expired Subscriptions Hidden in Account Modal ✅ FIXED
- **Issue**: Users with expired/canceled/past_due subscriptions saw nothing in their account
- **Fix**: Added detection for expired subscriptions
- **Fix**: Added yellow renewal banner with WELCOMEBACK30 code and CTA

## Production Stats (Current)

| Status | Count | Notes |
|--------|-------|-------|
| Active | 457 | Including 30 expiring in 30 days |
| Trialing | 15 | 14 expiring within 14 days, ALL missing payment method |
| Past Due | 25 | All migrated without payment method |
| Canceled (90d) | 364 | 308 by request, 56 payment failures |
| Incomplete Expired (90d) | 12 | |

## Scripts Created

```bash
# analyze production subscription states (READ-ONLY)
node scripts/analyze-prod-subscriptions.mjs --verbose

# test coupon API endpoint
node scripts/test-coupon-api.mjs --prod

# create promotion codes for coupons
node scripts/create-promotion-codes.mjs

# send payment reminder emails (already ran)
node scripts/send-payment-reminder-emails.mjs --dry-run
```

## Remaining Work

1. **Cancel 25 past_due subscriptions** - These will never charge successfully
   - Run: `node scripts/cleanup-past-due-migrations.mjs`

2. **Monitor 15 trialing subs** - Expiring in days with no payment method
   - Already emailed via send-payment-reminder-emails.mjs

3. **Test account modal UI** - Verify expired banner displays correctly
