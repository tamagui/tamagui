# Takeout Team Migration - Implementation Summary

## What Was Done

Successfully migrated the Tamagui Pro subscription system from direct repository collaborator access to team-based access.

### ✅ Completed Changes

1. **Added takeout repo to early-access team**
   - Both `takeout` and `takeout3` repos are now accessible via the team
   - Team members get automatic access to both repositories

2. **Created Migration Scripts**
   - `scripts/takeout/migrate-to-team.ts` - Main migration script
   - `scripts/takeout/list-active-claims.ts` - List all active claims
   - `scripts/takeout/test-add-to-team.ts` - Test adding users
   - `scripts/takeout/test-remove-from-team.ts` - Test removing users
   - `scripts/takeout/test-claim-flow.ts` - Test full claim/unclaim flow

3. **Updated GitHub Helper Functions** (`code/tamagui.dev/features/github/helpers.ts`)
   - Added `addUserToTeam()` - Add user to GitHub team
   - Added `removeUserFromTeam()` - Remove user from GitHub team
   - Added `checkIfUserIsTeamMember()` - Check team membership
   - Kept legacy functions for backward compatibility

4. **Updated Claim Logic** (`code/tamagui.dev/features/user/claim-product.ts`)
   - Added `claimTeamAccess()` - New team-based claim function
   - Updated `claimTakeoutForProPlan()` to use team-based access
   - Kept `claimRepositoryAccess()` for backward compatibility
   - New claims now store `team_slug` instead of `repository_name`

5. **Updated Unclaim Logic** (`code/tamagui.dev/features/api/unclaimProduct.ts`)
   - Updated `unclaimRepoAccess()` to handle both team and repo-based access
   - Checks for `team_slug` first, falls back to `repository_name` for legacy claims
   - Seamlessly handles migration period

## How the New System Works

### Claiming Access (New Users)
1. User purchases Tamagui Pro subscription
2. User clicks "Claim Repository Access" in account settings
3. System calls `claimTeamAccess()` which:
   - Checks if user is already a team member
   - Adds user to `early-access` team via GitHub API
   - Stores claim with `team_slug: 'early-access'`
4. User receives GitHub invitation to join the team
5. User now has access to both `takeout` and `takeout3` repos

### Unclaiming Access
1. User cancels subscription
2. Stripe webhook triggers `unclaimSubscription()`
3. System calls `unclaimRepoAccess()` which:
   - Checks if claim has `team_slug` (new system)
   - If yes: removes user from team
   - If no: removes user from repo (legacy system)

## Testing Plan

### Step 1: Find a Test User
```bash
tsx scripts/takeout/list-active-claims.ts
```

### Step 2: Test with Single User (Dry Run)
```bash
tsx scripts/takeout/migrate-to-team.ts --test-user <username> --dry-run
```

### Step 3: Test with Single User (Real)
```bash
tsx scripts/takeout/migrate-to-team.ts --test-user <username>
```

### Step 4: Verify
```bash
# Check team membership
gh api /orgs/tamagui/teams/early-access/memberships/<username>

# Check they were removed from direct collaborators
gh api /repos/tamagui/takeout/collaborators/<username>
# Should return 404
```

### Step 5: Test Full Claim/Unclaim Flow
```bash
tsx scripts/takeout/test-claim-flow.ts <username>
```

### Step 6: Migrate All Users
```bash
# Dry run first
tsx scripts/takeout/migrate-to-team.ts --all --dry-run

# Then migrate for real
tsx scripts/takeout/migrate-to-team.ts --all
```

## Database Changes

Claims now have two possible structures:

### New System (Team-based)
```json
{
  "claim_type": "team_access",
  "team_slug": "early-access",
  "user_github": {
    "id": 123456,
    "login": "username"
  },
  "role": "member"
}
```

### Legacy System (Repo-based)
```json
{
  "claim_type": "repo_access",
  "repository_name": "takeout",
  "user_github": {
    "id": 123456,
    "login": "username"
  },
  "permission": "pull"
}
```

### Migrated Claims
```json
{
  "claim_type": "team_access",
  "team_slug": "early-access",
  "user_github": {
    "id": 123456,
    "login": "username"
  },
  "role": "member",
  "migrated_at": "2025-11-03T12:34:56.789Z"
}
```

## Benefits

1. **Multi-repo Access**: Users automatically get access to both `takeout` and `takeout3`
2. **Easier Management**: Adding new repos just requires adding them to the team
3. **Better Auditing**: GitHub team UI makes it easy to see all members
4. **Cleaner API**: One team membership vs multiple collaborator invites
5. **Future-proof**: Easy to add more repositories to the subscription

## Backward Compatibility

The system maintains full backward compatibility during migration:
- New claims use team-based access
- Old claims continue to work via repository-based access
- Unclaim logic handles both systems automatically
- No disruption to existing subscribers

## Next Steps

1. ✅ Test with a single user
2. ⏳ Verify everything works correctly
3. ⏳ Migrate all users using the script
4. ⏳ Monitor for any issues
5. ⏳ After successful migration, optionally remove legacy code (see README)

## Code Locations

- **Helper Functions**: `code/tamagui.dev/features/github/helpers.ts:545-674`
- **Claim Logic**: `code/tamagui.dev/features/user/claim-product.ts:30-144`
- **Unclaim Logic**: `code/tamagui.dev/features/api/unclaimProduct.ts:53-77`
- **Migration Scripts**: `scripts/takeout/`
- **Documentation**: `scripts/takeout/README.md`
