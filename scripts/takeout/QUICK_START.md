# Quick Start - Test the Migration

## Prerequisites

Make sure these environment variables are set:
```bash
export NEXT_PUBLIC_SUPABASE_URL="your-url"
export SUPABASE_SERVICE_ROLE_KEY="your-key"
export GITHUB_ADMIN_TOKEN="your-token"
```

## Step 1: Pick a Test User

```bash
tsx scripts/takeout/list-active-claims.ts
```

Pick any username from the output. For example, let's say you pick `exampleuser`.

## Step 2: Test Migration (Dry Run)

```bash
tsx scripts/takeout/migrate-to-team.ts --test-user exampleuser --dry-run
```

This will show you what WOULD happen without making any changes.

## Step 3: Run Real Migration for Test User

```bash
tsx scripts/takeout/migrate-to-team.ts --test-user exampleuser
```

Expected output:
```
============================================================
Migrating user: exampleuser
============================================================
Found claim ID: 123
Created at: 2023-05-15T10:30:00.000Z
Adding exampleuser to team early-access...
  ✅ Successfully added exampleuser (state: pending)
Removing exampleuser from takeout collaborators...
  ✅ Successfully removed exampleuser from takeout
Updating claim 123 to team-based access...
  ✅ Updated claim 123

✅ Migration completed successfully!
```

## Step 4: Verify the Migration

```bash
# Check they're in the team
gh api /orgs/tamagui/teams/early-access/memberships/exampleuser

# Expected output:
# {
#   "state": "pending",  # or "active" if they accepted
#   "role": "member"
# }
```

```bash
# Check they're removed from direct collaborators
gh api /repos/tamagui/takeout/collaborators/exampleuser

# Expected output:
# {
#   "message": "Not Found",
#   "status": "404"
# }
```

## Step 5: Test the Full Claim/Unclaim Flow

```bash
tsx scripts/takeout/test-claim-flow.ts exampleuser
```

This will test adding and removing them from the team.

## If Everything Looks Good

Migrate all users:

```bash
# First, dry run to see what will happen
tsx scripts/takeout/migrate-to-team.ts --all --dry-run

# Then migrate for real
tsx scripts/takeout/migrate-to-team.ts --all
```

## Troubleshooting

### "User already a team member"
This is fine! The script will skip adding them again.

### "Failed to add user to team: 404"
The GitHub username might not exist. Check the username is correct.

### "Failed to remove from repo: 404"
The user wasn't a direct collaborator. This is fine, the migration will continue.

### Permission Errors
Make sure your `GITHUB_ADMIN_TOKEN` has the correct permissions:
- `admin:org` scope for team management
- `repo` scope for repository access

## What Gets Changed

✅ User is added to `early-access` team
✅ User is removed from direct `takeout` collaborator list
✅ Claim record is updated with `team_slug` and `migrated_at`
✅ User now has access to both `takeout` and `takeout3` repos

## Rolling Back a User

If something goes wrong:

```bash
# Remove from team
tsx scripts/takeout/test-remove-from-team.ts exampleuser

# Re-add as direct collaborator
gh api /repos/tamagui/takeout/collaborators/exampleuser -X PUT -f permission=pull
```
