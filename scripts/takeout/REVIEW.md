# Migration Review - Ready for Production

## What We Built

### ✅ Production-Ready Migration Script
**File**: `scripts/takeout/migrate-to-team-production.ts`

**Key Features**:
1. **Rate Limiting**: 750ms delay between API calls (~4800 req/hour, well under GitHub's 5000 limit)
2. **Batching**: Processes 50 users at a time (configurable)
3. **Progress Tracking**: Saves state to `.migration-progress.json`
4. **Resume Capability**: Can continue from where it left off if interrupted
5. **Error Handling**: Continues on individual failures, tracks all results
6. **Dry Run Mode**: Test without making changes

### ✅ Updated Application Code
**Files Changed**:
1. `code/tamagui.dev/features/github/helpers.ts` - New team functions
2. `code/tamagui.dev/features/user/claim-product.ts` - Team-based claiming
3. `code/tamagui.dev/features/api/unclaimProduct.ts` - Team-based unclaiming

**Backward Compatible**: Works with both old (repo-based) and new (team-based) claims

### ✅ Helper Scripts
1. `list-active-claims.ts` - View all active claims
2. `test-add-to-team.ts` - Test adding single user
3. `test-remove-from-team.ts` - Test removing single user
4. `test-claim-flow.ts` - Test full claim/unclaim cycle
5. `migrate-to-team.ts` - Simple migration (for testing)
6. `migrate-to-team-production.ts` - Production migration with all features

### ✅ Documentation
1. `README.md` - Quick reference guide
2. `QUICK_START.md` - Getting started
3. `DEPLOYMENT_PLAN.md` - **Full deployment plan with phases**
4. `IMPLEMENTATION_SUMMARY.md` - Technical details

## Current Status: 1 User Migrated

**User**: Freire71
- ✅ Added to `early-access` team (pending invitation acceptance)
- ✅ Removed from direct collaborators on `takeout`
- ✅ Claim #5091 updated with `team_slug` and `migrated_at`
- ✅ Claim/unclaim flow tested successfully

**Remaining**: ~999 users to migrate

## Rate Limiting Math

**Per User**:
- 1 API call to add to team
- 1 API call to remove from collaborators
- 1 Supabase update
- 750ms delay between requests
= ~1.5 seconds per user

**For 1000 Users**:
- ~2000 GitHub API requests
- ~25 minutes with delays
- ~30 minutes with batch pauses
- Well under GitHub's 5000 req/hour limit

## Safety Features

1. **Dry Run Testing**: Test everything without making changes
2. **Progress Saving**: Never lose progress, can always resume
3. **Skip Already Migrated**: Won't duplicate work
4. **Individual Error Handling**: One failure doesn't stop the whole migration
5. **Backward Compatibility**: Old system keeps working during migration
6. **Rollback Capability**: Can undo individual users or entire batches

## Recommended Migration Plan

### Phase 1: Small Test (10 users)
```bash
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 10 --dry-run
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 10
```
**Time**: ~2 minutes
**Validation**: Check manually

### Phase 2: Medium Test (50 users)
```bash
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 50
```
**Time**: ~5 minutes
**Validation**: Spot check, test resume

### Phase 3: Full Migration (remaining ~940 users)
```bash
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 50 --resume
```
**Time**: ~20-25 minutes
**Validation**: Check summary stats

## What Happens During Migration

For each user:
1. ✅ User invited to `early-access` team
2. ✅ User receives GitHub email invitation
3. ✅ User removed from direct `takeout` collaborators
4. ✅ Database claim updated with `team_slug: 'early-access'`
5. ✅ User now has access to BOTH `takeout` and `takeout3` repos

## What About New Users During Migration?

**If code deployed BEFORE migration**:
- ✅ New users get team-based access immediately
- ✅ Old users continue with repo access until migrated
- ✅ No disruption

**If code deployed AFTER migration**:
- ⚠️ New users get old repo-based access during migration
- ✅ Can migrate them later or manually add to team
- ⚠️ Slight delay for new users

**Recommendation**: Deploy code first, then migrate

## Deployment Order

### Option A: Deploy Code First (Recommended)
1. Deploy updated code to production
2. Test with a new subscription (should use team)
3. Run migration Phase 1 (10 users)
4. Validate
5. Run migration Phase 2 (50 users)
6. Validate
7. Run migration Phase 3 (remaining users)
8. Celebrate! 🎉

### Option B: Migrate First, Deploy After
1. Run migration Phase 1 (10 users)
2. Validate
3. Run migration Phase 2 (50 users)
4. Validate
5. Run migration Phase 3 (remaining users)
6. Deploy updated code
7. Test with new subscription

## Critical Files to Review Before Starting

1. **Deployment Plan**: `DEPLOYMENT_PLAN.md` - Read this carefully
2. **Production Script**: `migrate-to-team-production.ts` - Understand what it does
3. **Helper Functions**: `code/tamagui.dev/features/github/helpers.ts:545-674`
4. **Claim Logic**: `code/tamagui.dev/features/user/claim-product.ts:30-144`
5. **Unclaim Logic**: `code/tamagui.dev/features/api/unclaimProduct.ts:53-77`

## Environment Variables Check

Before starting, verify:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
echo $GITHUB_ADMIN_TOKEN
```

All should return values. If not, source your `.env` file.

## Post-Migration Monitoring

Watch for:
- [ ] Users accepting team invitations
- [ ] Access to `takeout3` working
- [ ] New subscriptions using team-based access
- [ ] Cancellations removing from team correctly
- [ ] Support tickets about access issues

## Questions to Answer Before Starting

1. **When to run the migration?**
   - Weekday vs weekend?
   - During low-traffic time?
   - With team available to monitor?

2. **Who monitors the migration?**
   - Who watches the console output?
   - Who handles failures?
   - Who responds to user issues?

3. **What's the rollback trigger?**
   - >10% failure rate?
   - Any specific error type?
   - User complaints?

4. **When to deploy the code?**
   - Before migration?
   - After migration?
   - During migration?

## Next Steps

1. **Review** `DEPLOYMENT_PLAN.md` thoroughly
2. **Decide** deployment vs migration order
3. **Schedule** a migration window
4. **Test** the production script with Phase 1 (10 users)
5. **Validate** everything works
6. **Proceed** with Phase 2 and 3
7. **Monitor** for 24-48 hours
8. **Celebrate** success! 🎉

---

**You are here**: Ready to start Phase 1 testing whenever you're ready!
