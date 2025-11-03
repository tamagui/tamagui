# Deployment Plan: Team-Based Access Migration

## Overview

Migrating 1000+ Tamagui Pro subscribers from direct repository collaborator access to team-based access.

## Pre-Deployment Checklist

### ✅ Completed
- [x] Add `takeout` repo to `early-access` team
- [x] Implement new team-based helper functions
- [x] Update claim logic to use teams
- [x] Update unclaim logic to handle both systems
- [x] Create migration scripts with rate limiting
- [x] Test with single user successfully

### 🔲 Before Migration
- [ ] Verify environment variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GITHUB_ADMIN_TOKEN`
- [ ] Check GitHub API rate limits (should have 5000/hour available)
- [ ] Backup claims table (just in case)
- [ ] Notify team of migration window

## Migration Strategy

### Phase 1: Small Batch Test (10-20 users)
**Purpose**: Validate production script with real data

```bash
# Dry run first
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 10 --dry-run

# Real migration
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 10
```

**Validation**:
- [ ] Check 2-3 users manually in GitHub team UI
- [ ] Verify claims updated in database
- [ ] Verify users removed from direct collaborators
- [ ] Monitor for any errors

**If successful**: Proceed to Phase 2
**If issues**: Stop, fix, reset progress file, retry

### Phase 2: Medium Batch (50-100 users)
**Purpose**: Test at scale with resume capability

```bash
# Run with default batch size (50)
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 50
```

**Validation**:
- [ ] Check progress file is being updated
- [ ] Monitor rate limiting (should see ~750ms delays)
- [ ] Spot check several users
- [ ] Test resume capability by stopping and restarting

**If successful**: Proceed to Phase 3
**If issues**: Use `--resume` to continue, or stop and fix

### Phase 3: Full Migration (Remaining ~900 users)
**Purpose**: Complete the migration

```bash
# Resume from where Phase 2 left off
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 50 --resume
```

**Expected Duration**:
- ~1000 users × 750ms delay = ~12.5 minutes minimum
- With batch pauses: ~20-30 minutes total
- Can safely run in background

**Monitoring**:
- [ ] Watch for failures in console output
- [ ] Check progress periodically
- [ ] Verify rate limit isn't being hit (check for 403s)

## Post-Migration Checklist

### Immediate (After Migration Completes)
- [ ] Verify migration summary shows minimal failures
- [ ] Check GitHub team has ~1000 members
- [ ] Check direct collaborator count dropped to ~0-5
- [ ] Review any failed migrations and retry manually if needed

### Within 24 Hours
- [ ] Monitor for support tickets from users
- [ ] Check if users are accepting invitations
- [ ] Verify new subscriptions use team-based access
- [ ] Test cancellation flow (unclaim) with a test account

### Within 1 Week
- [ ] Confirm no issues reported
- [ ] Verify takeout3 access is working for users
- [ ] Check all new claims are using `team_slug`

## Code Deployment

### Deploy Updated Code
The new code is **backward compatible** so you can deploy before or during migration:

1. **Deploy these files**:
   - `code/tamagui.dev/features/github/helpers.ts`
   - `code/tamagui.dev/features/user/claim-product.ts`
   - `code/tamagui.dev/features/api/unclaimProduct.ts`

2. **Test in production**:
   - Have a new user claim access
   - Verify they get added to team (not repo)
   - Verify claim has `team_slug` in database

### Deploy Order Options

**Option A: Deploy First, Then Migrate** (Recommended)
- ✅ New users immediately get team-based access
- ✅ Old users continue working until migrated
- ✅ Less downtime
- ❌ Two systems running temporarily

**Option B: Migrate First, Then Deploy**
- ✅ All users on same system after deployment
- ❌ New users stuck on old system during migration
- ❌ Requires faster deployment

## Rollback Plan

### If Migration Fails Mid-Way
```bash
# Stop the migration (Ctrl+C)
# Review errors in console
# Fix issues in code or data
# Resume with:
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --resume
```

### If Need to Rollback Individual User
```bash
# Remove from team
tsx scripts/takeout/test-remove-from-team.ts <username>

# Re-add as direct collaborator
gh api /repos/tamagui/takeout/collaborators/<username> -X PUT -f permission=pull
```

### If Need to Rollback Code Deployment
1. Revert the 3 changed files
2. Old claims will continue to work
3. New claims will use old system (repo-based)
4. Migrated users stay in team (harmless)

## Rate Limiting Details

**GitHub API Limits**:
- 5000 requests/hour for authenticated requests
- We use 750ms delay = ~4800 requests/hour (safe buffer)

**Our Usage Per User**:
- 1 request to add to team
- 1 request to remove from repo
- = 2 GitHub API requests per user
- = ~1000 users × 2 = 2000 requests total

**Timeline**:
- With 750ms delay: ~25 minutes
- Well under the 1-hour rate limit window
- Can complete in single session

## Emergency Contacts

If issues arise:
- Check GitHub API status: https://www.githubstatus.com/
- Check Supabase status: https://status.supabase.com/
- Review script logs in console
- Check `.migration-progress.json` for state

## Success Criteria

Migration is successful when:
- ✅ >95% of users migrated successfully
- ✅ GitHub team has ~1000 members
- ✅ Direct collaborators reduced to < 10
- ✅ All claims have `team_slug` or `repository_name`
- ✅ New subscriptions work correctly
- ✅ Cancellations work correctly
- ✅ No user complaints about access issues

## Cleanup (After 1-2 Weeks of Stability)

Once everything is stable:
1. Remove legacy code (see README.md)
2. Delete `.migration-progress.json`
3. Delete migration scripts (or archive them)
4. Update documentation
5. Celebrate! 🎉
