---
name: release-safety
description: Release safety rules. INVOKE WHEN: yarn release, npm publish, release canary, release packages, publishing, skip checks, skip tests. NEVER skip checks or tests without explicit permission.
---

# release safety

rules for running releases in this monorepo.

## rules

- NEVER add `--skip-checks` unless user explicitly says "skip checks"
- NEVER add `--skip-tests` unless user explicitly says "skip tests"
- if checks or tests fail, FIX THE ISSUES instead of skipping
- ask user before adding any skip flags
- the point of checks is to catch problems before publishing

## when things fail

1. read the error output carefully
2. fix the underlying issue
3. re-run the release
4. do NOT just skip the failing step

## common flags

safe flags:
- `--canary` - publish canary version
- `--ci` - run in ci mode
- `--dirty` - allow dirty working directory
- `--build-fast` - faster builds

dangerous flags (require explicit permission):
- `--skip-checks` - skips type checking
- `--skip-tests` - skips test suite
- `--skip-build` - skips building packages
