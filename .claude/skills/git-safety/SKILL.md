---
name: git-safety
description: Git safety rules. INVOKE WHEN: git push, force push, git reset, git clean, destructive git, push force, reset hard. NEVER force push or do destructive git operations.
---

# git safety

rules for git operations in this repo.

## rules

- NEVER force push (`git push --force` or `git push -f`)
- NEVER `git reset --hard` without explicit permission
- NEVER `git clean -fd` without explicit permission
- prefer `git stash` over `git reset`
- always `git pull` before `git push`

## forbidden commands

these require EXPLICIT user permission:
- `git push --force`
- `git push -f`
- `git push --force-with-lease`
- `git reset --hard`
- `git clean -fd`
- `git checkout -- .` (discards all changes)

## safe alternatives

instead of `git reset --hard`:
- `git stash` to save changes
- `git stash pop` to restore

instead of force push:
- `git pull --rebase` then normal push
- ask user how to resolve conflicts

## workflow

1. `git pull` before making changes
2. make changes
3. `git add` relevant files
4. `git commit`
5. `git pull` again before push
6. `git push` (no force flags)
