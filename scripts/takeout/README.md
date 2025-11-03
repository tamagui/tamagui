# Takeout Team Migration Scripts

Scripts to migrate Tamagui Pro subscribers from direct repository collaborator access to team-based access.

**📖 For full deployment instructions, see [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)**

## Prerequisites

Make sure you have the following environment variables set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GITHUB_ADMIN_TOKEN`

## Quick Start - Testing with a Single User

### 1. List active claims to find a test user

```bash
tsx scripts/takeout/list-active-claims.ts
```

This will show all active takeout claims with usernames. Pick one for testing.

### 2. Test the migration with a single user

First, do a dry run to see what would happen:

```bash
tsx scripts/takeout/migrate-to-team.ts --test-user <github-username> --dry-run
```

Then run it for real:

```bash
tsx scripts/takeout/migrate-to-team.ts --test-user <github-username>
```

This will:
1. Add the user to the `early-access` team
2. Remove them from direct collaborator access on the `takeout` repo
3. Update their claim record to mark it as migrated

### 3. Verify the migration worked

Check the team membership:

```bash
gh api /orgs/tamagui/teams/early-access/memberships/<github-username>
```

Check they were removed from collaborators:

```bash
gh api /repos/tamagui/takeout/collaborators/<github-username>
# Should return 404
```

## Testing Helper Scripts

### Test adding a user to the team

```bash
tsx scripts/takeout/test-add-to-team.ts <github-username>
```

### Test removing a user from the team

```bash
tsx scripts/takeout/test-remove-from-team.ts <github-username>
```

## Full Migration (Production)

Once you've tested with a single user and verified everything works, use the production script with rate limiting and batching:

### Test with small batch (dry run)

```bash
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 10 --dry-run
```

### Migrate small batch (10 users)

```bash
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 10
```

### Migrate all users (production)

```bash
# Default batch size is 50
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --batch-size 50
```

### Resume if interrupted

```bash
npx dotenv-cli -e code/tamagui.dev/.env -- npx tsx scripts/takeout/migrate-to-team-production.ts --resume
```

**Features**:
- ⏱️ Rate limiting (750ms between requests)
- 📦 Batching (default 50 users per batch)
- 💾 Progress tracking (saved to `.migration-progress.json`)
- 🔄 Resume capability
- 📊 Detailed progress reporting

## What Gets Migrated

The migration script:
- ✅ Adds users to the `early-access` team (gives access to both `takeout` and `takeout3`)
- ✅ Removes users from direct collaborator access on `takeout` repo
- ✅ Updates claim records with `team_slug` and `migrated_at` timestamp
- ✅ Preserves all original claim data

## Rollback

If you need to rollback a user:

```bash
# Remove from team
tsx scripts/takeout/test-remove-from-team.ts <github-username>

# Re-add as direct collaborator
gh api /repos/tamagui/takeout/collaborators/<github-username> -X PUT -f permission=pull
```

## Verification Commands

```bash
# List all team members
gh api /orgs/tamagui/teams/early-access/members

# List all repos the team has access to
gh api /orgs/tamagui/teams/early-access/repos --jq '.[].name'

# Count direct collaborators (should decrease after migration)
gh api /repos/tamagui/takeout/collaborators --jq 'length'
```

## Testing the Full Flow

Test the complete claim/unclaim cycle:

```bash
tsx scripts/takeout/test-claim-flow.ts <github-username>
```

This will:
1. Check current team membership
2. Add user to team (simulating claim)
3. Verify membership
4. Remove user from team (simulating unclaim)
5. Verify removal

## After Migration - Code Cleanup

Once ALL users have been migrated successfully and you've verified everything works:

### Optional: Remove Legacy Code

The following functions can be removed after migration is complete:
- `claimRepositoryAccess` in `code/tamagui.dev/features/user/claim-product.ts` (line 146-213)
- Legacy portions of `unclaimRepoAccess` in `code/tamagui.dev/features/api/unclaimProduct.ts` (line 70-76)
- `inviteCollaboratorToRepo` in `code/tamagui.dev/features/github/helpers.ts` (if not used elsewhere)
- `removeCollaboratorFromRepo` in `code/tamagui.dev/features/github/helpers.ts` (if not used elsewhere)
- `checkIfUserIsCollaborator` in `code/tamagui.dev/features/github/helpers.ts` (if not used elsewhere)

**Important**: Only remove these after confirming:
- All claims have `team_slug` in their data
- No active claims still use `repository_name` without `team_slug`
- The system has been running with team-based access for a while without issues
